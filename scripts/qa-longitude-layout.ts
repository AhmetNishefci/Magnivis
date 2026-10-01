import {createRequire} from 'node:module';
import {writeFileSync,mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {longitudeTarget} from './production-video-targets';
import {longitudeClock} from '../src/content/videos/longitude-clock';
const require=createRequire(import.meta.url);
const importDependency=async(name:string)=>{const module=await import(pathToFileURL(require.resolve(name,{paths:[require.resolve('@remotion/cli')]})).href);return module.default??module;};
const {bundle}=await importDependency('@remotion/bundler');const {renderStill,openBrowser}=await importDependency('@remotion/renderer');
const serveUrl=await bundle({entryPoint:'src/longitude-index.tsx'});const browser=await openBrowser('chrome');
const observations: {frame:number;fontsLoaded:boolean;labels:unknown[];caption:null|{maxLineWidth:number;availableWidth:number;textHeight:number;availableHeight:number};labelOverlaps:unknown[];canvasClipping:unknown[]}[]=[];
mkdirSync('qa/longitude-layout',{recursive:true});
try{
 for(const [index,t] of longitudeTarget.qaTimestamps.entries()){
  const frame=Math.min(1450,Math.round(t*30));
  await renderStill({serveUrl,composition:{id:longitudeClock.compositionId,...longitudeClock.format,durationInFrames:1451,defaultProps:{inspectQa:true},props:{inspectQa:true}},inputProps:{inspectQa:true},frame,output:`qa/longitude-layout/${index}.png`,puppeteerInstance:browser,onBrowserLog:(log:{text:string})=>{if(log.text.startsWith('LONGITUDE_LAYOUT_QA ')){const data=JSON.parse(log.text.slice('LONGITUDE_LAYOUT_QA '.length));if(!observations.some(o=>o.frame===data.frame))observations.push(data);}}});
 }
}finally{await browser.close({silent:true});}
const failures=observations.flatMap(o=>[...(!o.fontsLoaded?[`Fonts not loaded at ${o.frame}`]:[]),...o.labelOverlaps.map(v=>`Label overlap at ${o.frame}: ${JSON.stringify(v)}`),...o.canvasClipping.map(v=>`Canvas clip at ${o.frame}: ${JSON.stringify(v)}`),...(o.caption&&(o.caption.maxLineWidth>o.caption.availableWidth||o.caption.textHeight>o.caption.availableHeight)?[`Caption does not fit at ${o.frame}`]:[])]);
if(!observations.length)failures.push('No actual browser measurements captured');
writeFileSync('qa/longitude-clock-narrated/typography-report.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'Actual browser geometry/font measurement on authored source at the candidate QA frames; separate from decoded-media captures and native-device approval.',passed:!failures.length,failures,observations},null,2)+'\n');
console.log(JSON.stringify({observations:observations.length,failures},null,2));if(failures.length)process.exitCode=1;
