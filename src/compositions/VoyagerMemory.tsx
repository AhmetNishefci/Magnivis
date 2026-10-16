import React, {useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Img,Sequence,interpolate,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/space-grotesk/latin-500.css';
import narration from '../production/narration/voyager.json';
import captions from '../captions/plans/voyager.json';
const ivory='#f4f0e7',gold='#e8bb73',red='#df725d',blue='#9ed4dc';
const ease=(f:number,a:number,b:number)=>{const t=interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return t*t*(3-2*t);};
const Label:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;color?:string;kind?:string}>=({x,y,children,size=36,color=ivory,kind='critical'})=><div data-qabounds={kind} style={{position:'absolute',left:x,top:y,fontSize:size,color,lineHeight:1.25,whiteSpace:'pre',fontWeight:600}}>{children}</div>;
const Stars:React.FC=()=> <svg width="1080" height="1920" style={{position:'absolute'}}>{Array.from({length:160},(_,i)=><circle key={i} cx={(i*379.3)%1080} cy={(i*191.7)%1920} r={i%9===0?1.7:.8} fill={ivory} opacity={.12+(i%5)*.06}/>)}</svg>;
const FailedChip:React.FC<{small?:boolean}>=({small=false})=><g transform={small?'translate(195 860) scale(.66)':'translate(155 760)'}><rect x={-10} y={-10} width={230} height={290} rx={7} fill="#131a1d" stroke="#596266" strokeWidth={3}/>{Array.from({length:10},(_,i)=><g key={i}><path d={`M-10 ${16+i*25}h-22 M220 ${16+i*25}h22`} stroke="#9a998b" strokeWidth={5}/></g>)}<rect x={15} y={20} width={180} height={220} rx={3} fill="#3b2423" stroke={red} strokeWidth={3}/><path d="M62 88l84 84m0-84l-84 84" stroke={red} strokeWidth={9}/></g>;
const Memory:React.FC<{stage:number;f:number}>=({stage,f})=>{
 const move=stage>=4?ease(f,35,115):0,connect=stage>=4?ease(f,110,175):0;
 const shrink=stage===3?ease(f,0,30):0;
 if(stage===1)return <><Label x={120} y={300} size={31} color="#a7b0b2">FLIGHT DATA SUBSYSTEM</Label><Label x={120} y={352} size={48}>One chip stops working</Label><svg width="1080" height="1920"><path d="M140 650H420M710 900H860" fill="none" stroke="#718082" strokeWidth={3}/>{[0,1,2].map(j=><rect key={j} x={140+((f*2+j*80)%260)} y={642} width={22} height={16} fill={gold} opacity={.8}/>)}<g transform="translate(260 -340) scale(1.27)"><FailedChip/></g><path d="M720 880l22 40m-8-40l22 40m-8-40l22 40m-8-40l22 40" stroke={red} strokeWidth={4} opacity={ease(f,25,45)}/></svg><Label x={245} y={1120} size={38} color={red}>Damaged memory</Label><Label x={120} y={1360} size={30} color="#aeb7b9" kind="disclosure">Simplified memory visualization · not actual layout</Label></>;
 return <>
 <Label x={120} y={300} size={31} color="#a7b0b2">FLIGHT DATA SUBSYSTEM</Label>
 <Label x={120} y={352} size={48}>{stage===2?'Move the instructions':stage===3?'One block. No room.':'Split. Relocate. Reconnect.'}</Label>
 <svg width="1080" height="1920" style={{position:'absolute'}}>
 <defs><linearGradient id="board" x2=".9" y2="1"><stop stopColor="#253133"/><stop offset="1" stopColor="#0a1013"/></linearGradient><linearGradient id="tile"><stop stopColor="#f0cf90"/><stop offset="1" stopColor="#b68946"/></linearGradient></defs>
 <g transform={stage===3?'translate(-210 -180) scale(1.35)':'translate(0 0)'}>
 <rect x={112} y={555} width={770} height={760} rx={14} fill="url(#board)" stroke="#394447" strokeWidth={2}/>
 {Array.from({length:24},(_,i)=><path key={i} d={`M${130+i*30} 570v${80+(i%4)*34}h${20+(i%3)*20}v${310+(i%5)*45}`} fill="none" stroke="#64716b" strokeWidth={1.2} opacity={.21}/>)}
 {[0,1,2].map(i=><g key={i}><rect x={515} y={625+i*245} width={290} height={132} rx={4} fill="#091215" stroke={blue} strokeWidth={2}/><path d={`M530 ${657+i*245}h260 M530 ${685+i*245}h260 M530 ${713+i*245}h260`} stroke="#4d686c" strokeWidth={2}/></g>)}
 <FailedChip/>
 {stage>=2&&[0,1,2].map(i=>{
 const lift=stage===2?ease(f,15,80):1;
 let x=200+lift*55,y=825-lift*210+i*50;
 if(stage===3){x=255+shrink*110;y=615+i*50;}
 if(stage>=4){x=255+move*280;y=(615+i*50)*(1-move)+(645+i*245)*move;}
 return <g key={i} transform={`translate(${x} ${y})`}><rect width={stage===3?330:stage>=4?250:180} height={50} rx={4} fill="url(#tile)" stroke="#ffe0a7" strokeWidth={1.5}/>{Array.from({length:5},(_,j)=><path key={j} d={`M${14+j*30} 18h17 M${14+j*30} 30h10`} stroke="#5b492e" strokeWidth={3}/>)}</g>;
 })}
 {stage===2&&<rect x={200+ease(f,15,80)*55} y={825-ease(f,15,80)*210} width={180} height={150} fill="none" stroke="#ffe0a7" strokeWidth={4}/>}
 {stage===3&&<rect x={255+shrink*110} y={615} width={330} height={150} fill="none" stroke="#ffe0a7" strokeWidth={4}/>}
 {stage===4&&<rect x={255} y={615} width={250} height={150} fill="none" stroke="#ffe0a7" strokeWidth={4} opacity={1-ease(f,0,35)}/>}
 {stage>=4&&<g opacity={connect}><path d="M490 670H455V1160H535 M455 915H535" fill="none" stroke={ivory} strokeWidth={5}/>{[0,1,2].map(i=><circle key={i} cx={455} cy={670+i*245} r={9} fill={ivory}/>)}<circle cx={455} cy={670+((f-110)*4%490+490)%490} r={8} fill={gold}/></g>}
 {stage===3&&<g opacity={shrink}><path d="M755 595l40 40m0-40l-40 40" stroke={red} strokeWidth={6}/><path d="M690 780v-25" stroke={red} strokeWidth={4}/></g>}
 </g></svg>
 <Label x={152} y={1190} size={30} color={red}>{stage>=4?'FAILED · BYPASSED':'FAILED'}</Label>
 {stage>=4&&connect>.5&&<Label x={535} y={1260} size={30} color={blue}>New locations linked</Label>}
 {stage===3&&<Label x={525} y={520} size={32} color={blue}>Available space</Label>}
 <Label x={120} y={1360} size={30} color="#aeb7b9" kind="disclosure">Simplified memory visualization · not actual layout</Label>

 </>;
};
const Space:React.FC<{ending?:boolean;f:number}>=({ending=false,f})=><>
 <Img src={staticFile(`images/voyager/${ending?'explorer':'space'}.jpg`)} style={{position:'absolute',width:ending?1420:1650,height:'auto',maskImage:'linear-gradient(transparent,black 10%,black 85%,transparent)',left:ending?-150:-280,top:ending?490:440,transform:`scale(${1+Math.min(f,220)/6000})`,transformOrigin:'50% 50%'}}/>
 <AbsoluteFill style={{background:'linear-gradient(0deg,#050b10 10%,transparent 38%,transparent 68%,#050b10 88%)'}}/>
 <Label x={120} y={300} size={31} color={ending?blue:gold}>{ending?'A WORKAROUND ACROSS SPACE':'APRIL 2024 · EARTH DISTANCE'}</Label>
 <Label x={120} y={355} size={ending?62:80}>{ending?'Still broken.\nStill working.':'15+ billion miles'}</Label>
 {!ending&&<Label x={120} y={1250} size={33} color={red}>{'SIGNAL RECEIVED\nDATA UNREADABLE'}</Label>}
 <Label x={120} y={1360} size={30} color="#b5babb" kind="disclosure">Artist concept · Courtesy NASA/JPL-Caltech</Label>
 </>;
