import React from 'react';
import {Img,staticFile} from 'remotion';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
/** Geographic relationship only: the line is deliberately not an itinerary. */
export const YamaguchiJourney:React.FC<{progress:number;question?:boolean}>=({progress,question=false})=>{
 const p=clamp(progress);
 return <svg width={1080} height={1920} style={{position:'absolute',inset:0,background:'#21383c'}}>
 <defs><radialGradient id="journey-sea"><stop stopColor="#3b5356"/><stop offset="1" stopColor="#15292e"/></radialGradient></defs><rect width={1080} height={1920} fill="url(#journey-sea)"/>
 <g fill="#aaa68d" stroke="#cec5ab" strokeWidth="2" transform="translate(20 80)">
 <path d="M1060 420L971 495 925 484 885 566 804 598 750 638 681 644 621 696 554 704 499 750 445 736 454 683 510 644 572 632 630 582 710 562 760 501 838 479 881 411 962 390 1012 355Z"/>
 <path d="M564 767L649 748 712 768 740 804 697 844 614 846 564 820 525 821Z"/>
 <path d="M410 765L452 793 448 838 487 869 470 931 434 973 440 1031 402 1086 359 1080 361 1017 328 978 282 955 296 918 254 898 285 860 331 864 355 811Z"/>
 </g>
 {!question&&<path d="M663 736Q450 790 335 1012" fill="none" stroke="#ebd7ab" strokeWidth="4" strokeDasharray="480" strokeDashoffset={480*(1-p)} opacity=".8"/>}
 <g fill="#f6e9cd" stroke="#21383c" strokeWidth="5"><circle cx={663} cy={736} r={12}/><circle cx={335} cy={1012} r={12} opacity={question?1:.3+.7*p}/></g>
 <g fontFamily="Manrope" fill="#f6f0e4" fontSize="42" fontWeight="600"><text data-qabounds="critical" x="500" y="610">Hiroshima</text><text data-qabounds="critical" x="142" y="1130">Nagasaki</text></g>
 <g fontFamily="Manrope" fill="#d2d7ca" fontSize="38" fontWeight="600"><text data-qabounds="critical" x="500" y="680">{question?'Japan · 1945':'Departed 7 August'}</text><text data-qabounds="critical" x="142" y="1197">{question?'Three days apart':'Arrived 8 August'}</text></g>
 {!question&&<circle cx={663*(1-p)*(1-p)+2*450*p*(1-p)+335*p*p} cy={736*(1-p)*(1-p)+2*790*p*(1-p)+1012*p*p} r={7} fill="#fff8dd"/>}
 </svg>;
};
/** Window is static; only exterior layers travel. No claimed landscape/rail route. */
export const YamaguchiRailWindow:React.FC<{frame:number}>=({frame})=><>
 <Img src={staticFile('visuals/yamaguchi-two-bombs-v2/rail-window.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
 <defs><clipPath id="carriage-aperture"><path d="M220 433L1080 257V1225L220 1131Z"/></clipPath><linearGradient id="field-depth" x2="0" y2="1"><stop stopColor="#a6b1ad" stopOpacity="0"/><stop offset=".6" stopColor="#7b8f77" stopOpacity=".23"/><stop offset="1" stopColor="#596747" stopOpacity=".8"/></linearGradient></defs>
 <g clipPath="url(#carriage-aperture)"><rect x={215} y={770} width={900} height={460} fill="url(#field-depth)"/>
 {Array.from({length:6},(_,j)=>{const x=1240-((frame*12+j*301)%1600);return <g key={j} transform={`translate(${x} 0)`} opacity=".3"><path d="M0 1150L-22 1070 2 1088 23 1020 44 1094 60 1063 82 1155Z" fill="#475942"/><path d="M0 1160L-200 1144" stroke="#a3a37d" strokeWidth="5"/></g>;})}
 {Array.from({length:3},(_,j)=>{const x=1400-((frame*16+j*600)%2100);return <path key={j} d={`M${x} 730L${x+12} 1220`} stroke="#454e3c" strokeWidth="13" opacity=".4"/>;})}
 </g></svg>
 </>;
export const ExposureAcknowledgment:React.FC<{qualification:boolean}>=({qualification})=><div style={{position:'absolute',left:140,top:490,width:720,color:'#eee7d5'}}>
 <div style={{fontSize:30,letterSpacing:3,color:'#c5cbbf',marginBottom:46}}>TWO CITIES · ONE LIFE</div>
 {['Hiroshima','Nagasaki'].map((name,i)=><div key={name} style={{borderTop:'1px solid #a6b1a46b',padding:'30px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontSize:46}}>{name}</span><span style={{fontSize:31,color:'#c7d1c5'}}>{i===0?'6 August 1945':'9 August 1945'}</span></div>)}
 <div style={{marginTop:48,fontSize:36,lineHeight:1.4,color:'#ead7b1'}}>{qualification?'Other double survivors\nare documented.':'2009 · exposure in both\ncities acknowledged.'}</div>
 </div>;
