import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {selfTickleV2Target as target} from './tickle-v2-video-target';
import captions from '../src/captions/plans/self-tickle-v2.json';
const require=createRequire(import.meta.url);
const dependency=async(name:string)=>{const m=await import(pathToFileURL(require.resolve(name,{paths:[require.resolve('@remotion/cli')]})).href);return m.default??m;};
const {bundle}=await dependency('@remotion/bundler');
const {renderStill,openBrowser}=await dependency('@remotion/renderer');
const serveUrl=await bundle({entryPoint:target.entryPoint});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
type Observation={frame:number;controlMarkerOffset:number|null;contactGeometry:{id:string;level:number;nearestSurfaceDistance:number}[];robotProgress:null|{control:number;follower:number};mechanism:{beat:number;forecast:boolean;actualContact:boolean;robotDelayed:boolean};fontsLoaded:boolean;bounds:{kind:string;text:string;x:number;y:number;width:number;height:number}[];caption:null|{width:number;height:number;availableWidth:number;availableHeight:number};disclosure:boolean};
const observations=new Map<number,Observation>();
const requested=process.argv.find(a=>a.startsWith('--frames='))?.slice(9).split(',').map(Number);
const frames=requested??[...new Set(target.qaTimestamps.map(t=>Math.min(Math.round(target.spec.format.durationSeconds*30)-1,Math.round(t*30))))];
mkdirSync('qa/self-tickle-v2-layout',{recursive:true});
mkdirSync('qa/self-tickle-v2',{recursive:true});
try{for(const frame of frames){
 await renderStill({serveUrl,composition:{id:target.spec.compositionId,...target.spec.format,durationInFrames:Math.round(target.spec.format.durationSeconds*30),defaultProps:{inspectQa:true},props:{inspectQa:true}},inputProps:{inspectQa:true},logLevel:'error',frame,output:`qa/self-tickle-v2-layout/${frame}.png`,puppeteerInstance:browser,onBrowserLog:(log:{text:string})=>{if(log.text.startsWith('TICKLE_V2_LAYOUT_QA ')){const o=JSON.parse(log.text.slice('TICKLE_V2_LAYOUT_QA '.length)) as Observation;observations.set(o.frame,o);}}});
 console.log(`Measured frame ${frame}`);
}}finally{await browser.close({silent:true});}
const failures:string[]=[];
for(const o of observations.values()){
 if(o.controlMarkerOffset!==null&&o.controlMarkerOffset>3)failures.push(`Controller marker misaligned at ${o.frame}`);
 for(const contact of o.contactGeometry??[])if(contact.level>.98&&(!Number.isFinite(contact.nearestSurfaceDistance)||contact.nearestSurfaceDistance>12))failures.push(`Physical contact gap at ${o.frame}: ${contact.id} ${contact.nearestSurfaceDistance.toFixed(2)}px`);
 if(!o.fontsLoaded)failures.push(`Font unavailable at ${o.frame}`);

 for(const b of o.bounds){if(b.x<84||b.y<240||b.x+b.width>890||b.y+b.height>1610)failures.push(`Provisional inset collision at ${o.frame}: ${b.kind} ${b.text}`);}
 const captionsAtFrame=o.bounds.filter(b=>b.kind==='caption-midpoint');for(const cap of captionsAtFrame)for(const shape of o.bounds.filter(b=>b.kind==='critical-visual'))if(Math.min(cap.x+cap.width,shape.x+shape.width)-Math.max(cap.x,shape.x)>1&&Math.min(cap.y+cap.height,shape.y+shape.height)-Math.max(cap.y,shape.y)>1)failures.push(`Caption/critical-visual overlap at ${o.frame}`);
 const labels=o.bounds.filter(b=>['critical','disclosure','caption-midpoint'].includes(b.kind)&&b.width>0&&b.height>0);
 for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){const a=labels[i]!,b=labels[j]!;if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1)failures.push(`Scene text overlap at ${o.frame}: ${a.text} / ${b.text}`);}
 if(o.caption&&(o.caption.width>o.caption.availableWidth||o.caption.height>o.caption.availableHeight))failures.push(`Caption overflow at ${o.frame}`);
}
if(observations.size!==frames.length)failures.push('Incomplete browser observations.');
if(!requested&&captions.cues.some(c=>!observations.has(Math.floor((c.startFrame+c.endFrame)/2))))failures.push('Missing caption midpoint.');
const samples=[...observations.values()];
const semantics={predictionBeforeContact:samples.some(o=>o.mechanism.beat===2&&o.mechanism.forecast&&!o.mechanism.actualContact),predictionThenContact:samples.some(o=>o.mechanism.beat===2&&o.mechanism.actualContact),endingForecastBeforeContact:samples.some(o=>o.mechanism.beat===9&&o.mechanism.forecast&&!o.mechanism.actualContact),endingThenContact:samples.some(o=>o.mechanism.beat===9&&o.mechanism.actualContact),robotImmediateMatches:samples.filter(o=>o.mechanism.beat===5&&!o.mechanism.robotDelayed).every(o=>o.robotProgress&&Math.abs(o.robotProgress.control-o.robotProgress.follower)<.001),robotVisibleWait:samples.some(o=>o.mechanism.beat===5&&o.mechanism.robotDelayed&&o.robotProgress&&o.robotProgress.control>.98&&o.robotProgress.follower<.05),robotEventuallyTouches:samples.some(o=>o.mechanism.beat===5&&o.mechanism.robotDelayed&&o.robotProgress&&o.robotProgress.follower>.98)};
if(!requested)for(const [name,passed]of Object.entries(semantics))if(!passed)failures.push('Missing mechanism state: '+name);
writeFileSync('qa/self-tickle-v2/typography-report.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:failures.length===0,failures,semantics,scope:'Actual browser-rendered font and geometry checkpoints. Sampled coverage only; no mobile/native/crop evidence.',phoneScale:'V2 main scene states42–54px, disclosures33px, actual transformed contact distances and119 mechanism/caption checkpoints.54px captions correspond to18px at360px; V2 disclosures33px (11px at360). Actual contact, own-arm continuity, prediction paths and mechanism geometry sampled with transformed stroke padding; full-bleed context are not certified mobile-safe. Owner readability review remains required.',observations:[...observations.values()]},null,2)+'\n');
console.log(JSON.stringify({frames:observations.size,failures}));
if(failures.length)process.exitCode=1;
