"""Restore only the restricted diary manuscript from its private release archive."""
import hashlib, pathlib, subprocess, tarfile, tempfile
SOURCE="gs://rajagobalan-site_cloudbuild/source/1788617386.631156-7ec82dabb051427ebe20bf854e2c9a1b.tgz"
EXPECTED="757db77e072ab47b63efe4ad6c0e5ecd3eb1d46e02395bc2af35dc3f14a77cda"
target=pathlib.Path(__file__).resolve().parents[1]/"content/diary.json"
if target.exists():
    print("Manuscript already exists; preserving it.")
    raise SystemExit(0)
with tempfile.TemporaryDirectory(prefix="diary-manuscript-") as temp:
    archive=pathlib.Path(temp)/"source.tgz"
    subprocess.run(["gcloud","storage","cp",SOURCE,str(archive)],check=True)
    with tarfile.open(archive) as tar:
        matches=[m for m in tar.getmembers() if m.name.lstrip("./")=="apps/diary/content/diary.json"]
        if len(matches)!=1 or not matches[0].isfile():raise RuntimeError("Expected manuscript missing")
        data=tar.extractfile(matches[0]).read()
    if hashlib.sha256(data).hexdigest()!=EXPECTED:raise RuntimeError("Manuscript checksum mismatch")
    target.write_bytes(data)
print("Restored restricted manuscript. It remains excluded from public Git.")
