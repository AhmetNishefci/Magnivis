import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/space-grotesk/latin-500.css';
import narration from '../production/narration/mirror-eyes.json';
import captions from '../captions/plans/mirror-eyes.json';
import {Eye,EyeMacro,Room,gazeAt,ease,mirrorColors as c} from '../components/mirror-eyes/MirrorWorld';
const Label:React.FC<{x?:number;y:number;size?:number;color?:string;kind?:string;children:React.ReactNode}>=({x=112,y,size=40,color=c.paper,kind='critical',children})=><div data-qabounds={kind} style={{position:'absolute',zIndex:2,left:x,top:y,fontSize:size,color,lineHeight:1.25,fontWeight:600,whiteSpace:'pre',textShadow:'0 2px 10px #201b23'}}>{children}</div>;
const Svg:React.FC<{children:React.ReactNode}>=({children})=><svg width={1080} height={1920} style={{position:'absolute',inset:0}}>{children}</svg>;
const Replay:React.FC<{f:number;duration:number;comparison?:boolean}>=({f,duration,comparison=false})=>{
 const enter=comparison?ease(f/12):ease((f-38)/18),progress=f/duration;
 return <><Svg><g opacity={1-enter}><Room frame={f} camera/></g><g opacity={enter}>
 <defs><clipPath id="replay-window"><rect x={118} y={500} width={754} height={525} rx={21}/></clipPath></defs><rect x={109} y={490} width={772} height={645} rx={30} fill="#17272a" stroke="#c1c8b7" strokeWidth={4}/><g clipPath="url(#replay-window)"><g transform="translate(90 115) scale(.82)"><EyeMacro frame={f} slowed/></g></g>
 <path d="M152 1058H837" stroke="#6b8077" strokeWidth={5}/><path d={`M152 1058H${152+685*progress}`} stroke={c.accent} strokeWidth={7}/><circle cx={152+685*progress} cy={1058} r={9} fill={c.paper}/><path d="M150 1100h8m12 0h8" stroke={c.paper} strokeWidth={7}/>
 {comparison&&<g data-qabounds="critical-visual" aria-label="Viewer holds current gaze steady while recorded eyes move"><path d="M385 1235Q500 1180 615 1235Q500 1290 385 1235Z" fill="#e8d8bf"/><ellipse cx={500} cy={1235} rx={28} ry={30} fill="#759781"/><circle cx={500} cy={1235} r={12} fill="#142725"/><path d="M500 1196V1156" stroke={c.accent} strokeWidth={3} strokeDasharray="5 5"/></g>}
 </g></Svg><Label y={350} size={48}>{enter>.1?'Watch it back.':'Record the movement.'}</Label><Label y={423} size={36} color={c.accent}>{enter>.1?'Recorded earlier · viewed later':'External camera · recording'}</Label>
 {enter>.1&&<><Label x={155} y={535} size={32}>EXTERNAL CAMERA · REPLAY</Label><Label x={155} y={975} size={32} color={c.accent}>Eye movement shown slowed</Label></>}
 {comparison&&<Label x={305} y={1300} size={34}>Your gaze can stay still.</Label>}
 {!comparison&&<Label y={1210} size={36} color={c.accent}>{enter>.1?'The movement was there.':'Same person. Same movement.'}</Label>}
</>;
};
const Retinal:React.FC<{f:number;duration:number;sensitivity?:boolean}>=({f,duration,sensitivity=false})=>{
 const t=f/duration,angle=(-7+14*ease(t))*Math.PI/180,rotation=angle*180/Math.PI;
 return <><Svg>
 <defs><radialGradient id="eye-body"><stop stopColor="#fff1d2"/><stop offset=".75" stopColor="#d7c4aa"/><stop offset="1" stopColor="#9b7a68"/></radialGradient></defs>
 <g data-qabounds="critical-visual" aria-label="Simplified rotating eye, fixed incoming light and changing retinal position">
 <circle cx={510} cy={820} r={196} fill="url(#eye-body)" stroke="#edd8bc" strokeWidth={3}/>
 <g transform={`rotate(${rotation} 510 820)`}><path d="M329 740Q273 820 329 900Q348 820 329 740" fill="#9bbdb0" opacity={.8} stroke="#f4edda" strokeWidth={4}/><ellipse cx={360} cy={820} rx={19} ry={61} fill="#f5e5bf" stroke="#bdb395" strokeWidth={3}/><path d="M565 640Q758 820 565 1000" fill="none" stroke="#a45c55" strokeWidth={17}/>{Array.from({length:16},(_,i)=>{const a=(-70+i*9)*Math.PI/180;return <path key={i} d={`M${510+178*Math.cos(a)} ${820+178*Math.sin(a)}l${12*Math.cos(a)} ${12*Math.sin(a)}`} stroke="#e6b29a" strokeWidth={3}/>;})}</g>
 <path d="M159 758L510 820L694 853" fill="none" stroke={c.accent} strokeWidth={4}/><path d="M159 770L510 820L692 846" fill="none" stroke={c.accent} strokeWidth={2} opacity={.4}/><circle cx={694} cy={853} r={10} fill="#ffe0a3"/><path d="M430 604Q520 575 590 619m-20-15 20 15-24 3" stroke={c.paper} strokeWidth={4} fill="none"/>
 <path d="M157 735v55m-17-38h34" stroke={c.paper} strokeWidth={6}/>
 </g></Svg><Label y={350} size={48}>{sensitivity?'Sensitivity falls.':'The image sweeps.'}</Label>
 <Label x={112} y={468} size={34} color={c.accent}>Simplified side view · motion expanded</Label>
 <Label x={618} y={1062} size={35}>Retina</Label><Label x={112} y={1062} size={35} color={c.accent}>Incoming light</Label>
 {sensitivity?<><Svg><g data-qabounds="critical-visual" aria-label="Qualitative sensitivity dip that remains above zero; not measured data"><path d="M175 1265H825" stroke="#8a8b7d" strokeWidth={2}/><path d="M175 1150C305 1150 339 1154 400 1215S535 1245 605 1187S723 1150 825 1150" fill="none" stroke={c.accent} strokeWidth={6}/><circle cx={175+650*ease(t)} cy={t<.25?1150:t>.8?1150:1220} r={7} fill={c.paper} opacity={.6}/></g></Svg><Label x={180} y={1292} size={30} color={c.muted}>Before</Label><Label x={410} y={1292} size={30} color={c.muted}>Eye turn</Label><Label x={720} y={1292} size={30} color={c.muted}>After</Label><Label y={1360} size={31} color={c.muted} kind="disclosure">Sensitivity schematic · not a blackout</Label></>:<Label y={1220} size={36} color={c.accent}>Same scene. Changing retinal image.</Label>}
 </>;
};
const Masking:React.FC<{f:number;duration:number}>=({f,duration})=>{
 const mask=ease((f/duration-.43)/.36);
 return <><Svg><defs><filter id="smear"><feGaussianBlur stdDeviation="15 1"/></filter></defs>
 <g transform={`translate(0 ${-35*ease(f/35)})`}>
 {[230,500,770].map((x,i)=><g key={i}>
 <rect x={x-112} y={630} width={224} height={350} rx={100} fill={i===1?'#76554b':'#c39277'} opacity={i===1?1-mask*.8:1}/>
 <g opacity={i===1?1-mask*.91:1} filter={i===1?'url(#smear)':undefined}><Eye x={x} y={820} scale={1.55} gaze={i===0?-1:i===2?1:0} id={'mask'+i} critical={i!==1}/></g>
 </g>)}
 <g data-qabounds="critical-visual" aria-label="Clear views before and after dominate awareness of brief blur"><path d="M272 1050Q352 1115 433 1050M727 1050Q647 1115 566 1050" stroke={c.accent} strokeWidth={5} fill="none" opacity={mask}/><path d="M417 1047l16 3-8 15M582 1047l-16 3 8 15" stroke={c.accent} strokeWidth={5} fill="none" opacity={mask}/></g>
 </g></Svg><Label y={350} size={48}>Clear views can hide the blur.</Label><Label y={450} size={36} color={c.accent}>Visual masking</Label>
 <Label x={155} y={1010} size={34}>Before</Label><Label x={467} y={1010} size={34} color={c.muted}>Blur</Label><Label x={727} y={1010} size={34}>After</Label>
 <Label y={1230} size={36} color={c.accent}>{mask>.5?'Clear views dominate awareness.':'One eye turn, expanded in time.'}</Label>
 <Label y={1340} size={31} color={c.muted} kind="disclosure">Perception schematic · not literal brain frames</Label></>;
};
export const MirrorEyes:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Mirror eyes fonts')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 54px Manrope'),document.fonts.load('500 20px "Space Grotesk"')]).then(()=>setReady(true));},[]);
 const index=narration.cues.reduce((last,q,i)=>frame>=Math.round(q.start*30)?i:last,0),start=Math.round(narration.cues[index]!.start*30),f=frame-start,duration=(index+1<narration.cues.length?Math.round(narration.cues[index+1]!.start*30):narration.durationFrames)-start,cue=captions.cues.find(q=>frame>=q.startFrame&&frame<q.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-mirror-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const cap=document.querySelector<HTMLElement>('[data-caption]');console.log('MIRROR_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:cap?{width:cap.scrollWidth,height:cap.scrollHeight,availableWidth:cap.clientWidth,availableHeight:cap.clientHeight}:null,disclosure:true}));}continueRender(handle);},[frame,inspectQa,ready,handle]);
 const scene=()=>{
 if(index===1||index===8)return <Replay f={f} duration={duration} comparison={index===8}/>;
 if(index===4||index===5)return <Retinal f={f} duration={duration} sensitivity={index===5}/>;
 if(index===6)return <Masking f={f} duration={duration}/>;
 if(index===2)return <><Svg><EyeMacro frame={f} slowed/></Svg><Label y={350} size={54}>A saccade.</Label><Label y={440} size={38} color={c.accent}>A fast shift of gaze</Label><Label y={1190} size={36}>Continuous movement · shown slowed</Label><Label y={1340} size={31} color={c.muted} kind="disclosure">External view · original animation</Label></>;
 if(index===7)return <><Svg><Room frame={f} subjective zoom={1.18}/><circle cx={gazeAt(f)<0?438:681} cy={752} r={31} fill="none" stroke={c.accent} strokeWidth={3} opacity={.7}/></Svg><Label y={350} size={46}>No black gap.</Label><Label y={424} size={34} color={c.accent}>First-person perception · schematic</Label><Label y={1340} size={31} color={c.muted} kind="disclosure">Illustrates awareness, not the physical reflection</Label></>;
 const zoom=index===0?1+.04*ease(f/duration):index===3?1.08:index===9?1.05-.05*ease(f/duration):1;
 return <><Svg><Room frame={frame} zoom={zoom}/>{index===3&&<g data-qabounds="critical-visual" aria-label="Same observer supplies the eyes visible in the mirror"><path d="M298 820L425 760M300 840L675 760" stroke={c.accent} strokeWidth={3} strokeDasharray="8 9" opacity={.7}/><circle cx={425} cy={760} r={30} stroke={c.accent} strokeWidth={3} fill="none"/><circle cx={675} cy={760} r={30} stroke={c.accent} strokeWidth={3} fill="none"/></g>}</Svg>
 <Label y={350} size={index===3?44:48}>{index===0?'Try it in a mirror.':index===3?'The observer is also moving.':'The mirror kept reflecting.'}</Label>
 <Label y={426} size={34} color={c.accent}>{index===0?'Look from one eye to the other.':index===3?'Your eyes are doing both jobs.':'The missing sweep is perceptual.'}</Label>
 <Label y={1340} size={31} color={c.muted} kind="disclosure">External view · physical reflection stays continuous</Label>
 </>;
 };
 return <AbsoluteFill data-mirror-root style={{background:c.ink,color:c.paper,fontFamily:'Manrope',overflow:'hidden'}}>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,#81574b,#201b23 75%)'}}/>
 {scene()}
 <div style={{position:'absolute',inset:0,zIndex:1,background:'linear-gradient(#201b23 12%,transparent 29%,transparent 65%,#201b23 77%)',pointerEvents:'none'}}/>
 <div style={{position:'absolute',left:112,top:265,zIndex:2,fontSize:20,letterSpacing:5,opacity:.75,fontFamily:'Space Grotesk'}}>MAGNIVIS</div>
 {/* Scene annotations sit above the atmospheric gradient, which remains translucent in their region. */}
 {cue&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,zIndex:3,width:770,height:142,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 2px 12px #201b23'}}>{cue.lines.join('\n')}</div>}
 {narration.cues.map(q=><Sequence key={q.id} from={Math.round(q.start*30)} durationInFrames={Math.ceil(q.duration*30)}><Audio src={staticFile(q.file)} volume={1}/></Sequence>)}<Audio src={staticFile('audio/mirror-eyes/soundscape.wav')} volume={.12}/>
 </AbsoluteFill>;
};
