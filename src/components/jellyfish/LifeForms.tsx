import React from 'react';
export const ease=(v:number)=>{const x=Math.max(0,Math.min(1,v));return x*x*(3-2*x);};
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const palette={water:'#021b26',ice:'#d8f4ef',warm:'#e9aa87',rust:'#a94f3d',caption:'#f5f3e9'};
/** Species-informed anatomical illustration, not photographed anatomy or a fluid simulation. */
export const Medusa:React.FC<{id:string;frame:number;x?:number;y?:number;scale?:number;retract?:number;opacity?:number;tentacles?:number;tilt?:number}>=({id,frame,x=490,y=720,scale=1,retract=0,opacity=1,tentacles=16,tilt=0})=>{
 const p=Math.sin(frame*.068),r=ease(retract),rx=(130+p*4)*(1-r*.46),top=-172+r*130,base=92-r*35,swim=Math.sin(frame*.033)*6*(1-r),length=250*(1-r)+12;
 const bell=`M${-rx} ${base} C${-rx*1.18} ${top+90} ${-rx*.82} ${top-10} 0 ${top} C${rx*.84} ${top-13} ${rx*1.17} ${top+90} ${rx} ${base} C${rx*.61} ${base+51} ${-rx*.61} ${base+51} ${-rx} ${base}Z`;
 const strands=Array.from({length:tentacles},(_,j)=>{const a=j/tentacles*Math.PI*2,c=Math.cos(a),s=Math.sin(a),sx=c*rx,sy=base+s*25,flow=Math.sin(frame*.032+j*.63)*28*(1-r),depth=(s+1)/2;return {j,sx,sy,c,depth,d:`M${sx} ${sy} C${sx+flow} ${sy+length*.3} ${sx+c*45-flow} ${sy+length*.64} ${sx+c*32+flow*.5} ${sy+length*(.8+depth*.28)}`};});
 return <g data-qabounds="critical-visual" aria-label="Species-informed medusa" transform={`translate(${x} ${y+swim}) rotate(${tilt}) scale(${scale})`} opacity={opacity}>
 <defs>
 <radialGradient id={id+'-bell'} cx="31%" cy="20%" r="84%"><stop offset="0" stopColor="#e7fff8" stopOpacity=".47"/><stop offset=".35" stopColor="#71c3c6" stopOpacity=".12"/><stop offset=".72" stopColor="#2c687a" stopOpacity=".17"/><stop offset=".92" stopColor="#d3fff3" stopOpacity=".42"/><stop offset="1" stopColor="#99e5e3" stopOpacity=".2"/></radialGradient>
 <linearGradient id={id+'-organ'} x1="0" x2="1"><stop stopColor="#612f2a"/><stop offset=".4" stopColor="#eaa57a"/><stop offset=".7" stopColor="#a94836"/><stop offset="1" stopColor="#4e2727"/></linearGradient>
 <linearGradient id={id+'-thread'} x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#e9fff9" stopOpacity=".9"/><stop offset=".5" stopColor="#8ccec8" stopOpacity=".7"/><stop offset="1" stopColor="#acd4cc" stopOpacity=".07"/></linearGradient>
 </defs>
 <g opacity={1-r*.9}>{strands.filter(s=>s.depth<.5).map(s=><path key={s.j} d={s.d} fill="none" stroke={`url(#${id}-thread)`} strokeWidth={1.25+s.depth} opacity={.33+s.depth*.4}/>)}</g>
 <path d={bell} fill={`url(#${id}-bell)`} stroke="#b6ebe3" strokeOpacity=".46" strokeWidth="1.6"/>
 <path d={`M${-rx*.82} ${base-18} C${-rx*.84} ${top+100} ${-rx*.62} ${top+19} ${-rx*.17} ${top+11}`} fill="none" stroke="#effffb" strokeWidth="5" strokeOpacity=".36"/>
 <g opacity={1-r}>{[0,1,2,3].map(j=>{const a=j*Math.PI/2+.6,xx=Math.cos(a)*rx,yy=base+Math.sin(a)*28;return <path key={j} d={`M0 ${top+65} Q${xx*.2} ${top+115} ${xx} ${yy}`} fill="none" stroke="#c4e6d4" strokeOpacity={j<2?.48:.22} strokeWidth="2.1"/>;})}
 <path d="M-15 -74Q-30 -33 -28 9Q-21 42 -10 65L0 72L10 65Q25 35 27 9Q27 -37 15 -74Q0 -89 -15 -74Z" fill={`url(#${id}-organ)`} opacity=".92"/>
 <path d="M-9 67Q0 58 9 67L3 80L0 75L-4 80Z" fill="#c77d66"/>
 {[0,1,2,3].map(j=><ellipse key={j} cx={(j-1.5)*13} cy={-48+Math.abs(1.5-j)*9} rx="8" ry="28" fill={`url(#${id}-organ)`} opacity=".6"/>)}
 <path d="M0 -120L-24 -66L24 -66Z" fill="#ddf7dd" fillOpacity=".1" stroke="#caf4df" strokeOpacity=".2"/>
 </g>
 <ellipse cx="0" cy={base} rx={rx} ry={28-r*14} fill="none" stroke="#c5f3e9" strokeOpacity=".65" strokeWidth="2"/>
 <ellipse cx="0" cy={base+3} rx={rx*.84} ry={21-r*11} fill="#8ec8bd" fillOpacity=".06" stroke="#d2f4e4" strokeOpacity=".25" strokeWidth="2.5"/>
 <g opacity={1-r*.95}>{strands.filter(s=>s.depth>=.5).map(s=><g key={s.j}><path d={s.d} fill="none" stroke={`url(#${id}-thread)`} strokeWidth={1.5+s.depth*.9} opacity={.55+s.depth*.35}/><ellipse cx={s.sx} cy={s.sy} rx="3.8" ry="4.8" fill="#d3d9b4" opacity=".7"/><circle cx={s.sx} cy={s.sy+1} r="1.8" fill="#a94d35"/>
 {[.13,.27,.44,.61].map((q,k)=><circle key={k} cx={s.sx+s.c*32*q+Math.sin(frame*.032+s.j*.63)*20*q} cy={s.sy+length*q} r="1.6" fill="#e1edda" opacity=".3"/>)}</g>)}</g>
 </g>;
};
export const Substrate:React.FC<{frame:number;y?:number}>=({frame,y=1230})=><g transform={`translate(0 ${y})`}>
 <defs><linearGradient id="rock" x1=".2" y1="0" x2=".5" y2="1"><stop stopColor="#4d716c"/><stop offset=".4" stopColor="#243f40"/><stop offset="1" stopColor="#09232e"/></linearGradient></defs>
 <path d="M-60 62Q125 -35 235 7Q320 -42 438 -3Q527 -29 647 18Q788 -12 1120 98L1120 380L-60 380Z" fill="url(#rock)"/>
 {Array.from({length:38},(_,j)=>{const x=(j*193%1130)-20,yy=j*71%147;return <path key={j} d={`M${x} ${yy+14}q${20+j%18} ${-4-j%5} ${39+j%20} ${1+j%6}`} stroke={j%3?'#719486':'#0b2d34'} opacity={.05+(j%4)*.035+Math.sin(frame*.01)*.008} strokeWidth={1+j%2} fill="none"/>;})}
 </g>;
