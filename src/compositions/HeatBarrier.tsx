import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {ThermalDefs,Metal,Water,Steam,SceneLabel,PairedDrops} from '../components/ThermalInterface';
import plan from '../production/plans/heat.json';
import captions from '../captions/plans/heat.json';
import narration from '../production/narration/heat.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const HeatBarrier=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),time=frame/30,root=useRef<HTMLDivElement>(null);
 const [handle]=useState(()=>delayRender('Load thermal interface font'));
 const [ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 48px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end));
 const beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect();const bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('HEAT_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 48px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,ready,handle]);
 let scene:React.ReactNode;
 if(index===0||index===8||index===11)scene=<><PairedDrops time={(frame-beat.frames.start)/30}/>{index===8&&<SceneLabel y={360} size={34}>A transition, not an always-rule</SceneLabel>}</>;
 else if(index===1)scene=<><SceneLabel y={450} size={41}>Metal → water</SceneLabel><Metal/><Water baseY={935} width={470-progress*260} height={100-progress*55} time={time}/><Steam y={820} time={time}/><SceneLabel y={1115} size={34}>Direct thermal contact</SceneLabel></>;
 else if(index===9)scene=<><Metal/><Water baseY={845} time={time}/><SceneLabel y={450} size={39}>The threshold can change</SceneLabel><SceneLabel y={1150} size={32}>Surface • drop • conditions</SceneLabel></>;
 else {
  const lift=index===2?progress:index===3?clamp(.4+progress*.6):1;
  scene=<><Metal/><Water baseY={935-lift*90} width={400} height={200+lift*55} time={time}/>
   <rect x={278} y={935-lift*83} width={424} height={lift*80} fill="url(#vapor)"/>
   {lift>.1&&[0,1,2,3].map(i=><path key={i} d={`M${300+i*8} ${930-lift*(15+i*15)} Q490 ${915-lift*(15+i*15)} 680 ${930-lift*(15+i*15)}`} fill="none" stroke="#D8F4F7" strokeOpacity={.28} strokeWidth={2}/>)}
   {index===3&&<Steam y={882} spread={300} time={time}/>}
   {index>=4&&<><path d="M740 850 V935 M730 850 H750 M730 935 H750" stroke="#D9EEF2" strokeWidth={2}/><SceneLabel x={490} y={1090} size={36}>Vapor supports the drop</SceneLabel></>}
   {(index===5||index===6||index===10)&&<>{[350,490,630].map((x,i)=><path key={x} d={`M${x} 1010 V920 Q${x+20} 885 ${x} 856`} fill="none" stroke="#E9B476" strokeWidth={3} strokeDasharray="8 12" strokeDashoffset={-time*24-i*3} markerEnd="url(#heat-arrow)"/>)}<SceneLabel y={1180} size={32} color="#F3CC99">Heat still crosses • evaporation continues</SceneLabel></>}
   {index===7?<SceneLabel y={450} size={52}>The Leidenfrost effect</SceneLabel>:index===10?<SceneLabel y={450} size={38}>More heat can speed evaporation again</SceneLabel>:<SceneLabel y={450} size={39}>{index<4?'A layer forms beneath the water':'The heat path has changed'}</SceneLabel>}
  </>;
 }
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 46% 38%, #35434A 0%, #17262D 58%, #111C22 100%)',fontFamily:'Manrope',color:'#EDF4F7',overflow:'hidden'}}>
 <div style={{position:'absolute',left:120,top:252,fontSize:25,letterSpacing:5,color:'#AEC4CD'}}>MAGNIVIS</div>
 <svg width={1080} height={1920} style={{position:'absolute'}}><ThermalDefs/><g data-critical="scene">{scene}</g></svg>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:120,top:1290,width:750,fontSize:27,lineHeight:1.3,color:'#AEC4CD'}}>Qualitative illustration • vapor gap enlarged</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:48,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
