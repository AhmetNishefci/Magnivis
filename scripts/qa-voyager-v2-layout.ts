import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {voyagerV2Target as target} from './voyager-v2-video-target';
import captions from '../src/captions/plans/voyager-v2.json';
import {inspectRenderedBounds,type QaBound} from '../src/production/qa/geometry';
const require=createRequire(import.meta.url),dependency=async(name:string)=>{const m=await import(pathToFileURL(require.resolve(name,{paths:[require.resolve('@remotion/cli')]})).href);return m.default??m;};
const {bundle}=await dependency('@remotion/bundler'),{renderStill,openBrowser}=await dependency('@remotion/renderer');
const serveUrl=await bundle({entryPoint:target.entryPoint}),browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
type Rect={x:number;y:number;width:number;height:number};type Observation={frame:number;scene:number;fontsLoaded:boolean;bounds:QaBound[];code:(Rect&{id:string})[];references:{id:string;progress:number;end:{x:number;y:number}}[];caption:null|{lines:{width:number;height:number;text:string}[];width:number;height:number};disabledChip:boolean;endingPreserved:boolean};
const observations=new Map<number,Observation>(),frames=target.qaTimestamps.map(t=>Math.round(t*30));mkdirSync('qa/voyager-v2-layout',{recursive:true});mkdirSync(target.qaDirectory,{recursive:true});
try{for(const frame of frames){await renderStill({serveUrl,composition:{id:target.spec.compositionId,...target.spec.format,durationInFrames:1346,defaultProps:{inspectQa:true},props:{inspectQa:true}},inputProps:{inspectQa:true},frame,output:`qa/voyager-v2-layout/${frame}.png`,puppeteerInstance:browser,onBrowserLog:(log:{text:string})=>{if(log.text.startsWith('VOYAGER_V2_QA '))observations.set(frame,JSON.parse(log.text.slice('VOYAGER_V2_QA '.length)) as Observation);}});}}finally{await browser.close({silent:true});}
const failures:string[]=[];
for(const o of observations.values()){
 if(captions.cues.some(c=>o.frame>=c.startFrame&&o.frame<c.endFrame)&&!o.caption)failures.push(`Missing actual caption measurements at${o.frame}`);
 if(!o.fontsLoaded)failures.push(`Font not loaded at${o.frame}`);
 failures.push(...inspectRenderedBounds(o.bounds,{x:84,y:240,width:806,height:1370}).map(f=>`${o.frame}: ${f}`));
 if(o.scene<=6&&!o.bounds.some(b=>b.kind==='critical-visual'))failures.push(`Missing SVG/subject geometry at${o.frame}`);
 if(o.scene>=1&&o.scene<=4&&!o.disabledChip)failures.push(`Disabled chip absent at${o.frame}`);
 if(o.scene>=2&&o.scene<=4){if(o.code.length!==3)failures.push(`Missing code sections at${o.frame}`);for(const c of o.code)if(Math.abs(c.width-240)>.1||Math.abs(c.height-64)>.1)failures.push(`Section resized at${o.frame}: ${c.id}`);}
 for(const r of o.references.filter(r=>r.progress>.999)){const c=o.code.find(c=>c.id===r.id);if(!c||Math.abs(r.end.x-c.x)>.1||Math.abs(r.end.y-(c.y+c.height/2))>.1)failures.push(`Detached logical reference at${o.frame}: ${r.id}`);}
 if(o.scene===4&&o.frame>=752&&o.references.filter(r=>r.progress>.999).length!==3)failures.push(`Incomplete updated routes at${o.frame}`);
 if(o.caption&&(o.caption.lines.some(l=>l.width>o.caption!.width+.1)||o.caption.lines.reduce((s,l)=>s+l.height,0)>o.caption.height+.1))failures.push(`Caption line overflow at${o.frame}`);
}
if(observations.size!==frames.length)failures.push('Missing browser observations');if(captions.cues.some(c=>!observations.has(Math.floor((c.startFrame+c.endFrame)/2))))failures.push('Missing caption midpoint');
writeFileSync(target.qaDirectory+'/typography-report.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:failures.length===0,failures,scope:'Actual DOM label/caption and transformed SVG bounds, stable section dimensions, completed reference endpoint geometry and explicit line widths. Sampled timeline; no native/device safety claim.',negativeFixtureTests:'tests/production-geometry.test.ts detects critical-label overlaps,SVG inset violations,visual/caption collisions,and detached/stale geometry regressions.',observations:[...observations.values()]},null,2)+'\n');console.log(JSON.stringify({frames:observations.size,failures}));if(failures.length)process.exitCode=1;
