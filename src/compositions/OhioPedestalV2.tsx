import {RescueSequence, FuelPayoff} from './ohio/RescueSequence';
import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Img,Sequence,interpolate,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/space-grotesk/latin-500.css';
import narration from '../production/narration/ohio.json';
import captions from '../captions/plans/ohio-v2.json';
const ink='#071c20',ivory='#f1efe7',brass='#d9b577',muted='#b4c3bd';
const ease=(f:number,a:number,b:number)=>{const t=interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return t*t*(3-2*t);};
const Label:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;color?:string;kind?:string}>=({x,y,children,size=38,color=ivory,kind='critical'})=><div data-qabounds={kind} style={{position:'absolute',left:x,top:y,fontSize:size,lineHeight:1.25,fontWeight:600,color,whiteSpace:'pre',textShadow:'0 2px 8px rgba(0,0,0,.45)'}}>{children}</div>;
const Disclosure:React.FC<{children:React.ReactNode}>=({children})=><Label x={112} y={1335} size={32} color={muted} kind="disclosure">{children}</Label>;
const Sea:React.FC<{frame:number}>=({frame})=><svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}><defs><radialGradient id="sea"><stop stopColor="#27484b"/><stop offset="1" stopColor={ink}/></radialGradient></defs><rect width={1080} height={1920} fill="url(#sea)"/>{Array.from({length:68},(_,i)=><path key={i} d={`M${(i*197)%1200-80} ${(i*113+frame*.32)%1900}q${35+i%40} -7 ${95+i%50} 0`} stroke="#90afad" strokeWidth={i%7===0?2:1} opacity={.035+(i%3)*.012}/>)}</svg>;
const Profile:React.FC<{f:number;damage?:boolean;ending?:boolean;torpedo?:boolean}>=({f,damage=false,ending=false,torpedo=false})=>{const water=damage?ease(f,50,115):0,delivery=ending?ease(f,28,78):0;return <>
 <Label x={112} y={320} size={52}>{torpedo?'Torpedoed · 12 August':ending?'What they brought to Malta':damage?'No power. Taking water.':'Thousands of tons of fuel'}</Label>
 <svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}><defs><linearGradient id="steel" x2="0" y2="1"><stop stopColor="#7e8d86"/><stop offset=".5" stopColor="#3b5254"/><stop offset="1" stopColor="#152e34"/></linearGradient><clipPath id="hull"><path d="M132 875H855L822 986Q478 1020 170 980Z"/></clipPath></defs>
 <g data-qabounds="critical-visual" aria-label="Continuous tanker hull and surviving fuel">
 <path d="M132 875H855L822 986Q478 1020 170 980Z" fill="url(#steel)" stroke="#a9b4a9" strokeWidth={3}/><g clipPath="url(#hull)">{[0,1,2,3].map(i=><rect key={i} x={280+i*121} y={906} width={110} height={67} rx={2} fill={brass} opacity={.84-delivery*.54}/>)}{damage&&<path d={`M145 ${984-water*45}q120-15 240 0t240 0t240 0v90H140Z`} fill="#4b8390" opacity={.8}/>}</g>
 <path d="M170 873V823H231V873M186 822V772H209V822M168 831H244" fill="#899b91" stroke="#c3c7b6" strokeWidth={3}/><path d="M480 874V816H551V874M486 830H547M694 873V782" fill="#82968d" stroke="#c9cebf" strokeWidth={3}/><path d="M260 863H800" stroke="#b7c2af" strokeWidth={4}/><path d="M277 863v-18h450v18" stroke="#909f90" strokeWidth={3} fill="none"/>
 {damage&&<path d="M249 895l16 26-23 19 20 30" stroke="#c28970" strokeWidth={5} fill="none"/>}
 </g>
 <path d="M100 1000Q300 988 510 1000T920 1000" stroke="#8caeaa" strokeWidth={3} opacity={.5}/>
 {(!damage||ending)&&<><path d="M520 973V1085" stroke={brass} strokeWidth={3}/><text data-qabounds="critical" x={ending?230:338} y={1145} fill={brass} fontFamily="Manrope" fontSize={48}>{ending?'Fuel delivered':'Fuel still aboard'}</text>{ending&&<g opacity={delivery}><path d="M520 1085H780l-18-10m18 10l-18 10" fill="none" stroke={brass} strokeWidth={3}/><text data-qabounds="critical" x={710} y={1145} fill={brass} fontFamily="Manrope" fontSize={36}>Malta</text>{[0,1,2].map(i=><circle key={i} cx={520+((f*3+i*80)%260)} cy={1085} r={5} fill={brass}/>)}</g>}</>}
 {damage&&<g data-qabounds="critical-visual" aria-label="Propulsion stopped"><circle cx={207} cy={1100} r={32} fill="none" stroke="#9cb0a6" strokeWidth={2}/><path d="M184 1077l46 46m0-46l-46 46" stroke="#c28970" strokeWidth={5}/></g>}
 </svg>
 <Disclosure>{'Original reconstruction · qualitative\nTank layout and damage locations illustrative'}</Disclosure>
 </>;};
