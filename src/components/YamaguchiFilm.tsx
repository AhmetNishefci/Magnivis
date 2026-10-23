import React from 'react';
import {Img,staticFile} from 'remotion';
const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};
export const FilmPlate:React.FC<{name:string;frame:number;progress:number;close?:boolean;children?:React.ReactNode}>=({name,frame,progress,close=false,children})=>{
 const zoom=1.035+smooth(progress)*(close?.075:.035),dx=Math.sin(progress*1.4)*-15;
 return <div style={{position:'absolute',inset:0,overflow:'hidden'}}><Img src={staticFile(`visuals/yamaguchi-two-bombs/${name}.png`)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`translate(${dx}px,${-progress*15}px) scale(${zoom})`,transformOrigin:close?'46% 38%':'50% 45%'}}/>
 {children}
 <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at ${70+Math.sin(frame*.004)*12}% 25%,#eed6a20b,transparent 65%),linear-gradient(90deg,#070b0920,transparent 45%,#00000013)`}}/>
 <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>{Array.from({length:22},(_,j)=><circle key={j} cx={(j*197+frame*(.06+j%3*.02))%1100} cy={(j*157-frame*(.06+j%4*.03)+4000)%1920} r={.65+j%3*.4} fill="#ede3ca" opacity={.055+j%4*.015}/>)}</svg>
 </div>;
};
export const TrainMotion:React.FC<{frame:number}>=({frame})=><svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
 <defs><clipPath id="rail-window"><path d="M775 235L1080 190V1145L785 1040Z"/></clipPath><linearGradient id="rail-mist"><stop stopColor="#a5b9b7" stopOpacity=".2"/><stop offset="1" stopColor="#4f6a65" stopOpacity=".1"/></linearGradient></defs>
 <g clipPath="url(#rail-window)"><rect x={760} y={190} width={320} height={970} fill="url(#rail-mist)"/>
 {Array.from({length:4},(_,j)=>{const x=1100-((frame*7+j*380)%1550);return <g key={j} transform={`translate(${x} 0)`} opacity=".35"><path d="M0 750V1220M-65 790H65" stroke="#373f36" strokeWidth={j%2?7:11}/><path d="M-250 805Q0 845 300 800" fill="none" stroke="#414c42" strokeWidth="2"/></g>;})}
 <path d={`M700 ${1090+Math.sin(frame*.16)*3}H1080`} stroke="#b1a78c" strokeWidth="8" opacity=".3"/>
 </g></svg>;
export const MovingPapers:React.FC<{progress:number}>=({progress})=>{const p=smooth(progress);return <svg width={1080} height={1920} style={{position:'absolute',inset:0,opacity:Math.sin(Math.PI*p)*.78}}>{Array.from({length:5},(_,j)=><g key={j} transform={`translate(${180+j*145+p*(j%2?180:-200)} ${1170-p*(260+j*75)}) rotate(${p*(j%2?100:-75)+j*11})`}><path d="M-50-30L70-25 60 50-55 43Z" fill="#d8d0ba"/><path d="M-30-10H40M-30 0H35M-30 10H45" stroke="#8b897b" strokeWidth="1"/></g>)}</svg>;};
export const CityLink:React.FC<{progress:number;recognition?:boolean}>=({progress,recognition=false})=>{
 const p=smooth(progress),length=500;
 return <svg width={1080} height={1920} style={{position:'absolute',inset:0,background:'#263b40'}}>
 <defs><radialGradient id="sea"><stop stopColor="#3a555b"/><stop offset="1" stopColor="#152b33"/></radialGradient></defs><rect width={1080} height={1920} fill="url(#sea)"/>
 <g stroke="#91a09a" strokeWidth="1" opacity=".08">{Array.from({length:14},(_,i)=><path key={i} d={`M${i*100} 0V1920M0 ${i*150}H1080`}/>)}</g>
 <g fill="#b7ae8f" stroke="#d3cab0" strokeWidth="2" transform="translate(20 80)">
 <path d="M1060 420L971 495 925 484 885 566 804 598 750 638 681 644 621 696 554 704 499 750 445 736 454 683 510 644 572 632 630 582 710 562 760 501 838 479 881 411 962 390 1012 355Z"/>
 <path d="M564 767L649 748 712 768 740 804 697 844 614 846 564 820 525 821Z"/>
 <path d="M410 765L452 793 448 838 487 869 470 931 434 973 440 1031 402 1086 359 1080 361 1017 328 978 282 955 296 918 254 898 285 860 331 864 355 811Z"/>
 <path d="M274 865L265 838 247 862 254 888Z"/>
 </g>
 <path d="M663 736Q460 790 335 1012" fill="none" stroke="#eed7a2" strokeWidth="4" strokeDasharray={length} strokeDashoffset={length*(1-p)} opacity=".9"/>
 <g fill="#f5e9ce" stroke="#263b40" strokeWidth="5"><circle cx={663} cy={736} r={11}/><circle cx={335} cy={1012} r={11} opacity={recognition?1:p}/></g>
 <g fontFamily="Manrope" fill="#f6f0e4" fontSize="43" fontWeight="600"><text x="585" y="681">Hiroshima</text><text x="140" y="1110">Nagasaki</text></g>
 <g fontFamily="Manrope" fill="#c7d2cb" fontSize="30"><text x="585" y="631">6 AUGUST 1945</text><text x="140" y="1162">9 AUGUST 1945</text></g>
 </svg>;
};
