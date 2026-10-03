import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {OkloWorld} from '../components/OkloWorld';
import plan from '../production/plans/oklo.json';
import captions from '../captions/plans/oklo.json';
import narration from '../production/narration/oklo.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const Oklo=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load geological font')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 48px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('OKLO_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 48px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,ready,handle]);
 return <AbsoluteFill ref={root} style={{background:'#0D1010',fontFamily:'Manrope',color:'#F4EEE1',overflow:'hidden'}}>
 <div data-critical="brand" style={{position:'absolute',left:125,top:252,fontSize:25,letterSpacing:5,color:'#D1C4AF',zIndex:2}}>MAGNIVIS</div>
 <OkloWorld index={index} p={progress} frame={frame}/>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:125,top:1230,width:735,fontSize:26,lineHeight:1.3,color:'#BFC6B6'}}>Illustrative reconstruction • not site footage<br/>{index>=8&&index<=10?'Cycling: isotope-based inference in one studied zone':'Geometry and particle paths are schematic'}</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:48,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
