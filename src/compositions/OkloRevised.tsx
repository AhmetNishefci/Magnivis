import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {OkloRevisedWorld} from '../components/OkloRevisedWorld';
import plan from '../production/plans/oklo-v4.json';
import captions from '../captions/plans/oklo-v4.json';
import narration from '../production/narration/oklo-v4-r2.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const OkloRevised=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load geological font')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 52px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('OKLO_V4_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 52px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,ready,handle]);
 const waterCue=captions.cues.find(c=>c.sourceNarrationCueId==='oklo-v4-r2-cue-5'&&c.lines.join(' ').startsWith('Collisions with hydrogen'))!;
 const waterPhase=(waterCue.startFrame-plan.beats[4]!.frames.start)/(plan.beats[4]!.frames.end-plan.beats[4]!.frames.start);
 const cooling=captions.cues.find(c=>c.lines.join(' ').startsWith('cooling let'))!;const heating=captions.cues.find(c=>c.lines.join(' ').startsWith('heating drove'))!;
 const feedbackProgress=frame>=cooling.startFrame?clamp((frame-cooling.startFrame)/(plan.beats[6]!.frames.end-cooling.startFrame)):clamp((frame-heating.startFrame)/(cooling.startFrame-heating.startFrame));
 const feedback=frame>=cooling.startFrame?'cooling':frame>=heating.startFrame?'heating':'evidence';
 return <AbsoluteFill ref={root} style={{background:'#0D1010',fontFamily:'Manrope',color:'#F4EEE1',overflow:'hidden'}}>
 <div data-critical="brand" style={{position:'absolute',left:125,top:252,fontSize:25,letterSpacing:5,color:'#D1C4AF',zIndex:2}}>MAGNIVIS</div>
 <OkloRevisedWorld index={index} p={progress} frame={frame} waterPhase={waterPhase} feedback={feedback} feedbackProgress={feedbackProgress}/>
 <div style={{position:'absolute',left:0,top:1200,width:1080,height:720,background:'linear-gradient(transparent,#0B1318 25%)'}}/>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:125,top:1230,width:735,fontSize:26,lineHeight:1.3,color:'#BFC6B6'}}>Original illustration • not archival footage<br/>{index===6?'One studied zone • inferred feedback':index===1||index===2?'Symbolic evidence view • not plotted data':'Geometry and particle paths are schematic'}</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:52,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
