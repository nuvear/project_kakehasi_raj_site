"""Add only diary routes to the live Firebase Hosting version; preserve all assets."""
import copy,json,pathlib,subprocess,sys,time,urllib.request,urllib.parse
repo=pathlib.Path(__file__).resolve().parents[3]
record=repo/'docs/diary-hosting-release.json'
base='https://firebasehosting.googleapis.com/v1beta1/'
access=subprocess.check_output(['gcloud','auth','print-access-token'],text=True).strip()
headers={'Authorization':'Bearer '+access,'x-goog-user-project':'rajagobalan-site','Content-Type':'application/json'}
def request(path,method='GET',data=None):
    req=urllib.request.Request(base+path,headers=headers,method=method,data=json.dumps(data).encode() if data is not None else None)
    return json.load(urllib.request.urlopen(req))
def save(data):record.write_text(json.dumps(data,indent=2)+'\n')
mode=sys.argv[1]
if mode=='prepare':
    if record.exists():
        state=json.loads(record.read_text())
    else:
        latest=request('sites/rajagobalan-site/releases?pageSize=1')['releases'][0]
        version=request(latest['version']['name'])
        config=copy.deepcopy(version['config'])
        assert not any(r.get('glob','').startswith('/diary') for r in config['rewrites'])
        index=next(i for i,r in enumerate(config['rewrites']) if r.get('glob')=='**')
        routes=[{'glob':path,'run':{'serviceId':'ai-leadership-diary','region':'us-central1'}} for path in ['/diary','/diary/**']]
        config['rewrites'][index:index]=routes
        operation=request('sites/rajagobalan-site/versions:clone','POST',{'sourceVersion':version['name'],'finalize':False})
        state={'previousVersion':version['name'],'previousRelease':latest['name'],'config':config,'operation':operation['name']}
        save(state)
    operation=request(state['operation'])
    for _ in range(10):
        if operation.get('done'):break
        time.sleep(2);operation=request(state['operation'])
    if not operation.get('done'):print('Clone still preparing; rerun prepare.');sys.exit(0)
    if operation.get('error'):raise RuntimeError(operation['error'])
    state['version']=operation['response']['name']
    version=request(state['version']+'?updateMask=config','PATCH',{'config':state['config']})
    assert version['config']==state['config'];save(state)
    print('Prepared version:',state['version'])
elif mode=='release':
    state=json.loads(record.read_text());assert state.get('version')
    latest=request('sites/rajagobalan-site/releases?pageSize=1')['releases'][0]
    assert latest['version']['name']==state['previousVersion'],'Live version changed; reconcile before publishing.'
    previous=request(state['previousVersion']);new=request(state['version'])
    def files(version):
        result={};cursor=None
        while True:
            query=urllib.parse.urlencode({'pageSize':1000,**({'pageToken':cursor} if cursor else {})})
            page=request(version+'/files?'+query)
            result.update({f['path']:f['hash'] for f in page.get('files',[])})
            cursor=page.get('nextPageToken')
            if not cursor:return result
    assert files(state['previousVersion'])==files(state['version']),'Static files changed.' 
    stripped=copy.deepcopy(state['config']);stripped['rewrites']=[r for r in stripped['rewrites'] if r.get('glob') not in ['/diary','/diary/**']]
    assert stripped==previous['config'],'Unexpected changes outside diary routes.'
    finalized=request(state['version']+'?updateMask=status','PATCH',{'status':'FINALIZED'})
    assert finalized['status']=='FINALIZED'
    release=request('sites/rajagobalan-site/releases?'+urllib.parse.urlencode({'versionName':state['version']}),'POST',{'message':'Add AI Leadership Diary at /diary; preserve existing routes and static files.'})
    state['release']=release['name'];save(state);print('Published:',release['name'])
else:raise ValueError('Choose prepare or release')
