import React from 'react';
import {ease} from './Anatomy';
/** Curved explanatory section at the projected external jaw anchor. Vessel topology,
 * tissue layers and growth duration are qualitative, not species histology. */
export const AttachedSection:React.FC<{frame:number;join:number;vascular:number;opacity:number}>=({frame,join,vascular,opacity})=>{
 const t=ease(join),gap=(1-t)*23,v=ease(vascular),upper='M-350 -137C-220 -230 56 -204 293 -117L327 -40C165 -71 -143 -72 -330 -10Z',male=`M-61 ${20+gap}Q-27 ${9+gap} 31 ${13+gap}Q70 ${22+gap} 72 ${48+gap}C108 109 78 218 24 252C-31 235 -72 156 -75 96Z`,bridge=`M-62 -55Q-38 ${-46+t*51} -59 ${28+gap}Q0 ${57+gap} 60 ${27+gap}Q45 ${-42+t*33} 64 -57Z`;
 const paths=['M-286 -112C-170 -143 -68 -121 -31 -75C-12 -54 -16 -14 -12 9C-6 58 -41 115 -21 189','M273 -91C172 -108 78 -106 28 -63C13 -44 20 -3 17 19C15 71 57 135 20 212'];
 return <g opacity={opacity}>
 <defs><linearGradient id="section-volume" x1=".1" y1="0" x2=".8" y2="1"><stop stopColor="#9a9a79"/><stop offset=".35" stopColor="#6e7058"/><stop offset=".58" stopColor="#ad9874"/><stop offset="1" stopColor="#263d3b"/></linearGradient><linearGradient id="male-volume" x1="0" y1="0" x2="1" y2=".6"><stop stopColor="#444d3f"/><stop offset=".47" stopColor="#c0a476"/><stop offset=".7" stopColor="#8b795a"/><stop offset="1" stopColor="#283f3b"/></linearGradient><clipPath id="section-clipping"><path d={upper}/><path d={male}/><path d={bridge} opacity={t}/></clipPath></defs>
 {/* Shallow side faces retain depth rather than a floating flat rectangular slab. */}
 <path d="M-330 -10Q-25 -81 327 -40L312 -12Q-32 -48 -308 17Z" fill="#253b36"/>
 <path d={upper} fill="url(#section-volume)" stroke="#b5b796" strokeWidth="1.5" strokeOpacity=".6"/>
 <path d={male} fill="url(#male-volume)" stroke="#b8a47b" strokeOpacity=".65" strokeWidth="1.3"/>
 <g opacity={t}><path data-qabounds="critical-visual" aria-label="Tissue bridge at the actual jaw anchor" d={bridge} fill="url(#male-volume)"/></g>
 <g clipPath="url(#section-clipping)">
 {Array.from({length:35},(_,j)=>{const x=-340+j*137%680,y=-182+j*83%430;return <path key={j} d={`M${x-11} ${y}q4 -13 19 -10q15 9 4 22q-16 9 -23 -12Z`} fill="#d6c297" fillOpacity=".08" stroke="#d3bd8b" strokeOpacity=".13" strokeWidth="1.1"/>;})}
 {[-.8,-.3,.3,.7].map((q,j)=><path key={j} d={`M-355 ${-90+q*20}Q-12 ${-188+q*20} 330 ${-53+q*10}`} stroke={j%2?'#c7b68b':'#394b3b'} strokeOpacity=".22" strokeWidth="3" fill="none"/>)}
 <g opacity={v}>{paths.map((d,i)=><g key={i}><path d={d} pathLength={1} strokeDasharray={`${v} 2`} fill="none" stroke="#293631" strokeWidth="16"/><path d={d} pathLength={1} strokeDasharray={`${v} 2`} fill="none" stroke={i?'#8e8d79':'#ad795c'} strokeWidth="10"/><path d={d} pathLength={1} strokeDasharray={`${v} 2`} fill="none" stroke="#e2bf8f" strokeOpacity=".55" strokeWidth="1.7"/>{v>.9&&<path d={d} fill="none" stroke="#f0cc9f" strokeWidth="3" strokeDasharray="2 67" strokeDashoffset={frame*(i?1.6:-1.8)} opacity=".6"/>}</g>)}</g>
 </g>
 <path d={`M-54 ${25+gap}l-8 -32l14 3M54 ${25+gap}l8 -32l-14 3`} stroke="#c9bd94" opacity={1-t*.7} strokeWidth="3.5" fill="none"/>
 </g>;
};
/** A static inherited-information metaphor. Missing segments exist on entry and are
 * never switched off by attachment. No literal sequence or specific gene mapping. */
export const InheritedInformation:React.FC<{frame:number;progress:number}>=({frame,progress})=> <g transform={`translate(470 760) rotate(${-12+progress*9})`}>
 <defs><linearGradient id="inherited-ribbon"><stop stopColor="#345e61"/><stop offset=".45" stopColor="#d9bd8d"/><stop offset=".6" stopColor="#ead8b3"/><stop offset="1" stopColor="#395657"/></linearGradient></defs>
 {[0,1,2].map(k=><g key={k} transform={`translate(${(k-1)*205} ${(k-1)*64}) scale(${1-k*.1})`} opacity={1-k*.17}>
 {[0,1].map(side=><path key={side} d={Array.from({length:50},(_,j)=>{const y=j*10-230,x=Math.sin(j*.13+side*Math.PI)*49;return `${j?'L':'M'}${x} ${y}`;}).join(' ')} fill="none" stroke="url(#inherited-ribbon)" strokeWidth="10"/>)}
 {Array.from({length:15},(_,j)=>{const y=j*30-210,x=Math.sin((y+230)/10*.13)*49,missing=[3,4,9,12].includes(j);return <path key={j} d={`M${x} ${y}L${-x} ${y}`} stroke={missing?'#6c8580':'#b5b79c'} strokeDasharray={missing?'3 10':undefined} strokeOpacity={missing?.25:.8} strokeWidth={missing?2:7}/>;})}
 </g>)}
 <path d={`M-365 326Q0 ${337+Math.sin(frame*.015)*2} 348 326`} fill="none" stroke="#a1ad8d" strokeOpacity=".3" strokeWidth="1"/>
 </g>;
