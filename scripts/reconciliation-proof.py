"""Verify a newly fetched GitHub branch in a fresh ignored clone; never render or publish."""
import subprocess,json,pathlib,datetime,sys,os
root=pathlib.Path.cwd()
if len(sys.argv)!=3:raise SystemExit('Use: python3 scripts/reconciliation-proof.py <remote-branch> <unique-label>')
branch,label=sys.argv[1:]
if not label.replace('-','').isalnum():raise SystemExit('Unsafe label')
destination=root/'recovery-work'/label
if destination.exists():raise SystemExit('Preserve existing proof directory')
url=subprocess.check_output(['git','remote','get-url','origin'],text=True).strip()
subprocess.run(['git','clone','--single-branch','--branch',branch,url,str(destination)],check=True)
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=destination,text=True).strip()
remote=subprocess.check_output(['git','ls-remote',url,'refs/heads/'+branch],text=True).split()[0]
if head!=remote:raise SystemExit('Remote moved during clone; preserve evidence and investigate')
logs=root/'recovery-audit/closure'/f'{label}-logs';logs.mkdir(parents=True,exist_ok=True)
report={'recordedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'transport':'GitHub remote git clone','branch':branch,'testedCommit':head,'noPreexistingIgnoredProjectState':not (destination/'.artifact-store').exists() and not (destination/'recovery-work').exists() and not list((destination/'output').glob('*.mp4')),'checks':[]}
commands=[(['pnpm','install','--frozen-lockfile'],0),(['pnpm','check'],0),(['pnpm','recovery:brain'],0),(['pnpm','artifacts:status'],0),(['pnpm','artifacts:durable'],0),(['pnpm','artifacts:verify'],0),(['pnpm','artifacts:restore'],0),(['pnpm','artifacts:verify'],0),(['pnpm','recovery:validate'],0),(['pnpm','production:validate','wood-frog','--recovered'],0),(['pnpm','production:validate','wood-frog-tiktok','--recovered'],0),(['pnpm','captions:validate','wood-frog'],0),(['pnpm','captions:validate','wood-frog-tiktok'],0),(['pnpm','platform:qa','recovery-audit/phase-3/platform-regression-input.json'],1),(['git','diff','--check'],0)]
for index,(command,expected) in enumerate(commands):
 r=subprocess.run(command,cwd=destination,text=True,capture_output=True)
 log=logs/f'{index:02d}.txt';s=r.stdout+r.stderr;log.write_text(s.rstrip()+'\n' if s.strip() else '')
 report['checks'].append({'command':command,'exitCode':r.returncode,'expectedExitCode':expected,'passed':r.returncode==expected,'log':str(log.relative_to(root))});print(branch,' '.join(command),r.returncode,flush=True)
 if r.returncode!=expected:break
report['trackedTreeClean']=not subprocess.check_output(['git','status','--porcelain'],cwd=destination,text=True).strip()
report['runtime']={name:subprocess.check_output([name,'--version'],text=True).strip() for name in ['node','pnpm']}
report['passed']=report['noPreexistingIgnoredProjectState'] and report['trackedTreeClean'] and len(report['checks'])==len(commands) and all(c['passed'] for c in report['checks'])
report['deviceQa']='No real-device pass inferred; known geometry gaps cause expected INCOMPLETE platform regression'
(root/'recovery-audit/closure'/f'{label}.json').write_text(json.dumps(report,indent=2)+'\n')
if not report['passed']:raise SystemExit(1)
