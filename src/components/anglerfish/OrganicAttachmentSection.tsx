import React from 'react';
import {ease} from './Anatomy';
/** Qualitative local skin/jaw window. Does not stand in for the whole male, map
 * organs or assert measured histology. External body and tail remain in context. */
export const OrganicAttachmentSection:React.FC<{frame:number;join:number;vascular:number;opacity:number}>=({frame,join,vascular,opacity})=>{
 const t=ease(join),v=ease(vascular),gap=(1-t)*9;
 const female='M-245 -69Q-130 -122 38 -88Q174 -62 247 -26L248 17Q117 34 1 0Q-117 -32 -245 -10Z';
 const head=`M-24 ${12+gap}Q0 ${2+gap} 26 ${13+gap}Q35 39 21 70Q0 92 -20 70Q-34 40 -24 ${12+gap}Z`;
 const bridge=`M-14 -13Q-10 0 -15 ${15+gap}Q0 ${24+gap} 15 ${15+gap}Q13 1 17 -9Z`;
 const routes=['M-218 -45Q-120 -74 -30 -33Q-4 -21 -6 8Q-8 39 -9 71','M220 -5Q129 -24 32 -18Q7 -16 7 8Q11 44 7 78'];
 return <g opacity={opacity}>
 <defs><linearGradient id="organic-cut-female" x1="0" y1="0" x2=".4" y2="1"><stop stopColor="#6f5546"/><stop offset=".45" stopColor="#ad927b"/><stop offset=".9" stopColor="#4d3931"/><stop offset="1" stopColor="#271f1c"/></linearGradient><linearGradient id="organic-cut-head" x1="0" y1="0" x2="1" y2=".6"><stop stopColor="#52392d"/><stop offset=".45" stopColor="#c0a281"/><stop offset="1" stopColor="#49372e"/></linearGradient><clipPath id="organic-cut-window"><path d={female}/><path d={head}/><path d={bridge}/></clipPath></defs>
 <path d={female} fill="url(#organic-cut-female)" stroke="#beab93" strokeOpacity=".55" strokeWidth="1"/>
 <path d="M-245 -10Q-117 -32 1 0Q117 34 248 17" fill="none" stroke="#211915" strokeWidth="5"/>
 <path d={head} fill="url(#organic-cut-head)" stroke="#b29b7e" strokeOpacity=".65" strokeWidth="1"/>
 <path data-qabounds="critical-visual" aria-label="Local tissue bridge at male jaw contact" d={bridge} fill="url(#organic-cut-head)" opacity={t}/>
 <g clipPath="url(#organic-cut-window)">
 {[-.7,0,.7].map((n,j)=><path key={j} d={`M-252 ${-43+n*11}Q-109 ${-90+n*11} 30 ${-54+n*11}Q145 ${-17+n*7} 252 ${-10+n*5}`} fill="none" stroke={j%2?'#d2b99b':'#392b25'} strokeWidth="2" strokeOpacity=".25"/>)}
 {Array.from({length:24},(_,j)=><ellipse key={j} cx={-225+j*71%470} cy={-76+j*37%156} rx={4+j%3} ry={3+j%2} fill="#e0c6a2" opacity=".09"/>)}
 <g opacity={v}>{routes.map((d,j)=><g key={j}><path d={d} pathLength={1} strokeDasharray={`${v} 2`} fill="none" stroke="#2a2825" strokeWidth="10"/><path d={d} pathLength={1} strokeDasharray={`${v} 2`} fill="none" stroke={j?'#8b9e9c':'#b36c55'} strokeWidth="6"/><path d={d} fill="none" stroke="#ddc0a1" strokeOpacity=".6" strokeWidth="1.3" strokeDasharray="1 40" strokeDashoffset={frame*(j?1.1:-1.2)}/></g>)}</g>
 </g>
 </g>;
};
