import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {Possibilities,Cancellation,TrialEvent,Qtext,Photon,Detector,Absorber,unit} from '../components/QuantumPossibilities';
import plan from '../production/plans/ifm-v3.json';
import captions from '../captions/plans/ifm-v3.json';
import narration from '../production/narration/ifm-v3.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const InteractionFreeV3=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load optical font')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 48px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('IFM_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 48px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,ready,handle]);
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 48% 40%, #1F3835 0%, #0F201E 56%, #091412 100%)',fontFamily:'Manrope',color:'#F4EEE1',overflow:'hidden'}}>
 <div data-critical="brand" style={{position:'absolute',left:125,top:252,fontSize:25,letterSpacing:5,color:'#A1B2A4'}}>MAGNIVIS</div>
 <svg width={1080} height={1920} style={{position:'absolute'}}><g data-critical="scene">
 {index===0?<g><Qtext x={145} y={440} size={34}>HOW CAN LIGHT REVEAL IT?</Qtext><Photon x={240+20*Math.sin(progress*3)} y={760}/><Absorber x={490} y={760} scale={1.8}/><Detector x={760} y={760} r={65}/><Qtext x={145} y={1100} size={31}>Without absorption or reflection?</Qtext></g>:null}
 {index===1?<Possibilities progress={progress} entry/>:null}
 {index===2?<Cancellation progress={progress}/>:null}
 {index===3?<Possibilities progress={1} blocked/>:null}
 {index===4?<TrialEvent absorbed progress={progress}/>:null}
 {index===5?<TrialEvent absorbed={false} progress={progress}/>:null}
 {index===6?<TrialEvent absorbed={false} progress={.5+progress*.5} climax/>:null}
 {index===7?<Cancellation progress={progress} blocked/>:null}
 {index===8?<g><Qtext x={145} y={440} size={37}>INTERACTION-FREE</Qtext><Qtext x={145} y={500} size={37}>MEASUREMENT</Qtext><Detector x={535} y={800} r={100} click pulse={unit(Math.sin(progress*9))}/><Qtext x={145} y={1090} size={31}>Experimentally demonstrated.</Qtext></g>:null}
 {index===9?<g><Qtext x={145} y={440} size={34}>DIFFERENT TRIALS</Qtext><Qtext x={145} y={505} size={29} color="#B1C5BD">Success is probabilistic.</Qtext>
 <Absorber x={190} y={690} scale={.7}/><Qtext x={270} y={705} color="#F4BE7F" size={31}>Absorbed • trial ends</Qtext>
 <Detector x={190} y={870} r={38} click/><Qtext x={270} y={885} color="#89E2DE" size={31}>Dark-output click • detected</Qtext>
 <Detector x={190} y={1050} r={38} click color="#F4BE7F"/><Qtext x={270} y={1065} size={31}>Other output • inconclusive</Qtext>
 <Qtext x={145} y={1170} color="#B1C5BD" size={29}>A successful trial avoids absorption.</Qtext></g>:null}
 </g></svg>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:125,top:1230,width:735,fontSize:26,lineHeight:1.3,color:'#B3C5B9'}}>Ideal quantum model • paths show possibilities<br/>Waves show probability amplitudes, not photon halves</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:48,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
