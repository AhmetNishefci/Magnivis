import {mediaHash} from '../src/artifacts/media';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {yamaguchiTarget as target} from './yamaguchi-video-target';
import captions from '../src/captions/plans/yamaguchi-two-bombs.json';
const require=createRequire(import.meta.url);
const dependency=async(name:string)=>{const m=await import(pathToFileURL(require.resolve(name,{paths:[require.resolve('@remotion/cli')]})).href);return m.default??m;};
const {bundle}=await dependency('@remotion/bundler');
const {renderStill,openBrowser}=await dependency('@remotion/renderer');
const serveUrl=await bundle({entryPoint:target.entryPoint});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
type Observation={frame:number;contactGeometry:{id:string;level:number;nearestSurfaceDistance:number}[];fontsLoaded:boolean;bounds:{kind:string;text:string;x:number;y:number;width:number;height:number}[];caption:null|{width:number;height:number;availableWidth:number;availableHeight:number};disclosure:boolean};
const observations=new Map<number,Observation>();
const frames=[...new Set(target.qaTimestamps.map(t=>Math.min(Math.round(target.spec.format.durationSeconds*30)-1,Math.round(t*30))))];
mkdirSync('qa/yamaguchi-two-bombs-layout',{recursive:true});
mkdirSync('qa/yamaguchi-two-bombs',{recursive:true});
try{for(const frame of frames){
 await renderStill({serveUrl,composition:{id:target.spec.compositionId,...target.spec.format,durationInFrames:Math.round(target.spec.format.durationSeconds*30),defaultProps:{inspectQa:true},props:{inspectQa:true}},inputProps:{inspectQa:true},logLevel:'error',frame,output:`qa/yamaguchi-two-bombs-layout/${frame}.png`,puppeteerInstance:browser,onBrowserLog:(log:{text:string})=>{if(log.text.startsWith('YAMAGUCHI_LAYOUT_QA ')){const o=JSON.parse(log.text.slice('YAMAGUCHI_LAYOUT_QA '.length)) as Observation;observations.set(o.frame,o);}}});
 console.log(`Measured frame ${frame}`);
}}finally{await browser.close({silent:true});}
const failures:string[]=[];
for(const o of observations.values()){

 if(!o.fontsLoaded)failures.push(`Font unavailable at ${o.frame}`);

 for(const b of o.bounds){if(b.x<84||b.y<240||b.x+b.width>890||b.y+b.height>1610)failures.push(`Provisional inset collision at ${o.frame}: ${b.kind} ${b.text}`);}
 const captionsAtFrame=o.bounds.filter(b=>b.kind==='caption-midpoint');for(const cap of captionsAtFrame)for(const shape of o.bounds.filter(b=>b.kind==='critical-visual'))if(Math.min(cap.x+cap.width,shape.x+shape.width)-Math.max(cap.x,shape.x)>1&&Math.min(cap.y+cap.height,shape.y+shape.height)-Math.max(cap.y,shape.y)>1)failures.push(`Caption/critical-visual overlap at ${o.frame}`);
 const labels=o.bounds.filter(b=>['critical','disclosure','caption-midpoint'].includes(b.kind)&&b.width>0&&b.height>0);
 for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){const a=labels[i]!,b=labels[j]!;if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1)failures.push(`Scene text overlap at ${o.frame}: ${a.text} / ${b.text}`);}
 if(o.caption&&(o.caption.width>o.caption.availableWidth||o.caption.height>o.caption.availableHeight))failures.push(`Caption overflow at ${o.frame}`);
}
if(observations.size!==frames.length)failures.push('Incomplete browser observations.');
if(captions.cues.some(c=>!observations.has(Math.floor((c.startFrame+c.endFrame)/2))))failures.push('Missing caption midpoint.');
writeFileSync('qa/yamaguchi-two-bombs/typography-report.json',JSON.stringify({checkedAt:new Date().toISOString(),sourceBindings:['src/components/YamaguchiFilm.tsx','src/compositions/YamaguchiTwoBombs.tsx','src/captions/plans/yamaguchi-two-bombs.json'].map(path=>({path,sha256:mediaHash(path)})),passed:failures.length===0,failures,scope:'Actual browser-rendered font and geometry checkpoints. Sampled coverage only; no mobile/native/crop evidence.',phoneScale:'56px captions=18.7px/360px; disclosure32px=10.7px. Authored focal envelopes and actual DOM text measured; full-bleed context, native UI and unsampled motion remain untested.',observations:[...observations.values()]},null,2)+'\n');
console.log(JSON.stringify({frames:observations.size,failures}));
if(failures.length)process.exitCode=1;
