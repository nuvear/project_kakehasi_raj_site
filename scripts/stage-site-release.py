#!/usr/bin/env python3
"""Stage only main-site build inputs; exclude diary/private and unrelated files."""
from pathlib import Path
import hashlib,json,shutil,tempfile
root=Path(__file__).resolve().parents[1]
out=Path(tempfile.mkdtemp(prefix='campus-site-release-'))
for name in ['package.json','pnpm-lock.yaml','pnpm-workspace.yaml','turbo.json','Dockerfile','.dockerignore']:
    shutil.copy2(root/name,out/name)
ignore=shutil.ignore_patterns('node_modules','.next','.next-dev','.turbo','.DS_Store','.env','.env.*','*.tsbuildinfo','*.log')
for name in ['apps/web','packages','content']:
    shutil.copytree(root/name,out/name,ignore=ignore)
manifest={str(p.relative_to(out)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.rglob('*')) if p.is_file()}
(out/'source-manifest.json').write_text(json.dumps(manifest,indent=2))
print(out)
