import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {ClosedScroll,DigitalSurface,SliceLayers,ScrollDefs,ScrollLabel} from '../components/ScrollSurface';
import plan from '../production/plans/scroll.json';
import captions from '../captions/plans/scroll.json';
import narration from '../production/narration/scroll.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const SealedScroll=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load conservation font')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 48px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('SCROLL_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 48px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,ready,handle]);
 let scene:React.ReactNode;
 if(index===0||index===8)scene=<><ScrollLabel y={400} size={42}>Read it. Keep it closed.</ScrollLabel><ClosedScroll y={650} scale={.9}/><ScrollLabel y={830} size={29}>Physical original</ScrollLabel><DigitalSurface flatten={1} scale={.61} x={170} y={490}/><ScrollLabel y={1165} size={29}>Digital image • illustrative marks</ScrollLabel></>;
 else if(index===1)scene=<><ScrollLabel y={400} size={39}>Opening could destroy the evidence</ScrollLabel><ClosedScroll/><path d="M210 1020 L250 1090 L220 1120 Z" fill="#28333A"/><path d="M300 1030 L337 1060 L309 1095 Z" fill="#444D50"/><ScrollLabel y={1190} size={30}>Fragile, charred parchment</ScrollLabel></>;
 else if(index===2)scene=<><ScrollLabel y={400} size={41}>Work on a volume</ScrollLabel><ClosedScroll scale={.88}/>{Array.from({length:10},(_,i)=><ellipse key={i} cx={245+i*50} cy={750} rx={22} ry={100} fill="#E7EFF1" fillOpacity={.05} stroke="#6B929C" strokeOpacity={.5} strokeWidth={2}/>)}<path d={`M${230+progress*520} 585 V920`} stroke="#C44C35" strokeWidth={4}/><ScrollLabel y={1130} size={30}>X-ray scan → 3D representation</ScrollLabel></>;
 else if(index===3)scene=<><ScrollLabel y={400} size={40}>Find the surface inside</ScrollLabel><SliceLayers highlight={2} progress={clamp(progress*2)}/><ScrollLabel y={1160} size={30} color="#AF422E">Trace a surviving layer</ScrollLabel></>;
 else if(index===4||index===5)scene=<><ScrollLabel y={400} size={39}>{index===4?'Carry the ink signal onto the surface':'Flatten the digital surface'}</ScrollLabel><DigitalSurface flatten={index===5?clamp(progress*1.7):0}/><ScrollLabel y={1160} size={29}>{index===4?'Scan contrast • not guessed words':'Same illustrative marks, new geometry'}</ScrollLabel></>;
 else if(index===6)scene=<><ScrollLabel y={400} size={39}>The recovered text was identified</ScrollLabel><DigitalSurface flatten={1}/><ScrollLabel y={1125} size={46}>Book of Leviticus</ScrollLabel><ScrollLabel y={1190} size={27}>Sample marks above are not a transcription</ScrollLabel></>;
 else scene=<><ScrollLabel y={400} size={39}>A signal has to survive in the scan</ScrollLabel><DigitalSurface flatten={1} ink={false}/><ScrollLabel y={1110} size={36}>Geometry alone is not readable ink</ScrollLabel><ScrollLabel y={1190} size={29}>Different materials need different approaches</ScrollLabel></>;
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 48% 38%, #FAFCFA 0%, #E7EDEA 70%, #DCE5E2 100%)',fontFamily:'Manrope',color:'#18232B',overflow:'hidden'}}>
 <div data-critical="brand" style={{position:'absolute',left:120,top:252,fontSize:25,letterSpacing:5,color:'#60716F'}}>MAGNIVIS</div>
 <svg width={1080} height={1920} style={{position:'absolute'}}><ScrollDefs/><g data-critical="scene">{scene}</g></svg>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:120,top:1275,width:750,fontSize:27,lineHeight:1.3,color:'#516761'}}>Schematic geometry • marks are illustrative</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:48,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
