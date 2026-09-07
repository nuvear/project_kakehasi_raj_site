/** Run against the deployed diary using two disposable Firebase test accounts.
 * No emails are sent. Accounts, diary state, memberships and audit entries are removed.
 */
import {execFileSync} from 'node:child_process';
import {randomUUID,randomBytes} from 'node:crypto';
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';

import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.argv[2];if(!base?.startsWith('https://'))throw Error('Pass the exact HTTPS diary origin including /diary');
const config=JSON.parse(readFileSync(new URL('../lib/firebase-config.json',import.meta.url)));
initializeApp({projectId:config.projectId,credential:{getAccessToken:async()=>({access_token:execFileSync('gcloud',['auth','print-access-token'],{encoding:'utf8'}).trim(),expires_in:300})}});
const admin=getAuth(),created=[];
const firestoreBase=`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
async function firestore(path,method='GET',data){const access=execFileSync('gcloud',['auth','print-access-token'],{encoding:'utf8'}).trim();const response=await fetch(firestoreBase+path,{method,headers:{Authorization:`Bearer ${access}`,'x-goog-user-project':config.projectId,'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});if(!response.ok&&response.status!==404)throw new Error(`Firestore test setup: ${response.status}`);return response.status===404?null:response.json();}
const results=[];
const request=async(path,token,method='GET',data)=>{const res=await fetch(`${base}/api/${path}`,{method,headers:{...(token?{Authorization:`Bearer ${token}`}:{ }),...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});return {status:res.status,body:await res.json()};};
try{
 for(let i=0;i<2;i++){
  const uid=`diary-smoke-${randomUUID()}`,email=`${uid}@example.invalid`,password=randomBytes(24).toString('base64url');
  await admin.createUser({uid,email,password,emailVerified:true});created.push(uid);
  const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
  const data=await response.json();assert.equal(response.status,200,'Email/password sign-in');results.push({uid,email,token:data.idToken});
 }
 const [a,b]=results;
 assert.equal((await request('state')).status,401);assert.equal((await request('content','invalid')).status,401);
 assert.equal((await request('account',a.token,'POST')).body.member.status,'pending');
 assert.equal((await request('content',a.token)).status,403);
 await firestore(`/diaryMembers/${a.uid}?updateMask.fieldPaths=status&updateMask.fieldPaths=role`,'PATCH',{fields:{status:{stringValue:'active'},role:{stringValue:'admin'}}});
 assert.equal((await request('account',b.token,'POST')).body.member.status,'pending');
 assert.equal((await request('members',a.token,'PATCH',{uid:b.uid,role:'participant',status:'active'})).status,200);
 const book=await request('content',a.token);assert.equal(book.status,200);assert.equal(book.body.weeks.length,12);
 const start=await request('state',a.token);assert.equal(start.status,200);const state={...start.body.state,reflections:{week3_q0:'Disposable integration-test reflection'},userProgress:{1:'done'}};
 assert.equal((await request('state',a.token,'PUT',{state,version:0})).status,200);
 assert.equal((await request('state',a.token)).body.state.reflections.week3_q0,state.reflections.week3_q0);
 assert.equal((await request('state',a.token,'PUT',{state,version:0})).status,409);
 const other=await request(`state?uid=${a.uid}`,b.token);assert.equal(other.status,200);assert.equal(other.body.state.reflections.week3_q0,undefined);
 assert.equal((await request('members',b.token)).status,403);
 // Firebase clients must not bypass the server and read private collections directly.
 const direct=await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/diaryStates/${a.uid}`,{headers:{Authorization:`Bearer ${b.token}`}});assert.equal(direct.status,403);
 assert.equal((await request('members',a.token,'PATCH',{uid:b.uid,role:'participant',status:'revoked'})).status,200);
 assert.equal((await request('state',b.token)).status,403);
 console.log('PASS: live email/password, pending approval, admin approval, 12 chapters, Firestore persistence, version conflicts, cross-user isolation, direct Firestore denial, participant admin denial and immediate revocation.');
}finally{
 for(const uid of created){
 await firestore(`/diaryStates/${uid}`,'DELETE');await firestore(`/diaryMembers/${uid}`,'DELETE');
 const audits=await firestore(':runQuery','POST',{structuredQuery:{from:[{collectionId:'diaryAccessAudit'}],where:{fieldFilter:{field:{fieldPath:'actor'},op:'EQUAL',value:{stringValue:uid}}}}});
 for(const row of audits||[])if(row.document)await firestore('/'+row.document.name.split('/documents/')[1],'DELETE');
 await admin.deleteUser(uid);
}
 console.log(`Removed ${created.length} disposable accounts and their test records.`);
}
