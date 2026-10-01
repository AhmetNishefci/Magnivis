import {createRequire} from 'node:module';
import {writeFileSync,mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {chocolateTarget as target} from './production-video-targets';
const require=createRequire(import.meta.url);
const dependency=async(name:string)=>{const m=await import(pathToFileURL(require.resolve(name,{paths:[require.resolve('@remotion/cli')]})).href);return m.default??m;};
const {bundle}=await dependency('@remotion/bundler');const {renderStill,openBrowser}=await dependency('@remotion/renderer');
const serveUrl=await bundle({entryPoint:target.entryPoint});const browser=await openBrowser('chrome');
type Observation={frame:number;fontsLoaded:boolean;labels:{text:string;x:number;y:number;width:number;height:number}[];caption:null|{width:number;height:number;availableWidth:number;availableHeight:number};disclosure:boolean};
const observations:Observation[]=[];const failures:string[]=[];
mkdirSync('qa/chocolate-layout',{recursive:true});mkdirSync(target.qaDirectory,{recursive:true});
try{for(const [i,t] of target.qaTimestamps.entries()){
 const frame=Math.min(1194,Math.round(t*30));await renderStill({serveUrl,composition:{id:target.spec.compositionId,...target.spec.format,durationInFrames:1195,defaultProps:{inspectQa:true},props:{inspectQa:true}},inputProps:{inspectQa:true},frame,output:`qa/chocolate-layout/${i}.png`,puppeteerInstance:browser,onBrowserLog:(log:{text:string})=>{if(log.text.startsWith('CHOCOLATE_LAYOUT_QA ')){const o=JSON.parse(log.text.slice('CHOCOLATE_LAYOUT_QA '.length)) as Observation;if(!observations.some(p=>p.frame===o.frame))observations.push(o);}}});
}}finally{await browser.close({silent:true});}
for(const o of observations){if(!o.fontsLoaded)failures.push(`Font not loaded at ${o.frame}`);if(!o.disclosure)failures.push(`Model disclosure absent at ${o.frame}`);for(const l of o.labels)if(l.x<0||l.x+l.width>1080||l.y<0||l.y+l.height>1920)failures.push(`Label clipping ${l.text} at ${o.frame}`);if(o.caption&&(o.caption.width>o.caption.availableWidth||o.caption.height>o.caption.availableHeight))failures.push(`Caption clipping ${o.frame}`);}
if(observations.length!==target.qaTimestamps.length)failures.push('Incomplete browser frame measurements');
writeFileSync(`${target.qaDirectory}/typography-report.json`,JSON.stringify({checkedAt:new Date().toISOString(),passed:!failures.length,failures,scope:'Actual browser loading and geometry; complementary to decoded media, not real-device proof.',phoneScale:'360 x 640: 56px captions become 18.7px, 30px model disclosure becomes 10px. Owner readability judgment remains required.',observations},null,2)+'\n');
console.log(JSON.stringify({frames:observations.length,failures}));if(failures.length)process.exitCode=1;
