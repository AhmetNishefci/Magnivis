import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {VermeerInvestigation,investigationInk,investigationPaper} from '../components/VermeerInvestigation';
import plan from '../production/plans/vermeer-forgery.json';
import captions from '../captions/plans/vermeer-forgery.json';
import narration from '../production/narration/vermeer-forgery.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const VermeerForgery=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load investigation typography')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 48px Manrope'),document.fonts.load('400 26px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const scene=root.current.querySelector('[data-critical=scene]');if(scene){const walker=document.createTreeWalker(scene,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(!node.textContent?.trim())continue;let opacity=1;for(let el=node.parentElement;el&&el!==scene;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);if(opacity<.05)continue;const range=document.createRange();range.selectNodeContents(node);const r=range.getBoundingClientRect();bounds.push({kind:'scene-text',text:node.textContent,x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height});}}const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');console.log('VERMEER_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 48px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);},[frame,inspectQa,cue,ready,handle]);
 return <AbsoluteFill ref={root} style={{background:investigationInk,fontFamily:'Manrope',color:investigationPaper,overflow:'hidden'}}>
 <div style={{position:'absolute',left:80,top:240,width:2,height:1330,background:'#46535A'}}/>
 <div data-critical="brand" style={{position:'absolute',left:125,top:252,fontSize:25,letterSpacing:5,color:'#C1CDCD'}}>MAGNIVIS</div>
 <VermeerInvestigation index={index} t={(frame-beat.frames.start)/30} duration={(beat.frames.end-beat.frames.start)/30}/>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:48,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