export const Cyst:React.FC<{id:string;x?:number;y?:number;scale?:number;growth?:number;opacity?:number}>=({id,x=490,y=1205,scale=1,growth=0,opacity=1})=><g data-qabounds="critical-visual" aria-label="Cyst and stolon" transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
 <defs><radialGradient id={id} cx=".35" cy=".3" r=".8"><stop stopColor="#d8bc8d"/><stop offset=".5" stopColor="#987e64"/><stop offset="1" stopColor="#3a4d49"/></radialGradient></defs>
 <ellipse cy="15" rx="88" ry="20" fill="#00161d" opacity=".45"/>
 <path d={`M-74 6C-79 -20 -52 -42 -29 -38C-12 -60 34 -48 43 -32C75 -35 91 -5 70 12Q0 37 -74 6Z`} fill={`url(#${id})`} stroke="#b6b695" strokeOpacity=".7" strokeWidth="2"/>
 {Array.from({length:19},(_,j)=><ellipse key={j} cx={j*37%121-60} cy={-25+j*11%36} rx={3+j%4} ry={2+j%3} fill="#e1caa0" opacity=".1"/>)}
 <path d="M-54 -16Q-13 -43 32 -25" stroke="#f2dec0" opacity=".4" strokeWidth="3" fill="none"/>
 {growth>0&&<path d={`M52 9Q${70+growth*70} ${12-growth*4} ${60+growth*240} 7`} fill="none" stroke="#a2b99c" strokeWidth="10" strokeLinecap="round"/>}
 </g>;
