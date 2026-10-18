import React from 'react';
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ease=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const body='M-265 -88Q-234 -206 -65 -224Q149 -252 251 -85Q278 -42 304 -27L327 -25L332 29L300 31Q242 135 171 184Q130 207 80 210Q-98 263 -289 122Q-304 87 -290 38Z';
const fin=(x:number,y:number,w:number,h:number,phase:number,count:number)=> <g transform={`translate(${x} ${y}) rotate(${phase})`}><path d={`M0 0Q${w*.5} ${-h*.3} ${w} ${-h}Q${w*1.16} 0 ${w} ${h}Q${w*.3} ${h*.45} 0 0Z`} fill="#403e36" fillOpacity=".46" stroke="#878473" strokeOpacity=".35" strokeWidth="1.4"/>{Array.from({length:count},(_,j)=>{const yy=-h+2*h*j/(count-1);return <path key={j} d={`M0 0Q${w*.55} ${yy*.5} ${w} ${yy}`} fill="none" stroke="#b3a68b" strokeOpacity={.15+(j%3)*.05} strokeWidth="1.1"/>;})}</g>;
/** Species-informed illustration, not a measured specimen reconstruction. The male's nose is the transform origin. */
export const Male:React.FC<{frame:number;id:string;scale?:number;attached?:boolean}>=({frame,id,scale=1,attached=false})=><g transform={`scale(${scale})`}>
 <defs><radialGradient id={id+'skin'} cx=".28" cy=".24" r=".82"><stop stopColor="#8d7960"/><stop offset=".4" stopColor="#4c4b42"/><stop offset="1" stopColor="#101c20"/></radialGradient><radialGradient id={id+'eye'} cx=".34" cy=".23"><stop stopColor="#869d99"/><stop offset=".38" stopColor="#384e50"/><stop offset=".5" stopColor="#091318"/><stop offset="1" stopColor="#03090b"/></radialGradient></defs>
 <g transform={`rotate(${Math.sin(frame*.065)* (attached?1.3:4)} 0 ${attached?0:75})`}>
 {fin(0,98,25,29,85+Math.sin(frame*.11)*8,5)}{fin(0,155,30,21,90+Math.sin(frame*.1)*10,8)}
 <path d="M-4 0Q-35 6 -36 32Q-36 56 -24 68Q-29 103 -11 147L-7 161L8 161L14 142Q30 97 22 61Q34 41 21 16Q12 3 4 0Z" fill={`url(#${id}skin)`} stroke="#9b9c85" strokeWidth=".9" strokeOpacity=".45"/>
 <path d="M-23 64Q-42 56 -50 85Q-25 84 -16 76" fill="#636359" fillOpacity=".5" stroke="#b0a18b" strokeOpacity=".3"/>
 <ellipse cx="-18" cy="29" rx="13" ry="15" fill={`url(#${id}eye)`} stroke="#9eab9d" strokeWidth="1.5"/><ellipse cx="-21" cy="24" rx="3.5" ry="2" fill="#cde0c9" opacity=".6"/>
 <path d="M-20 47Q-6 54 16 47" fill="none" stroke="#171c1b" strokeWidth="2"/>
 <path d="M-5 8L-7 -7L-2 -11L0 1M5 8L8 -6L3 -10L1 1" fill="none" stroke="#d1be99" strokeWidth="2.5" strokeLinecap="round"/>
 <path d="M-22 15Q-9 9 -5 14" fill="none" stroke="#c2b397" strokeOpacity=".3"/>
 <path d="M4 66Q17 104 5 145" fill="none" stroke="#b2a584" strokeOpacity=".19" strokeWidth="4"/>
 </g>
 </g>;
