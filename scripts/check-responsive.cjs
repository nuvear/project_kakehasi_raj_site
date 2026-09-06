/* Browser layout audit. PLAYWRIGHT_MODULE may point to an existing Playwright install. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
const main = process.env.SITE_BASE || 'http://127.0.0.1:3013';
const cc = process.env.CC_BASE || 'http://127.0.0.1:3014';
const output = process.env.RESPONSIVE_OUTPUT || '/tmp/responsive-after.json';
const widths = (process.env.WIDTHS || '1440,1024,768,390,320').split(',').map(Number);
const mainRoutes = JSON.parse(fs.readFileSync('docs/verification/campus-coast-public-routes.json')).routes.map(r => r.path);
const ccRoutes = JSON.parse(fs.readFileSync('docs/verification/campus-coast-command-center-routes.json')).map(r => '/apps/ai-transformation-command-center' + (r.path === '/' ? '' : r.path));
const targets = [...mainRoutes.map(path => ({base:main,path})), ...ccRoutes.map(path => ({base:cc,path})), {base:'https://www.rajagobalan.com',path:'/diary'}];
(async () => {
 const browser = await chromium.launch({headless:true,channel:'chrome'});
 const results=[];
 for (const width of widths) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  // Read-only API transport for local preview; never submit or alter business data.
  await page.route('http://localhost:8000/**', async route => {
   if(route.request().method()!=='GET')return route.abort();
   const response=await route.fetch({url:route.request().url().replace('http://localhost:8000','https://command-center-api-537634522206.us-central1.run.app')});
   await route.fulfill({response});
  });
  for (const {base,path} of targets.filter(t => !process.env.PATH_FILTER || t.path.includes(process.env.PATH_FILTER))) {
   try {
    const response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(450);
    await page.evaluate(()=>document.fonts.ready);
    const data=await page.evaluate(()=>{
     const clipped=[...document.querySelectorAll('main *')].filter(el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      if(r.width===0||s.visibility==='hidden'||r.right<=innerWidth+2)return false;
      for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
       const ps=getComputedStyle(p);if(['auto','scroll'].includes(ps.overflowX))return false;
      }
      return true;
     }).slice(0,8).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,80)}));
     return {scrollWidth:document.documentElement.scrollWidth,clipped};
    });
    results.push({path,width,status:response.status(),...data});
    if(data.scrollWidth>width+2||data.clipped.length)console.log('ISSUE',width,path,JSON.stringify(data));
   }catch(e){results.push({path,width,error:e.message});console.log('ERROR',path,e.message.slice(0,100));}
   fs.writeFileSync(output,JSON.stringify(results,null,2));
  }
  await page.close();console.log('Completed',width);
 }
 await browser.close();
 console.log('Checked',results.length,'page/viewport combinations');
})();
