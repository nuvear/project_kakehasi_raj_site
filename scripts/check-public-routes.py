#!/usr/bin/env python3
"""Read-only HTTP crawl of EN/JA first-party pages; no browser/interaction claims."""
import argparse, concurrent.futures, json, urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=set()
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag == 'a' and 'href' in attrs: self.links.add(attrs['href'])

parser=argparse.ArgumentParser()
parser.add_argument('base'); parser.add_argument('--output', default='/tmp/campus-route-check.json')
args=parser.parse_args(); base=args.base.rstrip('/'); origin=urlsplit(base).netloc
seen=set(); pending={'/en','/ja'}; results=[]; external=set()
def read(path):
    try:
        with urllib.request.urlopen(base+path, timeout=45) as response:
            page=response.read().decode(); links=Links(); links.feed(page)
            return path,response.status,links.links
    except Exception as error: return path,str(error),set()
for depth in range(8):
    batch=sorted(pending-seen)
    if not batch: break
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for path,status,links in pool.map(read,batch):
            seen.add(path); results.append({'path':path,'status':status})
            for link in links:
                url=urlsplit(urljoin(base+path,link))
                if url.netloc in {origin,'www.rajagobalan.com'} and (url.path.startswith('/en') or url.path.startswith('/ja')):
                    pending.add(url.path)
                elif url.scheme in {'https','http'}: external.add(url.geturl())
report={'base':base,'routes':results,'outside_locale_routes':sorted(external)}
with open(args.output,'w') as out: json.dump(report,out,indent=2)
failed=[r for r in results if r['status']!=200]
print(json.dumps({'checked':len(results),'failed':failed,'outside_locale_routes':sorted(external)},indent=2))
raise SystemExit(bool(failed))
