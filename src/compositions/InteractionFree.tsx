import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {OpticalBench,OpticalDefs,AmplitudeInset,BenchLabel} from '../components/OpticalBench';
import plan from '../production/plans/ifm.json';
import captions from '../captions/plans/ifm.json';
import narration from '../production/narration/ifm.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const InteractionFree=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load optical font')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 48px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('IFM_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 48px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,ready,handle]);
 const blocked=index===0||index>=4;
 const darkClick=index===0||index===6||index===8||(index===5&&progress>.28);
 const trial=index===4?'ABSORBED TRIAL':index===5||index===6||index===8||index===0?'SUCCESSFUL TRIAL':index===7?'THREE POSSIBLE OUTCOMES':'BOTH PATHS OPEN';
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 55% 34%, #26342F 0%, #111E1A 58%, #0A1210 100%)',fontFamily:'Manrope',color:'#F4EEE1',overflow:'hidden'}}>
 <div data-critical="brand" style={{position:'absolute',left:125,top:252,fontSize:25,letterSpacing:5,color:'#A1B2A4'}}>MAGNIVIS</div>
 <svg width={1080} height={1920} style={{position:'absolute'}}><OpticalDefs/><g data-critical="scene">
 <BenchLabel x={125} y={330} size={27} color="#AABCAF">{trial}</BenchLabel>
 <OpticalBench blocked={blocked} darkClick={darkClick} brightClick={index===2||index===3} absorbed={index===4} progress={progress}/>
 {index===3||index===6||index===8?<AmplitudeInset blocked={blocked}/>:index===7?<g>
 <BenchLabel x={145} y={1020} size={28} color="#E9B996">Absorbed • neither output clicks</BenchLabel>
 <BenchLabel x={145} y={1090} size={28} color="#E8B679">Bright output • inconclusive</BenchLabel>
 <BenchLabel x={145} y={1160} size={28} color="#83DBD7">Dark output • obstacle detected</BenchLabel>
 </g>:<g><BenchLabel x={145} y={1050} size={32}>{index===0?'The obstacle is detected.':index===1?'Two alternatives. One photon.':index===2?'The dark output stays dark.':index===4?'This trial ends at the absorber.':'The dark output can now click.'}</BenchLabel><BenchLabel x={145} y={1130} size={28} color="#B3C5B9">{index===0?'The detected photon was not absorbed.':index===1?'Lines show paths, not photon trajectories.':index===2?'Correctly aligned ideal apparatus':index===4?'No photon reaches either output.':'A different trial: the photon survives.'}</BenchLabel></g>}
 </g></svg>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:125,top:1250,width:735,fontSize:26,lineHeight:1.3,color:'#B3C5B9'}}>Ideal-model schematic • curves are path amplitudes</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:48,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