export const Female:React.FC<{frame:number;id:string;male?:boolean;approach?:number;opacity?:number}>=({frame,id,male=false,approach=0,opacity=1})=>{
 const tail=Math.sin(frame*.025)*3;
 return <g opacity={opacity}>
 <defs>
 <radialGradient id={id+'body'} cx=".32" cy=".24" r=".8"><stop stopColor="#7c7461"/><stop offset=".24" stopColor="#514c40"/><stop offset=".61" stopColor="#282e2b"/><stop offset="1" stopColor="#080f14"/></radialGradient>
 <radialGradient id={id+'cheek'} cx=".25" cy=".2" r=".8"><stop stopColor="#a29477" stopOpacity=".4"/><stop offset=".62" stopColor="#78745e" stopOpacity=".07"/><stop offset="1" stopColor="#04090d" stopOpacity=".4"/></radialGradient>
 <linearGradient id={id+'teeth'}><stop stopColor="#a39477"/><stop offset=".6" stopColor="#dfd1ae"/><stop offset="1" stopColor="#776c57"/></linearGradient>
 <radialGradient id={id+'lure'}><stop stopColor="#e0f5d9"/><stop offset=".28" stopColor="#a8dec1"/><stop offset=".65" stopColor="#5d9e8c" stopOpacity=".2"/><stop offset="1" stopColor="#65bfa8" stopOpacity="0"/></radialGradient>
 <clipPath id={id+'clip'}><path d={body}/></clipPath>
 </defs>
 {fin(311,3,111,77,tail,8)}{fin(198,-116,76,58,-68+tail,5)}{fin(179,165,66,48,62-tail,5)}
 <path d={body} fill={`url(#${id}body)`} stroke="#8c9e90" strokeOpacity=".38" strokeWidth="1.6"/>
 <g clipPath={`url(#${id}clip)`}>
 <ellipse cx="-104" cy="-5" rx="182" ry="207" fill={`url(#${id}cheek)`}/>
 {Array.from({length:210},(_,j)=>{const x=-300+(j*97.317)%610,y=-240+(j*67.319)%480,w=3+(j%5)*1.9;return <ellipse key={j} cx={x} cy={y} rx={w} ry={w*.48} transform={`rotate(${j*31} ${x} ${y})`} fill={j%3?'#a89874':'#0c1212'} opacity={.025+(j%7)*.012}/>;})}
 {Array.from({length:106},(_,j)=>{const x=-275+(j*91.71)%572,y=-214+(j*73.27)%425;return <path key={j} d={`M${x-2} ${y+3}L${x+1} ${y-3-j%3}L${x+3} ${y+3}`} fill="#a6a386" fillOpacity={.1+(j%4)*.035} stroke="#111b1b" strokeWidth=".6"/>;})}
 <path d="M-235 -119Q-113 -213 65 -198Q198 -181 244 -79" fill="none" stroke="#b5ae91" strokeWidth="4" strokeOpacity=".1"/>
 <path d="M-110 133Q45 214 192 149" fill="none" stroke="#050d12" strokeWidth="12" opacity=".35"/>
 </g>
 <path d="M-265 -88Q-262 -10 -289 122Q-230 112 -111 81Q-170 33 -207 -36Z" fill="#03090c" stroke="#797b65" strokeOpacity=".5" strokeWidth="2.2"/>
 <path d="M-288 125Q-211 157 -107 84" fill="none" stroke="#8d7f64" strokeWidth="8"/>
 {Array.from({length:13},(_,j)=>{const t=j/12,x=mix(-259,-132,t),y=mix(-64,65,t),length=23+Math.sin(j*2.2)*8;return <path key={j} d={`M${x} ${y}Q${x-8} ${y+length*.5} ${x-11} ${y+length}L${x+6} ${y+9}Z`} fill={`url(#${id}teeth)`}/>;})}
 {Array.from({length:12},(_,j)=>{const t=j/11,x=mix(-276,-128,t),y=125-34*t,length=20+Math.sin(j*1.8)*9;return <path key={j} d={`M${x} ${y}Q${x+4} ${y-length*.5} ${x+16} ${y-length}L${x+8} ${y+1}Z`} fill={`url(#${id}teeth)`}/>;})}
 <ellipse cx="-179" cy="-125" rx="10" ry="11" fill="#050b0e" stroke="#b2aa8b" strokeOpacity=".5" strokeWidth="2"/><ellipse cx="-181" cy="-128" rx="2.8" ry="1.8" fill="#bcd5c5" opacity=".8"/>
 <path d="M80 36Q94 72 80 109" fill="none" stroke="#0b1719" strokeWidth="5"/>
 <g transform={`translate(90 58) rotate(${Math.sin(frame*.045)*7})`}>{fin(0,0,74,34,17,15)}</g>
 {/* Adult Cryptopsaras: short illicium, small esca; three separate dorsal caruncles. */}
 <path d="M-142 -205Q-151 -235 -161 -248" fill="none" stroke="#667064" strokeWidth="6"/>
 <circle cx="-162" cy="-252" r="37" fill={`url(#${id}lure)`} opacity={.65+Math.sin(frame*.014)*.07}/><ellipse cx="-162" cy="-252" rx="9" ry="10" fill="#a9cfac"/>
 {[25,70,112].map((x,j)=><g key={x} transform={`translate(${x} ${-223+j*8}) rotate(${j*8-8})`}><path d="M-5 13L-6 -3Q-13 -18 0 -21Q14 -20 8 -5L6 13" fill="#5b5e4e" stroke="#9a9e7d" strokeOpacity=".45" strokeWidth="1.2"/></g>)}
 {male&&<><path data-qabounds="critical-visual" aria-label="Jaw-to-skin attachment site" d="M72 210Q74 222 80 224Q87 223 88 209" fill="#68604c" stroke="#999174" strokeOpacity=".4" strokeWidth="1"/><g transform={`translate(80 ${224+approach}) rotate(${-8+Math.sin(frame*.018)*1.3})`}><Male id={id+'male'} frame={frame} scale={.43} attached={approach===0}/></g></>}
 </g>;
};
/** A qualitative section through the same jaw-skin seam, not a histological reconstruction. */
export const FusionSection:React.FC<{frame:number;tissue:number;vessels:number;zoom?:number}>=({frame,tissue,vessels,zoom=1})=>{
 const join=ease(tissue),blood=ease(vessels),gap=32*(1-join);
 const top='M-480 -280Q-200 -330 80 -265Q260 -220 480 -275L480 -28Q210 -4 0 -7Q-220 -12 -480 0Z';
 const lower=`M-135 ${18+gap}Q-105 ${5+gap} 0 ${5+gap}Q105 ${5+gap} 135 ${18+gap}L180 248Q0 330 -180 248Z`;
 return <g transform={`translate(490 820) scale(${zoom})`}>
 <defs><linearGradient id="fusion-female" x2="0" y2="1"><stop stopColor="#142c30"/><stop offset=".7" stopColor="#7f5f4c"/><stop offset="1" stopColor="#b29672"/></linearGradient><linearGradient id="fusion-male" x2="0" y2="1"><stop stopColor="#bea27b"/><stop offset=".5" stopColor="#7c5e48"/><stop offset="1" stopColor="#192c2e"/></linearGradient><clipPath id="female-tissue"><path d={top}/></clipPath><clipPath id="male-tissue"><path d={lower}/></clipPath><radialGradient id="seamlight"><stop stopColor="#ddb885" stopOpacity=".16"/><stop offset="1" stopColor="#ddb885" stopOpacity="0"/></radialGradient></defs>
 <path d={top} fill="url(#fusion-female)" stroke="#b2a186" strokeWidth="2" strokeOpacity=".5"/><path d={lower} fill="url(#fusion-male)" stroke="#b2a186" strokeWidth="2" strokeOpacity=".6"/>
 <g opacity={join}><path data-qabounds="critical-visual" aria-label="Joined tissue at the persistent attachment seam" d="M-130 -16Q-110 15 -129 49Q0 76 129 49Q110 15 130 -16Z" fill="#ac8764"/><ellipse cx="0" cy="12" rx="230" ry="120" fill="url(#seamlight)"/></g>
 {['female-tissue','male-tissue'].map((clip,k)=><g key={clip} clipPath={`url(#${clip})`}>{Array.from({length:38},(_,j)=>{const x=-490+(j*137.3)%980,y=k?-30+(j*71.9)%360:-300+(j*43.19)%290,r=16+j%5*4;return <g key={j}><path d={`M${x-r} ${y}Q${x-r*.6} ${y-r} ${x+r*.3} ${y-r*.7}Q${x+r} ${y} ${x+r*.5} ${y+r*.8}Q${x-r*.6} ${y+r} ${x-r} ${y}Z`} fill={j%3?'#c19b72':'#5e4c3f'} fillOpacity=".12" stroke="#d2b78c" strokeOpacity=".13" strokeWidth="1.4"/><ellipse cx={x+2} cy={y+1} rx={r*.2} ry={r*.28} fill="#51483b" opacity=".32"/></g>;})}</g>)}
 <g opacity={blood}>
 {['M-460 -181C-245 -190 -159 -146 -79 -112C-39 -91 -45 -36 -26 1C-7 46 -50 90 -63 151C-77 215 -41 242 -29 264','M448 -160C252 -144 126 -132 66 -79C24 -43 38 -9 34 19C27 70 94 109 95 166C96 209 61 252 54 277'].map((d,i)=><g key={d}><path d={d} fill="none" stroke="#332d28" strokeWidth="23"/><path d={d} fill="none" stroke={i?'#8e7166':'#a96651'} strokeWidth="15"/><path d={d} fill="none" stroke={i?'#c0a08b':'#e2ad80'} strokeWidth="3" strokeOpacity=".5"/><path d={d} fill="none" stroke="#f6d9aa" strokeWidth="4" strokeOpacity=".55" strokeDasharray="3 45" strokeDashoffset={-frame*(i?-1.4:1.9)}/></g>)}
 </g>
 <path d={`M-139 ${12+gap}Q-127 -5 -116 -10M139 ${12+gap}Q127 -5 116 -10`} fill="none" stroke="#d9c39a" strokeWidth="7" strokeLinecap="round" opacity={1-join*.7}/>
 </g>;
};
