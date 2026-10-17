import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Img,Sequence,interpolate,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/space-grotesk/latin-500.css';
import narration from '../production/narration/ohio.json';
import captions from '../captions/plans/ohio.json';
const ink='#071c20',ivory='#f1efe7',brass='#d9b577',muted='#b4c3bd';
const ease=(f:number,a:number,b:number)=>{const t=interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return t*t*(3-2*t);};
const Label:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;color?:string;kind?:string}>=({x,y,children,size=38,color=ivory,kind='critical'})=><div data-qabounds={kind} style={{position:'absolute',left:x,top:y,fontSize:size,lineHeight:1.25,fontWeight:600,color,whiteSpace:'pre',textShadow:'0 2px 8px rgba(0,0,0,.45)'}}>{children}</div>;
const Disclosure:React.FC<{children:React.ReactNode}>=({children})=><Label x={112} y={1335} size={32} color={muted} kind="disclosure">{children}</Label>;
const Sea:React.FC<{frame:number}>=({frame})=><svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}><defs><radialGradient id="sea"><stop stopColor="#27484b"/><stop offset="1" stopColor={ink}/></radialGradient></defs><rect width={1080} height={1920} fill="url(#sea)"/>{Array.from({length:68},(_,i)=><path key={i} d={`M${(i*197)%1200-80} ${(i*113+frame*.32)%1900}q${35+i%40} -7 ${95+i%50} 0`} stroke="#90afad" strokeWidth={i%7===0?2:1} opacity={.035+(i%3)*.012}/>)}</svg>;
// Original qualitative shapes: geometry and tank arrangement are not engineering drawings.
const Tanker:React.FC<{x:number;y:number;scale?:number;rotate?:number;fuel?:boolean;damaged?:boolean}>=({x,y,scale=1,rotate=0,fuel=false,damaged=false})=><g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} data-qabounds="critical-visual" aria-label="Ohio qualitative tanker model">
 <path d="M-68 265V-190Q-65-248 0-280Q65-248 68-190V265Q0 291-68 265Z" fill="#020c10" opacity={.6} transform="translate(12 12)"/>
 <path d="M-68 265V-190Q-65-248 0-280Q65-248 68-190V265Q0 291-68 265Z" fill="#677775" stroke="#c2cac1" strokeWidth={3}/>
 <path d="M-57 252V-188Q-55-235 0-265Q55-235 57-188V252Z" fill="#3c5153" stroke="#8a9b96" strokeWidth={1.5}/>
 {[-180,-113,-46,21].map(y=><g key={y}><rect x={-47} y={y} width={94} height={55} rx={4} fill={fuel?'#ad8248':'#5b6b68'} stroke={fuel?brass:'#81918b'} strokeWidth={2}/><path d={`M-47 ${y+27}h94`} stroke="#0b2529" strokeWidth={2}/><circle cx={0} cy={y+27} r={9} fill={fuel?'#e8c17b':'#87978e'} stroke="#405856" strokeWidth={2}/></g>)}
 <path d="M-22-219V60M22-219V60" stroke="#a3aaa0" strokeWidth={4}/><path d="M-52-145H52M-52-78H52M-52-11H52M-52 56H52" stroke="#c3c7b8" strokeWidth={2}/>
 <rect x={-48} y={83} width={96} height={62} rx={3} fill="#b1b6a6" stroke="#d6d7c6" strokeWidth={2}/><rect x={-37} y={95} width={74} height={18} fill="#324b50"/>
 <rect x={-24} y={172} width={48} height={59} rx={9} fill="#a7a68d"/><rect x={-15} y={179} width={30} height={35} rx={5} fill="#273d40"/>
 <path d="M0-250v-29M0 256v25M-49 73H49" stroke={ivory} strokeWidth={3}/>
 {damaged&&<><path d="M-65-45l21 18-17 22 18 10-23 21" stroke="#bd8169" strokeWidth={4} fill="none"/><path d="M-53 65l26 9 20-11 26 12 33-8" stroke="#cb967a" strokeWidth={3} fill="none"/></>}
 </g>;
