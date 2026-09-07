"""Prepare a minimal Cloud Build context, excluding unrelated website changes."""
from pathlib import Path
import shutil, tempfile, json, hashlib
app=Path(__file__).resolve().parents[1]
repo=app.parents[1]
stage=Path(tempfile.mkdtemp(prefix='leadership-diary-release-'))
for name in ['package.json','pnpm-lock.yaml','pnpm-workspace.yaml']:
    shutil.copy2(repo/name,stage/name)
shutil.copytree(app,stage/'apps/diary',ignore=shutil.ignore_patterns('node_modules','.next','.next-dev','*.tsbuildinfo','.env','.env.local'))
shutil.copy2(app/'Dockerfile',stage/'Dockerfile')
manifest={str(p.relative_to(stage)):hashlib.sha256(p.read_bytes()).hexdigest() for p in stage.rglob('*') if p.is_file()}
(stage/'release-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(stage)
