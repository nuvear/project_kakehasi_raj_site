#!/usr/bin/env python3
"""Read-only checks of the public release contract, redirects and discoverability."""
import argparse, concurrent.futures, json, urllib.request, urllib.error
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlsplit

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.headings=0; self.canonical=None; self.ids=set(); self.toc=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='h1': self.headings+=1
        if 'id' in a: self.ids.add(a['id'])
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='a' and urlsplit(a.get('href','')).fragment.startswith('part-'): self.toc.append(urlsplit(a['href']).fragment)
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None
parser=argparse.ArgumentParser(); parser.add_argument('base'); parser.add_argument('--output',required=True); args=parser.parse_args()
base=args.base.rstrip('/'); opener=urllib.request.build_opener(NoRedirect())
def read(path):
    try:
        r=opener.open(base+path,timeout=45)
    except urllib.error.HTTPError as e: r=e
    with r: return r.status,{k.lower(): v for k,v in r.headers.items()},r.read().decode()
checks=[]
def record(name, ok, **detail): checks.append(dict(check=name,passed=bool(ok),**detail))
status,headers,body=read('/sitemap.xml')
root=ET.fromstring(body); urls=[x.text for x in root.findall('{*}url/{*}loc')]
paths=[urlsplit(u).path for u in urls]
record('xml sitemap',status==200 and 'xml' in headers.get('content-type','') and len(paths)==38,count=len(paths))
record('only canonical published routes',all(u.startswith('https://www.rajagobalan.com/') for u in urls) and all('/frameworks/' not in p and '/to-do-list' not in p and '/docs/deployment' not in p for p in paths))
def inspect(path):
    status,_,body=read(path); page=Page(); page.feed(body)
    return dict(path=path,status=status,h1=page.headings,canonical=page.canonical,missingAnchors=[i for i in page.toc if i not in page.ids])
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for r in pool.map(inspect,paths):
        record('published page',r['status']==200 and r['h1']==1 and r['canonical']=='https://www.rajagobalan.com'+r['path'] and not r['missingAnchors'],**r)
status,headers,body=read('/robots.txt')
record('robots text',status==200 and 'text/plain' in headers.get('content-type','') and 'Sitemap: https://www.rajagobalan.com/sitemap.xml' in body and '<html' not in body)
gate='/en/apps/ai-transformation-command-center'
redirects={p:gate for p in ['/framework.html','/ai-transformation-command-center.html','/deployment-guide.html','/apps/ai-transformation-command-center','/apps/ai-transformation-command-center/dashboard','/apps/ai-transformation-command-center/roi','/en/frameworks/enterprise-ai-transformation','/en/apps/ai-transformation-command-center/docs/deployment']}
redirects.update({'/ja/frameworks/enterprise-ai-transformation':'/ja/apps/ai-transformation-command-center','/ja/apps/ai-transformation-command-center/docs/deployment':'/ja/apps/ai-transformation-command-center','/en/apps/to-do-list':'/en/insights','/ja/apps/to-do-list':'/ja/insights','/blogs.html':'/en/insights','/blogs':'/en/insights'})
for path,target in redirects.items():
    status,headers,_=read(path); location=headers.get('Location',headers.get('location',''))
    record('retired route redirect',status in [301,308] and urlsplit(location).path==target,path=path,status=status,location=location)
for path in ['/en/does-not-exist','/unknown.html','/sitemap.xml/insights']:
    status,_,body=read(path); record('unknown path is not a duplicate homepage',status==404,path=path,status=status)
status,_,body=read('/api/ingest')
record('public content writer retired',status==410 and 'retired' in body.lower(),status=status)
for entity_id in ['app.ai-transformation-command-center', 'insight.enterprise-ai-reference-guide', 'framework.enterprise-ai-transformation', 'app.to-do-list']:
    request=urllib.request.Request(base+'/api/mcp/tools/get_entity',data=json.dumps({'id':entity_id,'locale':'en'}).encode(),headers={'Content-Type':'application/json'})
    try: response=opener.open(request,timeout=45)
    except urllib.error.HTTPError as e: response=e
    with response: status=response.status; data=json.load(response)
    retired=entity_id.startswith('framework.') or entity_id=='app.to-do-list'
    expected_text='GATE' if entity_id.startswith('app.') else 'Part XXI: The Portfolio Review Checklist'
    ok=status==404 if retired else status==200 and expected_text in json.dumps(data)
    record('public API uses current publication',ok,entity_id=entity_id,status=status)
report={'base':base,'checks':checks}; open(args.output,'w').write(json.dumps(report,indent=2))
failed=[c for c in checks if not c['passed']]; print(json.dumps({'checks':len(checks),'failed':failed},indent=2)); raise SystemExit(bool(failed))
