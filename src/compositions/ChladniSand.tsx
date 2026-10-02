import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {ChladniPlate,plateColors} from '../components/ChladniPlate';
import {clamp,smooth,sectionDisplacement} from '../production/chladni-geometry';
import plan from '../production/plans/chladni.json';
import captions from '../captions/plans/chladni.json';
import narration from '../production/narration/chladni.json';
const Label=({x,y,children,color='#D9DDCF',size=34}:{x:number;y:number;children:React.ReactNode;color?:string;size?:number})=><text data-critical="label" x={x} y={y} fill={color} fontSize={size} fontWeight={600} textAnchor="middle">{children}</text>;
const Section=({time,showGrains=false}:{time:number;showGrains?:boolean})=>{
 const phase=time*3.5;
 const points=Array.from({length:151},(_,i)=>{const x=i/150;return `${130+720*x},${840+sectionDisplacement(x,phase)*88}`;}).join(' ');
 return <g data-critical="section">
  <line x1={130} x2={850} y1={840} y2={840} stroke="#CCD2C5" opacity={.24} strokeDasharray="7 9"/>
  <polyline points={points} fill="none" stroke="#BCC1B2" strokeWidth={8}/>
  {[.25,.75].map(x=><g key={x}><line x1={130+720*x} x2={130+720*x} y1={740} y2={950} stroke={plateColors.node} strokeWidth={2} strokeDasharray="6 6"/><circle cx={130+720*x} cy={840} r={10} fill={plateColors.node}/>{showGrains&&<g>{Array.from({length:12},(_,j)=><circle key={j} cx={130+720*x-18+j*3} cy={827-(j%3)*3} r={2.5} fill={plateColors.grain}/>)}</g>}</g>)}
  <Label x={490} y={610} color={plateColors.node} size={49}>Nodes stay still</Label>
  <Label x={490} y={1100} color={plateColors.motion} size={37}>The regions between them move</Label>
  <Label x={490} y={1210} size={29}>Side view • slowed and exaggerated</Label>
 </g>;
};
export const ChladniSand=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),time=frame/30;const root=useRef<HTMLDivElement>(null);
 const [handle]=useState(()=>delayRender('Load chosen experimental caption font'));
 const [fontsReady,setFontsReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 52px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setFontsReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end));
 const beat=plan.beats[index]!,local=(frame-beat.frames.start)/30,progress=(frame-beat.frames.start)/(beat.frames.end-beat.frames.start);
 const cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!fontsReady||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect();
 const bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('CHLADNI_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 52px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,fontsReady,handle]);
 let scene:React.ReactNode;
 if(index===3)scene=<Section time={time} showGrains/>;
 else if(index===2)scene=<g><ChladniPlate mode={0} formation={.1+.8*progress} time={time} zoom={2.0}/><Label x={490} y={395} color={plateColors.motion} size={43}>Moving regions displace grains</Label></g>;
 else if(index===6)scene=<g><ChladniPlate mode={1} formation={1} time={time}/><g data-critical="support"><path d="M455 1225 L455 1160 L525 1160 L525 1225" fill="none" stroke="#BBC1B2" strokeWidth={6}/><circle cx={490} cy={825} r={13} fill="#202323" stroke="#ABB2A3" strokeWidth={3}/></g><Label x={490} y={395} size={35}>Plate + support + excitation</Label></g>;
 else if(index===5){const second=progress>.5;scene=<g><ChladniPlate mode={second?2:1} formation={smooth((progress-(second?.5:0))/.35)} time={time}/><Label x={490} y={395} size={42}>{second?'Another vibration mode':'A different vibration mode'}</Label></g>;}
 else {const formation=index===0?clamp(local/1.6):index===1?clamp((local-.2)/2):1;scene=<g><ChladniPlate mode={index===7?2:0} formation={formation} time={time} nodes={index===4} highlight={index===7&&progress>.55}/>{index===4&&<Label x={490} y={395} color={plateColors.node} size={43}>Sand traces the nodal lines</Label>}{index===7&&progress>.55&&<Label x={490} y={395} color={plateColors.node} size={48}>A map of stillness</Label>}</g>;}
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 45% 38%, #252A28 0%, #111514 66%, #0D100F 100%)',fontFamily:'Manrope',color:'#F5E8CE',overflow:'hidden'}}>
  <svg width={1080} height={1920} style={{position:'absolute'}}>{scene}</svg>
  <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:120,top:1273,width:750,fontSize:27,lineHeight:1.3,color:'#AEB8A9'}}>Illustrative model • tones are not calibrated</div>
  {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:52,fontWeight:600,lineHeight:1.28,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
  {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
  <Audio src={staticFile('audio/chladni/illustrative-tones.wav')} volume={1}/>
 </AbsoluteFill>;
};