const Destroyer:React.FC<{x:number;y:number;scale?:number;rotate?:number;kind?:boolean}>=({x,y,scale=1,rotate=0,kind=true})=><g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} data-qabounds={kind?'critical-visual':undefined} aria-label="Qualitative assisting warship">
 <path d="M-27 148V-115Q-23-157 0-179Q23-157 27-115V148Z" fill="#879891" stroke="#d5d9cd" strokeWidth={2}/><path d="M0-153V132" stroke="#334f52" strokeWidth={3}/>
 {[-101,100].map(y=><g key={y}><circle cx={0} cy={y} r={16} fill="#b7b9a7"/><path d={`M0 ${y}v-35`} stroke={ivory} strokeWidth={3}/></g>)}<rect x={-23} y={-49} width={46} height={39} fill="#c0c3b1"/>{[18,60].map(y=><rect key={y} x={-12} y={y} width={24} height={22} rx={5} fill="#33484a"/>)}
 </g>;
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
const Towing:React.FC<{f:number;joined:boolean}>=({f,joined})=>{const join=joined?ease(f,12,98):0,yaw=joined?Math.sin(f/23)*3*(1-join):Math.sin(f/21)*18;
 return <><Label x={112} y={320} size={52}>{joined?'Bring the warships alongside':'A tow that swung off course'}</Label>
 <svg width={1080} height={1920} style={{position:'absolute',left:0,top:0}}>
 <path d="M495 530V1250" stroke="#9dada2" strokeDasharray="9 14" strokeWidth={2} opacity={.3}/>
 <g opacity={.5}><path d="M470 475L440 435M520 475L551 435" stroke="#94c2bd" strokeWidth={3}/></g>
 <Destroyer x={495} y={560} scale={.53}/>
 <path d={`M495 640L${495+Math.sin(yaw*Math.PI/180)*237} ${947-Math.cos(yaw*Math.PI/180)*237}`} stroke={brass} strokeWidth={3}/>
 <Tanker x={495} y={947} scale={.85} rotate={yaw} damaged fuel={false}/>
 {joined&&<><Destroyer x={245+165*join} y={1000-12*join} scale={.82}/><Destroyer x={745-165*join} y={1000-12*join} scale={.82}/>
 <g opacity={ease(f,88,112)} data-qabounds="critical-visual" aria-label="Illustrative alongside connections"><path d="M432 869l-36-13M432 1060l-36 28M553 869l37-13M553 1060l37 28" stroke={brass} strokeWidth={5}/><path d="M425 925l14 4M550 925l15-4" stroke="#dbd5bc" strokeWidth={10}/></g></>}
 </svg>
 {joined?<><Label x={112} y={650} size={34} color={brass}>Other vessels tow</Label><Label x={112} y={1215} size={36}>Two destroyers secured either side</Label></>:<Label x={112} y={1215} size={36} color={brass}>Steering the damaged tanker was difficult</Label>}
 <Disclosure>{'Original reconstruction · time compressed\nShapes, scale and lines qualitative'}</Disclosure></>;
};
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
export const OhioPedestal:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Ohio fonts')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 54px Manrope'),document.fonts.load('500 20px "Space Grotesk"')]).then(()=>setReady(true));},[]);
 const index=narration.cues.reduce((last,c,i)=>frame>=Math.round(c.start*30)?i:last,0),f=frame-Math.round(narration.cues[index]!.start*30),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-ohio-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const caption=document.querySelector<HTMLElement>('[data-caption]');console.log('OHIO_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:caption?{width:caption.scrollWidth,height:caption.scrollHeight,availableWidth:caption.clientWidth,availableHeight:caption.clientHeight}:null,disclosure:true}));}continueRender(handle);},[frame,inspectQa,ready,handle]);
 return <AbsoluteFill data-ohio-root style={{background:ink,color:ivory,fontFamily:'Manrope',overflow:'hidden'}}><Sea frame={frame}/>
 {index===0?<Archive type="supported" f={f}/>:index===1?<Map f={f}/>:index===2?<Profile f={f}/>:index===3?(f<40?<Profile f={f} torpedo/>:f<95?<Archive type="damage" f={f-40}/>:<Profile f={f-95} damage/>):index===4?<Towing f={f} joined={false}/>:index===5?<Towing f={f} joined/>:index===6?<Archive type="arrival" f={f}/>:index===7?<Archive type="unloading" f={f}/>:<Profile f={f} ending/>}
 <div style={{position:'absolute',left:112,top:265,fontSize:20,letterSpacing:5,opacity:.65,fontFamily:'Space Grotesk'}}>MAGNIVIS</div>
 <div style={{position:'absolute',left:0,top:1420,width:1080,height:500,background:'linear-gradient(transparent,#071c20 26%)'}}/>
 {cue&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:142,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 2px 12px #06191e'}}>{cue.lines.join('\n')}</div>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)}><Audio src={staticFile(c.file)} volume={1}/></Sequence>)}<Audio src={staticFile('audio/ohio/soundscape.wav')} volume={.22}/>
 </AbsoluteFill>;
};
