import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {ifmV3Target as target} from './production-video-targets';
import captions from '../src/captions/plans/ifm-v3.json';
const require=createRequire(import.meta.url);
const dependency=async(name:string)=>{const m=await import(pathToFileURL(require.resolve(name,{paths:[require.resolve('@remotion/cli')]})).href);return m.default??m;};
const {bundle}=await dependency('@remotion/bundler');
const {renderStill,openBrowser}=await dependency('@remotion/renderer');
const serveUrl=await bundle({entryPoint:target.entryPoint});
const browser=await openBrowser('chrome');
type Observation={frame:number;fontsLoaded:boolean;bounds:{kind:string;text:string;x:number;y:number;width:number;height:number}[];caption:null|{width:number;height:number;availableWidth:number;availableHeight:number};disclosure:boolean};
const observations=new Map<number,Observation>();
const frames=[...new Set(target.qaTimestamps.map(t=>Math.min(Math.round(target.spec.format.durationSeconds*30)-1,Math.round(t*30))))];
mkdirSync('qa/ifm-v3-layout',{recursive:true});
mkdirSync('qa/interaction-free-v3',{recursive:true});
try{for(const frame of frames){
 await renderStill({serveUrl,composition:{id:target.spec.compositionId,...target.spec.format,durationInFrames:Math.round(target.spec.format.durationSeconds*30),defaultProps:{inspectQa:true},props:{inspectQa:true}},inputProps:{inspectQa:true},frame,output:`qa/ifm-v3-layout/${frame}.png`,puppeteerInstance:browser,onBrowserLog:(log:{text:string})=>{if(log.text.startsWith('IFM_LAYOUT_QA ')){const o=JSON.parse(log.text.slice('IFM_LAYOUT_QA '.length)) as Observation;observations.set(o.frame,o);}}});
 console.log(`Measured frame ${frame}`);
}}finally{await browser.close({silent:true});}
const failures:string[]=[];
for(const o of observations.values()){
 if(!o.fontsLoaded)failures.push(`Font unavailable at ${o.frame}`);
 if(!o.disclosure)failures.push(`Illustrative-model disclosure absent at ${o.frame}`);
 for(const b of o.bounds){if(b.x<84||b.y<240||b.x+b.width>890||b.y+b.height>1610)failures.push(`Provisional inset collision at ${o.frame}: ${b.kind} ${b.text}`);}
 if(o.caption&&(o.caption.width>o.caption.availableWidth||o.caption.height>o.caption.availableHeight))failures.push(`Caption overflow at ${o.frame}`);
}
if(observations.size!==frames.length)failures.push('Incomplete browser observations.');
if(captions.cues.some(c=>!observations.has(Math.floor((c.startFrame+c.endFrame)/2))))failures.push('Missing caption midpoint.');
writeFileSync('qa/interaction-free-v3/typography-report.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:failures.length===0,failures,scope:'Actual browser-rendered font and geometry checkpoints. Sampled coverage only; no mobile/native/crop evidence.',phoneScale:'48px captions correspond to 16px at a 360px-wide presentation; disclosure 27px corresponds to 9px. Subjective readability remains part of owner review.',observations:[...observations.values()]},null,2)+'\n');
console.log(JSON.stringify({frames:observations.size,failures}));
if(failures.length)process.exitCode=1;