const Radio:React.FC<{f:number}>=({f})=>{const progress=ease(f,20,145);return <>
 <Label x={120} y={300} size={33} color={gold}>APRIL 2024 · ONE WAY</Label><Label x={120} y={355} size={88}>22½ hours</Label>
 <svg width="1080" height="1920"><defs><radialGradient id="earth"><stop stopColor="#6c999f"/><stop offset=".65" stopColor="#274a60"/><stop offset="1" stopColor="#0a1824"/></radialGradient></defs>
 <path d="M230 1150L790 660" stroke="#68747a" strokeWidth={2}/>
 <circle cx={225} cy={1150} r={95} fill="url(#earth)" stroke="#91acb3" strokeWidth={2}/>
 <g transform="translate(790 660) rotate(-40)"><path d="M-54-35Q0 55 54-35Z" fill="#c9c9bf"/><path d="M0 8v65m-50-105L0 8l50-40" stroke="#ddd8c9" strokeWidth={4}/></g>
 <path d={`M230 1150L${230+560*progress} ${1150-490*progress}`} stroke={gold} strokeWidth={5}/><circle cx={230+560*progress} cy={1150-490*progress} r={10} fill={gold}/>
 </svg>
 <Label x={120} y={1280} size={33}>Earth</Label><Label x={635} y={780} size={33}>Voyager 1</Label>
 <Label x={120} y={1360} size={30} color="#aeb7b9" kind="disclosure">Signal path schematic · time compressed</Label>
 </>;};
