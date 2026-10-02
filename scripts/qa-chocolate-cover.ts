import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const require=createRequire(import.meta.url);
const dependency=async(name:string)=>{const m=await import(pathToFileURL(require.resolve(name,{paths:[require.resolve('@remotion/cli')]})).href);return m.default??m;};
const {bundle}=await dependency('@remotion/bundler');const {renderStill,openBrowser}=await dependency('@remotion/renderer');
const serveUrl=await bundle({entryPoint:'src/chocolate-cover-index.tsx'});const browser=await openBrowser('chrome');
type Observation={fontsLoaded:boolean;labels:{text:string;x:number;y:number;width:number;height:number}[]};let observation:Observation|undefined;
try{await renderStill({serveUrl,composition:{id:'Chocolate-Instagram-Cover',width:1080,height:1920,fps:30,durationInFrames:1,defaultProps:{},props:{}},frame:0,output:'artifacts/covers/chocolate-crystal-choice-instagram-cover-v1.png',puppeteerInstance:browser,onBrowserLog:(log:{text:string})=>{if(log.text.startsWith('CHOCOLATE_COVER_QA '))observation=JSON.parse(log.text.slice('CHOCOLATE_COVER_QA '.length));}});}finally{await browser.close({silent:true});}
if(!observation?.fontsLoaded||observation.labels.length!==4||observation.labels.some(l=>l.x<0||l.y<0||l.x+l.width>1080||l.y+l.height>1920))throw new Error('Cover font loading/bounds failed');
writeFileSync('artifacts/qa-evidence/chocolate-crystal-choice-platform-v1/cover-browser.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:true,scope:'Actual local browser font loading and text bounds; native crop/device behavior unmeasured.',ownerCoverApproved:false,realDevicePasses:0,observation},null,2)+'\n');console.log(JSON.stringify(observation));
