import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {TwoGoalsPitch} from '../components/TwoGoalsPitch';
import plan from '../production/plans/two-goals.json';
import captions from '../captions/plans/two-goals.json';
import narration from '../production/narration/two-goals.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const TwoGoals=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load pitch typography')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 48px Manrope'),document.fonts.load('400 26px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame),phase=cue?.lines.join(' ')??'';
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');console.log('TWO_GOALS_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 48px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);},[frame,inspectQa,cue,ready,handle]);
 const score=index===2&&progress<.42?'2–0':index<=5||index===6&&frame<captions.cues.find(c=>c.lines.join(' ')==='Two-two.')!.startFrame?'2–1':'2–2';
 const status=index===0?'AN OWN GOAL. ON PURPOSE.':index===1?'CARIBBEAN CUP • 1994':index===2?'BARBADOS NEEDS A 2-GOAL WIN':index===3?'ONE MORE GOAL… OR A DRAW?':index===4||index===5?'THE UNUSUAL EXTRA-TIME RULE':index===6?'DELIBERATE OWN GOAL':index===7||index===8||index===9?'GRENADA’S INCENTIVES REVERSE':index===10?'BARBADOS PROTECTS BOTH GOALS':index===11?'FULL TIME • STILL TIED':index===12?'EXTRA TIME • BARBADOS QUALIFIES':'THE RULES CHANGED THE OBJECTIVE';
 return <AbsoluteFill ref={root} style={{background:'#091D18',fontFamily:'Manrope',color:'#F4EEE1',overflow:'hidden'}}>
 <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 40%,#214B3D 0%,#091D18 65%)'}}/>
 <div data-critical="brand" style={{position:'absolute',left:125,top:252,fontSize:25,letterSpacing:5,color:'#B9CDBB'}}>MAGNIVIS</div>
 <div data-critical="scoreboard" style={{position:'absolute',left:125,top:332,width:735,height:112,textAlign:'center'}}><div style={{fontSize:25,color:'#BED5C7',marginBottom:14}}>{status}</div><div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:22,fontSize:30,fontWeight:600}}><span style={{color:'#F3A17F'}}>BARBADOS</span><span style={{fontSize:44}}>{index===0?'?':index===12?'WIN':index===13?'WIN':score}</span><span style={{color:'#AEDAC5'}}>GRENADA</span></div></div>
 <TwoGoalsPitch index={index} p={progress} phase={index===8&&frame>=captions.cues.find(c=>c.lines.join(' ').startsWith('Score into their own goal'))!.startFrame?'own goal':phase}/>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:125,top:1232,width:735,fontSize:26,lineHeight:1.3,color:'#B9CDBB'}}>Illustrated reconstruction • not match footage<br/>{index===8?'Hypothetical outcomes • before full time':index===12?'Extra-time winner counts double':'Player positions and colors are schematic'}</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:48,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