const Archive:React.FC<{type:'supported'|'damage'|'arrival'|'unloading';f:number}>=({type,f})=>{
 const opening=type==='supported',wide=type==='arrival'||type==='unloading';
 const meta={supported:['SS OHIO · MALTA, 1942','One tanker.\nA warship on each side.','IWM GM1505 · Sgt Deakin'],damage:['13 AUGUST 1942','The damage was real.','IWM GM1469 · Lt H. E. Cook'],arrival:['15 AUGUST 1942','Grand Harbour. Malta.','IWM GM1480 · official photograph'],unloading:['THE CARGO COMES ASHORE','Fuel delivered.','IWM A11498 · Lt J. E. Russell']}[type];
 const scale=opening?1.03-.03*ease(f,0,75):type==='damage'?1+.035*ease(f,0,100):1;
 return <><div style={{position:'absolute',left:0,top:opening?300:480,width:1080,height:opening?1040:wide?790:820,overflow:'hidden',maskImage:'linear-gradient(transparent,black 9%,black 90%,transparent)'}}>
 <Img src={staticFile(`images/ohio/${type}.jpg`)} style={{position:'absolute',width:opening?1260:wide?1180:950,height:'auto',left:opening?-180:wide?-75:10,top:opening?-140:wide?10:-70,transform:`scale(${scale})`,transformOrigin:'50% 65%'}}/>
 </div><div style={{position:'absolute',left:0,top:250,width:1080,height:460,background:'linear-gradient(#071c20 10%,rgba(7,28,32,.95) 43%,transparent)'}}/><Label x={112} y={300} size={32} color={brass}>{meta[0]}</Label><Label x={112} y={355} size={opening?54:50}>{meta[1]}</Label>
 {opening&&<div data-qabounds="critical-visual" aria-label="Archival tanker flanked by destroyers" style={{position:'absolute',left:300,top:770,width:510,height:360}}/>}
 {type==='damage'&&<Label x={112} y={1200} size={34}>Deck damage from an aircraft crash</Label>}
 {type==='arrival'&&<div data-qabounds="critical-visual" aria-label="Ohio in Grand Harbour" style={{position:'absolute',left:135,top:835,width:690,height:270}}/>}
 {type==='unloading'&&<Label x={112} y={1190} size={34}>{'Discharging into oilers\nBoxall and Plumleaf'}</Label>}
 <Disclosure>{'Archival photograph\n'+meta[2]}</Disclosure></>;
};
const Map:React.FC<{f:number}>=({f})=><><Label x={112} y={320} size={52}>{'An island under siege'}</Label><Label x={112} y={393} size={35} color={brass}>AUGUST 1942</Label>
 <svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}><defs><radialGradient id="locator"><stop stopColor={brass} stopOpacity={.3}/><stop offset="1" stopColor={brass} stopOpacity={0}/></radialGradient></defs>
 <g stroke="#718783" strokeWidth={1} opacity={.15}>{[0,1,2,3,4,5].map(i=><path key={i} d={`M110 ${540+i*115}H875M${165+i*130} 500V1270`}/>)}</g>
 <g fill="#969e87" stroke="#c6c6aa" strokeWidth={2}><path d="M340 588L748 624 635 796 570 787 555 747 493 729 452 691 399 668Z"/><path d="M110 1105L196 1035 252 1050 299 1130 317 1270H110Z"/></g>
 <circle cx={585} cy={931} r={94+ease(f,8,65)*30} fill="url(#locator)"/><circle cx={585} cy={931} r={8} fill={brass}/><path d="M585 931L666 1002H800" stroke={brass} strokeWidth={3} fill="none"/>
 </svg><Label x={490} y={655} size={40} color={ink}>Sicily</Label><Label x={670} y={1020} size={48} color={brass}>Malta</Label><Label x={130} y={1170} size={34} color={ivory}>North Africa</Label><Disclosure>Original geographic locator · simplified</Disclosure></>;
export const OhioPedestalV2:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Ohio fonts')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 54px Manrope'),document.fonts.load('500 20px "Space Grotesk"')]).then(()=>setReady(true));},[]);
 const index=narration.cues.reduce((last,c,i)=>frame>=Math.round(c.start*30)?i:last,0),f=frame-Math.round(narration.cues[index]!.start*30),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-ohio-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const caption=document.querySelector<HTMLElement>('[data-caption]');console.log('OHIO_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:caption?{width:caption.scrollWidth,height:caption.scrollHeight,availableWidth:caption.clientWidth,availableHeight:caption.clientHeight}:null,disclosure:true}));}continueRender(handle);},[frame,inspectQa,ready,handle]);
 return <AbsoluteFill data-ohio-root style={{background:ink,color:ivory,fontFamily:'Manrope',overflow:'hidden'}}><Sea frame={frame}/>
 {index===0?<Archive type="supported" f={f}/>:index===1?<Map f={f}/>:index===2?<Profile f={f}/>:index===3?(f<40?<Profile f={f} torpedo/>:f<95?<Archive type="damage" f={f-40}/>:<RescueSequence phase="disabled" f={f-95}/>):index===4?<RescueSequence phase="tow" f={f}/>:index===5?<RescueSequence phase="joined" f={f}/>:index===6?<Archive type="arrival" f={f}/>:index===7?<Archive type="unloading" f={f}/>:<FuelPayoff f={f}/>}
 <div style={{position:'absolute',left:112,top:265,fontSize:20,letterSpacing:5,opacity:.65,fontFamily:'Space Grotesk'}}>MAGNIVIS</div>
 <div style={{position:'absolute',left:0,top:1420,width:1080,height:500,background:'linear-gradient(transparent,#071c20 26%)'}}/>
 {cue&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:142,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 2px 12px #06191e'}}>{cue.lines.join('\n')}</div>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)}><Audio src={staticFile(c.file)} volume={1}/></Sequence>)}<Audio src={staticFile('audio/ohio/soundscape.wav')} volume={.22}/>
 </AbsoluteFill>;
};
