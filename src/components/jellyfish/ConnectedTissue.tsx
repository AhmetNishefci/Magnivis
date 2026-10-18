import React from 'react';
import {ease} from './LifeForms';
type Point={x:number;y:number};
// A deterministic irregular Voronoi mosaic: shared boundaries form one tissue
// patch. It is a qualitative illustration, not lineage tracing or microscopy.
const sites:Point[]=[];let seed=210021;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<600&&sites.length<39;i++){const p={x:random()*1100-550,y:random()*1100-550};if(sites.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>116))sites.push(p);}
const clip=(poly:Point[],a:number,b:number,c:number)=>{const out:Point[]=[];for(let j=0;j<poly.length;j++){const p=poly[j]!,q=poly[(j+1)%poly.length]!,u=a*p.x+b*p.y-c,v=a*q.x+b*q.y-c;if(u<=0)out.push(p);if((u<0&&v>0)||(u>0&&v<0)){const t=u/(u-v);out.push({x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t});}}return out;};
const cells=sites.map((s,i)=>{let poly:Point[]=[{x:-620,y:-620},{x:620,y:-620},{x:620,y:620},{x:-620,y:620}];for(const [j,q] of sites.entries())if(j!==i)poly=clip(poly,q.x-s.x,q.y-s.y,(q.x*q.x+q.y*q.y-s.x*s.x-s.y*s.y)/2);return {s,poly};});
export const ConnectedTissue:React.FC<{frame:number;progress:number;reprise?:boolean}>=({frame,progress,reprise=false})=>{
 const p=ease(progress),drift=Math.sin(frame*.008)*5,turn=reprise?4:-3+p*5;
 const warp=(v:Point)=>({x:v.x+Math.sin(v.y*.007)*27*p*Math.exp(-(((v.x+80)/480)**2)),y:v.y+Math.sin(v.x*.008)*31*p*Math.exp(-(((v.y-70)/490)**2))});
 const path=(poly:Point[])=>{const w=poly.map(warp),m=w.map((a,j)=>{const b=w[(j+1)%w.length]!;return {x:(a.x+b.x)/2,y:(a.y+b.y)/2};});return `M${m.at(-1)!.x} ${m.at(-1)!.y}`+w.map((a,j)=>`Q${a.x} ${a.y} ${m[j]!.x} ${m[j]!.y}`).join('')+'Z';};
 return <g transform={`translate(${510+drift} ${820-p*24}) rotate(${turn}) scale(${.88+p*.05})`}>
 <defs><radialGradient id="tissue-body"><stop stopColor="#b5bc8b"/><stop offset=".5" stopColor="#738c71"/><stop offset="1" stopColor="#193d3a"/></radialGradient><radialGradient id="tissue-nucleus" cx="30%" cy="25%"><stop stopColor="#edd1a2"/><stop offset=".37" stopColor="#b9916d"/><stop offset="1" stopColor="#4b5d50"/></radialGradient><radialGradient id="tissue-edge"><stop offset=".6" stopColor="#062c33" stopOpacity="0"/><stop offset="1" stopColor="#062c33" stopOpacity=".91"/></radialGradient><radialGradient id="tissue-fade"><stop offset=".65" stopColor="white"/><stop offset="1" stopColor="black"/></radialGradient><mask id="tissue-matte"><rect x="-460" y="-460" width="920" height="920" fill="url(#tissue-fade)"/></mask><clipPath id="tissue-patch"><path d="M-360 -170C-312 -420 31 -460 284 -310C455 -199 466 108 291 323C131 474 -241 424 -377 221C-454 88 -420 -42 -360 -170Z"/></clipPath>
 {cells.map(({s},j)=><radialGradient key={j} id={'tissue-cell-'+j} gradientUnits="userSpaceOnUse" cx={s.x-30} cy={s.y-36} r="163"><stop stopColor={j%4?'#b7bd92':'#dcc69a'} stopOpacity=".65"/><stop offset=".58" stopColor={j%2?'#64866f':'#7f9475'} stopOpacity=".48"/><stop offset="1" stopColor="#c1c49b" stopOpacity=".79"/></radialGradient>)}
 </defs>
 <path d="M-360 -150C-300 -400 40 -435 294 -292C470 -160 442 140 282 340C98 468 -234 444 -380 220C-462 70 -420 -40 -360 -150Z" fill="url(#tissue-body)" opacity=".27" transform="translate(24 27)"/>
 <g clipPath="url(#tissue-patch)" mask="url(#tissue-matte)"><rect x="-620" y="-620" width="1240" height="1240" fill="#31554b"/>
 {cells.map(({s,poly},j)=>{const n=warp(s),changed=j%3!==0,k=changed?p:0;return <g key={j}>
 <path d={path(poly)} fill={`url(#tissue-cell-${j})`} stroke="#243f37" strokeWidth="5"/>
 <path d={path(poly)} fill="none" stroke="#e0d9af" strokeWidth="1.3" strokeOpacity=".65"/>
 <g transform={`translate(${n.x-12+k*9} ${n.y+4}) rotate(${j*31+k*31})`}><ellipse rx={23+k*4} ry={31-k*5} fill="url(#tissue-nucleus)" stroke="#c7bf94" strokeWidth="1" strokeOpacity=".35"/><ellipse cx="-6" cy="-9" rx="7" ry="9" fill="#eddbb4" opacity=".3"/><path d="M-11 5Q-2 -4 12 4M-9 -11Q2 -2 10 -9" stroke="#4a634f" strokeWidth="2" opacity=".24" fill="none"/></g>
 {[0,1,2,3,4].map(a=><path key={a} d={`M${n.x+Math.cos(a*2.3+j)*43} ${n.y+Math.sin(a*2.3+j)*48}q9 -7 15 2`} stroke="#c6cda1" strokeWidth="2" opacity=".2" fill="none"/>)}
 </g>;})}
 <ellipse rx="470" ry="480" fill="url(#tissue-edge)"/>
 </g>
 {/* The central domain only is critical; peripheral tissue is intentional context. */}
 <rect data-qabounds="critical-visual" aria-label="Connected illustrative tissue domains" x="-270" y="-280" width="540" height="560" fill="none"/>
 </g>;
};