const Hydranth:React.FC<{id:string;frame:number;x:number;y:number;size?:number;growth?:number}>=({id,frame,x,y,size=1,growth=1})=>{
 const g=ease(growth);return <g transform={`translate(${x} ${y}) scale(${size*g})`}>
 <defs><linearGradient id={id+'-stem'}><stop stopColor="#466d67"/><stop offset=".45" stopColor="#dccbb0"/><stop offset=".66" stopColor="#8a9f89"/><stop offset="1" stopColor="#304b4b"/></linearGradient></defs>
 <path d="M-6 65Q-13 21 -21 -23Q-27 -64 -10 -103Q0 -118 10 -103Q27 -64 20 -23Q13 21 6 65Z" fill={`url(#${id}-stem)`} stroke="#b5c3a2" strokeOpacity=".45" strokeWidth="1.2"/>
 <path d="M-7 -105Q0 -128 7 -105" fill="#d2b28e"/>
 {Array.from({length:14},(_,j)=>{const a=j/14*Math.PI*2,xx=Math.cos(a)*15,yy=-92+(j%5)*17,spread=Math.cos(a)*(58+j%3*12),wave=Math.sin(frame*.025+j)*9;return <path key={j} d={`M${xx} ${yy} Q${spread*.6} ${yy-25} ${spread+wave} ${yy-65-j%4*9}`} stroke="#c2d7b5" opacity={.45+(Math.sin(a)+1)*.2} strokeWidth="1.7" fill="none"/>;})}
 </g>;
};
/** Buds arise below hydranths; colony branches remain rooted in the stolonal mat. */
export const Colony:React.FC<{frame:number;growth?:number;bud?:number;x?:number;y?:number;scale?:number}>=({frame,growth=1,bud=1,x=490,y=1205,scale=1})=>{
 const g=ease(growth);return <g data-qabounds="critical-visual" aria-label="Attached hydroid colony" transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-115 4Q-26 -7 110 0" stroke="#8ea58b" strokeWidth="9" strokeLinecap="round" fill="none" strokeDasharray="300" strokeDashoffset={300*(1-ease(growth*3))}/>
 <g opacity={ease(growth*5)}><path d={`M0 0Q${-10*g} ${-100*g} 0 ${-220*g}`} fill="none" stroke="#8c9c80" strokeWidth="13"/><path d={`M-3 ${-90*g}Q${-62*g} ${-152*g} ${-90*g} ${-184*g}M0 ${-133*g}Q${60*g} ${-183*g} ${90*g} ${-226*g}`} stroke="#8c9c80" strokeWidth="8" fill="none"/>
 <Hydranth frame={frame} x={0} y={-260*g} id="central" growth={growth*1.4}/><Hydranth frame={frame} x={-90*g} y={-215*g} size={.77} id="left" growth={(growth-.25)*1.6}/><Hydranth frame={frame} x={90*g} y={-263*g} size={.8} id="right" growth={(growth-.45)*1.9}/>
 </g>
 {bud>0&&<g opacity={ease((growth-.5)*3)}><path d="M7 -186Q42 -183 42 -204" stroke="#8b9f83" strokeWidth="5" fill="none"/><Medusa id="polyp-bud" frame={frame} x={43} y={-224} scale={.13*ease(bud*2)} tentacles={8} tilt={18}/></g>}
 </g>;
};
export const CellField:React.FC<{frame:number;progress:number}>=({frame,progress})=>{
 const p=ease(progress);return <g>
 <defs><radialGradient id="cell-membrane" cx=".3" cy=".3"><stop stopColor="#c1d6b2" stopOpacity=".6"/><stop offset=".65" stopColor="#678c85" stopOpacity=".3"/><stop offset="1" stopColor="#c3d7ae" stopOpacity=".7"/></radialGradient><radialGradient id="nucleus"><stop stopColor="#efd0a2"/><stop offset=".4" stopColor="#bd8767"/><stop offset="1" stopColor="#5b4d4f"/></radialGradient></defs>
 {Array.from({length:13},(_,j)=>{const xx=185+(j%4)*206+(Math.floor(j/4)%2)*43,yy=460+Math.floor(j/4)*212,changed=j%3!==0,k=changed?p:0,rx=mix(80,54,k),ry=mix(43,81,k),turn=mix(j%2?27:-21,j%2?-7:7,k),wave=Math.sin(frame*.025+j)*4;return <g key={j} data-qabounds={j===5?"critical-visual":undefined} aria-label="Illustrative cell" transform={`translate(${xx+wave} ${yy}) rotate(${turn})`} opacity={j>10?.5:1}>
 <ellipse rx={rx+5} ry={ry+5} fill="#c9e7c3" fillOpacity=".06"/>
 <path d={`M${-rx} 0C${-rx-8} ${-ry*.7} ${-rx*.2} ${-ry-9} ${rx*.4} ${-ry}C${rx+10} ${-ry*.8} ${rx+12} ${ry*.4} ${rx*.65} ${ry*.85}C${rx*.1} ${ry+12} ${-rx-4} ${ry*.8} ${-rx} 0Z`} fill="url(#cell-membrane)" stroke="#b7d5b6" strokeWidth="2"/>
 <ellipse cx={-9+k*13} cy={-4} rx={18+k*4} ry="22" fill="url(#nucleus)"/><circle cx={-12+k*9} cy="-9" r="5" fill="#f0d5a9" opacity=".4"/>
 {Array.from({length:9},(_,n)=><ellipse key={n} cx={Math.cos(n*2.4+j)*rx*.65} cy={Math.sin(n*2.4+j)*ry*.65} rx="4" ry="2" transform={`rotate(${n*30})`} fill="#d9dfba" opacity=".22"/>)}
 </g>;})}
 </g>;
};
