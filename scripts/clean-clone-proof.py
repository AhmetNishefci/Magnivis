"""Offline source clone; locked dependency install; no rendering, publishing or credentials.
Run from original repo: python3 scripts/clean-clone-proof.py [new ignored destination].
Requires supported Node/pnpm on PATH and an already committed recovery HEAD.
"""
import subprocess,json,pathlib,os,datetime,hashlib,sys
root=pathlib.Path.cwd(); destination=root/(sys.argv[1] if len(sys.argv)>1 else 'recovery-work/phase-3-clean-clone')
if destination.exists():raise SystemExit('Preserve existing clone proof destination')
if not destination.is_relative_to(root/'recovery-work'):raise SystemExit('Proof destination must be under ignored recovery-work')
subprocess.run(['git','clone','--no-local','--single-branch','--branch','recovery/wood-frog-canonical',str(root),str(destination)],check=True)
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=destination,text=True).strip()
assert head==subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
report={'recordedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'testedCommit':head,'clone':'git clone --no-local --single-branch (independent Git objects, no hardlinks; local transport)','dependencies':'pnpm install --frozen-lockfile','initialIgnoredWorkspacesAbsent':all(not (destination/p).exists() for p in ['.artifact-store','recovery-work']) and not list((destination/'output').glob('*.mp4')),'checks':[]}
checks=[['pnpm','install','--frozen-lockfile'],['pnpm','check'],['pnpm','recovery:brain'],['pnpm','artifacts:durable'],['pnpm','artifacts:verify'],['pnpm','artifacts:restore'],['pnpm','artifacts:verify'],['pnpm','recovery:validate'],['pnpm','production:validate','wood-frog','--recovered'],['pnpm','production:validate','wood-frog-tiktok','--recovered'],['pnpm','captions:validate','wood-frog'],['pnpm','captions:validate','wood-frog-tiktok']]
logs=root/'recovery-work/phase-3-proof-logs';logs.mkdir(parents=True,exist_ok=True)
for i,command in enumerate(checks):
 r=subprocess.run(command,cwd=destination,text=True,capture_output=True)
 (logs/f'{i:02d}.txt').write_text(r.stdout+r.stderr)
 report['checks'].append({'command':command,'exitCode':r.returncode,'log':f'recovery-work/phase-3-proof-logs/{i:02d}.txt'})
 print(' '.join(command),r.returncode,flush=True)
 if r.returncode:break
# Source/recipe proof: regenerate only QA from durable existing media, never render a video.
frames=[]
if all(c['exitCode']==0 for c in report['checks']):
 manifests=json.loads((destination/'artifacts/manifests.json').read_text())
 for video in ['wood-frog','wood-frog-tiktok','speed-of-light','speed-of-light-tiktok','earth-to-stars','ocean-depth','billion-dollars','human-engineering']:
  command=['pnpm','qa',video,'--recovered'];r=subprocess.run(command,cwd=destination,text=True,capture_output=True);(logs/f'qa-{video}.txt').write_text(r.stdout+r.stderr);report['checks'].append({'command':command,'exitCode':r.returncode});print('QA',video,r.returncode,flush=True)
  if r.returncode:break
  for m in manifests:
   if m['contentId']==video and m['retention']=='REGENERABLE':
    p=destination/'recovery-work/phase-2-qa'/video/pathlib.Path(m['localPath']).name
    match=p.exists() and hashlib.sha256(p.read_bytes()).hexdigest()==m['identity']['sha256'];frames.append({'artifactId':m['artifactId'],'exactRecoveryFrameHashMatch':match})
report['regenerableFrames']=frames;report['regenerableFramesPassed']=len(frames)==82 and all(f['exactRecoveryFrameHashMatch'] for f in frames)
report['trackedTreeClean']=not subprocess.check_output(['git','status','--porcelain'],cwd=destination,text=True).strip()
report['passed']=report['initialIgnoredWorkspacesAbsent'] and all(c['exitCode']==0 for c in report['checks']) and report['regenerableFramesPassed'] and report['trackedTreeClean']
(root/'recovery-audit/phase-3/clean-clone-proof.json').write_text(json.dumps(report,indent=2)+'\n')
if not report['passed']:raise SystemExit(1)
