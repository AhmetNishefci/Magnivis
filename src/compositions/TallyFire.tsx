import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {TallyRecord} from '../components/TallyRecord';
import {Fire,OldPalace,FurnaceSection} from '../components/PalaceFireScene';
import plan from '../production/plans/tally.json';
import captions from '../captions/plans/tally.json';
import narration from '../production/narration/tally.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const Label=({x=490,y,children,size=36,color='#E5D6DD'}:{x?:number;y:number;children:React.ReactNode;size?:number;color?:string})=><text data-critical="label" x={x} y={y} fill={color} fontSize={size} textAnchor="middle" fontWeight={600}>{children}</text>;
const Cart=({x,y}:{x:number;y:number})=><g transform={`translate(${x} ${y})`}><path d="M0 40 H300 L275 135 H28 Z" fill="#69505A" stroke="#C9B1B3" strokeWidth={4}/>{[55,240].map(p=><g key={p}><circle cx={p} cy={155} r={35} fill="#211B29" stroke="#C8A89D" strokeWidth={6}/><path d={`M${p-30} 155 H${p+30} M${p} 125 V185`} stroke="#C8A89D" strokeWidth={4}/></g>)}{Array.from({length:16},(_,i)=><path key={i} d={`M${10+i%4*65} ${30-Math.floor(i/4)*15} l${80+i%3*15} ${-8+i%2*10}`} stroke={i%2?'#B18054':'#D4AA78'} strokeWidth={12}/>)}</g>;
export const TallyFire=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),time=frame/30,root=useRef<HTMLDivElement>(null);
 const [handle]=useState(()=>delayRender('Load historical reconstruction font'));
 const [ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 52px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end));
 const beat=plan.beats[index]!,progress=clamp((frame-beat.frames.start)/(beat.frames.end-beat.frames.start)),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}
 const origin=root.current.getBoundingClientRect();const bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('TALLY_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 52px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);
 },[frame,inspectQa,cue,ready,handle]);
 let scene:React.ReactNode;
 if(index===0)scene=<><Label y={350} size={76}>1834</Label><Label y={428} size={34}>A receipt. A furnace. A catastrophe.</Label><OldPalace time={time} burning/><TallyRecord x={235} y={565} scale={.8}/><Label y={1165} size={31}>The old Palace of Westminster</Label></>;
 else if(index===1||index===2)scene=<><Label y={400} size={52}>{index===1?'A record, made of wood':'One transaction. Two records.'}</Label><TallyRecord split={index===2?clamp((progress-.25)*2):0}/>{index===2&&<><Label y={540} size={32}>Matching notches</Label><path d="M455 563 L455 619" stroke="#F19161" strokeWidth={3}/><Label y={1040} size={35}>Each side keeps a half</Label></>}<Label y={1170} size={28}>Schematic tally • no monetary value shown</Label></>;
 else if(index===3)scene=<><Label y={420} size={52}>Obsolete records</Label><Cart x={140} y={715}/><Cart x={520} y={775}/><Label y={1060} size={39}>Two cartloads to dispose of</Label></>;
 else if(index>=4&&index<=6)scene=<><Label y={365} size={45}>Beneath the House of Lords</Label><Label y={460} size={30}>Chamber above</Label><FurnaceSection time={time} feed={index===4?clamp(progress*1.5):0} smoke={index>=5} breakthrough={index===6}/>{index===5&&<><Label x={440} y={610} size={34} color="#F5B18D">Heat. Smoke.</Label><Label x={440} y={670} size={30}>Warnings noticed</Label></>}<Label y={1220} size={28}>Schematic furnace / chimney / floor</Label></>;
 else if(index===7)scene=<><Label y={385} size={50}>The aftermath</Label><g transform="translate(0 -70)"><OldPalace ruined/></g><path d="M155 995 V630 L280 505 L410 630 V995 Z" fill="#635663" stroke="#E7D7D8" strokeWidth={5}/><path d="M177 648 L280 550 L385 648 M177 674 L280 576 L385 674" fill="none" stroke="#CBBBAF" strokeWidth={5}/><Label x={280} y={1110} size={29}>Westminster Hall</Label><Label x={280} y={1160} size={31} color="#F4C195">Survived</Label><Label x={640} y={1110} size={29}>Both chambers</Label><Label x={640} y={1160} size={31}>Destroyed</Label></>;
 else scene=<><Label y={420} size={49}>The disposal decision</Label><TallyRecord x={165} y={640}/><path d="M230 860 H750 V1160 H230 Z" fill="#49303A" stroke="#BA857A" strokeWidth={4}/><rect x={290} y={925} width={400} height={190} rx={10} fill="#241823"/><Fire x={365} y={1105} width={235} height={180} time={time}/><Label y={1220} size={30}>Where the records were burned mattered</Label></>;
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 40% 45%, #3D2B40 0%, #221C2E 62%, #181522 100%)',fontFamily:'Manrope',color:'#FFF1DF',overflow:'hidden'}}>
 <div style={{position:'absolute',left:120,top:252,fontSize:25,letterSpacing:5,color:'#C7ABB9'}}>MAGNIVIS</div>
 <svg width={1080} height={1920} style={{position:'absolute'}}><g data-critical="scene">{scene}</g></svg>
 <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:120,top:1290,width:750,fontSize:27,lineHeight:1.3,color:'#C7ABB9'}}>Original reconstruction • geometry simplified</div>
 {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}><div data-caption-text style={{fontSize:52,fontWeight:600,lineHeight:1.28,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div></div>}
 {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 <Audio src={staticFile('audio/tally/illustrative-sound.wav')} volume={1}/>
 </AbsoluteFill>;
};
