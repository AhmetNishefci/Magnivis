"""Read-only audit-package checks. Run from the repository root; no rendering."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path("system-audits/magnivis-system-architecture-2026-10")


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def git(*args):
    return subprocess.check_output(["git", *args], text=True).strip()


manifest = json.loads((ROOT / "audit-manifest.json").read_text())
for item in manifest["files"]:
    assert digest(ROOT / item["name"]) == item["sha256"], item["name"]
    if item["name"].endswith(".json"):
        json.loads((ROOT / item["name"]).read_text())

evidence = json.loads((ROOT / "evidence-index.json").read_text())
for item in evidence["files"]:
    assert digest(item["path"]) == item["sha256"], item["path"]

storage = json.loads((ROOT / "artifact-storage-analysis.json").read_text())
groups = {}
for item in storage["inventory"]:
    path = Path(item["path"])
    assert path.stat().st_size == item["bytes"], str(path)
    assert digest(path) == item["sha256"], str(path)
    groups.setdefault(item["sha256"], []).append(item)
assert len(storage["inventory"]) == storage["paths"] == 442
assert len(groups) == storage["uniquePayloads"] == 366
assert sum((len(v) - 1) * v[0]["bytes"] for v in groups.values()) == 426582475

workflow = json.loads((ROOT / "workflow-map.json").read_text())
assert [q["number"] for q in workflow["questions"]] == list(range(1, 62))
tests = json.loads((ROOT / "test-taxonomy.json").read_text())
test_paths = [p for c in tests["categories"] for p in c["files"]]
assert len(set(test_paths)) == len(test_paths) == 43
assert set(test_paths) == {str(p) for p in Path("tests").glob("*.test.ts")}
assert len(json.loads((ROOT / "owner-gates.json").read_text())["gates"]) == 22

assert git("rev-parse", "main") == manifest["startingMainCommit"]
assert git("rev-parse", "origin/main") == manifest["startingMainCommit"]
assert git("rev-parse", "architecture/artifact-v2-canonical-media") == manifest["artifactV2Commit"]
assert git("rev-parse", "origin/architecture/artifact-v2-canonical-media") == manifest["artifactV2Commit"]
assert git("branch", "--show-current") == manifest["auditBranch"]

changed = git("diff", "--name-only", manifest["artifactV2Commit"], "--").splitlines()
untracked = git("ls-files", "--others", "--exclude-standard").splitlines()
assert all(p.startswith(str(ROOT) + "/") for p in changed + untracked)
subprocess.run(["git", "diff", "--check"], check=True)
print(json.dumps({
    "passed": True,
    "auditFiles": len(manifest["files"]) + 1,
    "sourceEvidenceHashes": len(evidence["files"]),
    "mediaPathsHashed": len(storage["inventory"]),
    "workflowAnswers": len(workflow["questions"]),
    "ownerGatePurposes": 22,
    "testFilesMapped": 43,
    "changesOutsideAudit": 0,
    "mainAndV2RefsUnchanged": True,
    "endingAuditCommitCommand": "git log -1 --format=%H -- " + str(ROOT),
}, indent=2))