const Reply:React.FC<{f:number}>=({f})=>{const science=f>155;return <>
 <Label x={120} y={300} size={34} color={blue}>{science?'LATER IN 2024':'APRIL 20, 2024'}</Label>
 <Label x={120} y={365} size={science?64:70}>{science?'Science follows later':'Engineering data\nreadable again'}</Label>
 <svg width="1080" height="1920">{Array.from({length:8},(_,i)=>{const w=interpolate(f,[15+i*7,50+i*7],[10,200+(i%3)*95],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <g key={i}><circle cx={155} cy={660+i*65} r={5} fill={blue}/><path d={`M185 ${660+i*65}h${w}`} stroke={ivory} strokeWidth={5}/><path d={`M${240+w} ${660+i*65}h80`} stroke={blue} strokeWidth={3}/></g>;})}</svg>
 <Label x={120} y={science?1240:1250} size={science?34:38} color={science?ivory:blue}>{science?'May → June 2024':'Health and status received'}</Label>
 <Label x={120} y={1360} size={30} color="#aeb7b9" kind="disclosure">Illustrative data · source: NASA 2024 mission reports</Label>
 </>;};
export const VoyagerMemory:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Voyager fonts and typography')),[ready,setReady]=useState(false);useEffect(()=>{Promise.all([document.fonts.load('600 54px Manrope'),document.fonts.load('500 20px "Space Grotesk"')]).then(()=>setReady(true));},[]);const i=narration.cues.reduce((last,c,index)=>frame>=Math.round(c.start*30)?index:last,0);const start=Math.round(narration.cues[i]!.start*30),f=frame-start,cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const nodes=[...document.querySelectorAll<HTMLElement>('[data-qabounds]')],root=document.querySelector('[data-voyager-root]')!.getBoundingClientRect(),scale=root.width/1080;const bounds=nodes.map(el=>{const r=el.getBoundingClientRect();return {kind:el.dataset.qabounds!,text:el.innerText,x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const caption=document.querySelector<HTMLElement>('[data-caption]');console.log('VOYAGER_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:caption?{width:caption.scrollWidth,height:caption.scrollHeight,availableWidth:caption.clientWidth,availableHeight:caption.clientHeight}:null,disclosure:true}));}continueRender(handle);},[frame,inspectQa,ready,handle]);
 return <AbsoluteFill data-voyager-root style={{background:'#050b10',color:ivory,fontFamily:'Manrope',overflow:'hidden'}}>
 <Stars/>
 {i===0?<Space f={f}/>:i<=4?<Memory stage={i} f={f}/>:i===5?<Radio f={f}/>:i===6?<Reply f={f}/>:<Space ending f={f}/>}
 <div style={{position:'absolute',left:120,top:270,opacity:.5,fontSize:20,letterSpacing:5,fontFamily:'Space Grotesk'}}>MAGNIVIS</div>
 {cue&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:142,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 3px 18px #000,0 2px 3px #000'}}>{cue.lines.join('\n')}</div>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)}><Audio src={staticFile(c.file)} volume={1}/></Sequence>)}
 <Audio src={staticFile('audio/voyager/soundscape.wav')} volume={.28}/>
 </AbsoluteFill>;
};
