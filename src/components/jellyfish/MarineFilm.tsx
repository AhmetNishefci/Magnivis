import React from 'react';
import {ease,mix} from './LifeForms';
export {ease,mix};
/** Original species-informed optical illustration. Sixteen adult marginal tentacles,
 * four radial canals, tall clear bell, central orange-brown manubrium; no oral-arm fringe. */
export const FilmMedusa:React.FC<{id:string;frame:number;x:number;y:number;scale:number;regress?:number;opacity?:number;tilt?:number;juvenile?:boolean}>=({id,frame,x,y,scale,regress=0,opacity=1,tilt=0,juvenile=false})=>{
 const r=ease(regress),pulse=Math.sin(frame*.075)*(1-r),rx=(123+pulse*5)*(1-.26*r),top=mix(-175,34,r),base=mix(84,72,r),length=mix(190,8,ease(regress*1.28)),organ=1-ease((regress-.2)/.67),n=juvenile?8:16;
 const outline=`M${-rx} ${base}C${-rx*1.22} ${top+112*(1-r)} ${-rx*.91} ${top-17*(1-r)} 0 ${top}C${rx*.91} ${top-14*(1-r)} ${rx*1.22} ${top+102*(1-r)} ${rx} ${base}Q0 ${base+58*(1-r)+22*r} ${-rx} ${base}Z`;
 const strands=Array.from({length:n},(_,j)=>{const a=j/n*Math.PI*2+.14,depth=(Math.sin(a)+1)/2,sx=Math.cos(a)*rx,sy=base+Math.sin(a)*(26-r*15),l=length*(.8+depth*.26),flow=Math.sin(frame*.025+j*.48)*18*(1-r),c=Math.cos(a);return {j,sx,sy,depth,d:`M${sx} ${sy}C${sx+c*10+flow*.15} ${sy+l*.24} ${sx+c*26-flow*.6} ${sy+l*.62} ${sx+c*20+flow} ${sy+l}`};});
 return <g data-qabounds="critical-visual" aria-label="Turritopsis medusa" opacity={opacity} transform={`translate(${x} ${y+Math.sin(frame*.018)*4*(1-r)}) rotate(${tilt}) scale(${scale})`}>
 <defs>
 <radialGradient id={id+'-glass'} cx="28%" cy="23%" r="85%"><stop stopColor="#f2fff7" stopOpacity=".67"/><stop offset=".19" stopColor="#8bddd6" stopOpacity=".15"/><stop offset=".53" stopColor="#316979" stopOpacity=".1"/><stop offset=".77" stopColor="#9cddd2" stopOpacity=".18"/><stop offset=".94" stopColor="#e2f9d6" stopOpacity=".61"/><stop offset="1" stopColor="#51aab3" stopOpacity=".13"/></radialGradient>
 <linearGradient id={id+'-organ'}><stop stopColor="#4b2527"/><stop offset=".27" stopColor="#a85a43"/><stop offset=".49" stopColor="#fac38e"/><stop offset=".66" stopColor="#ce754c"/><stop offset=".85" stopColor="#7a352e"/><stop offset="1" stopColor="#43252c"/></linearGradient>
 <linearGradient id={id+'-filament'} x1="0" y1="0" x2=".4" y2="1"><stop stopColor="#fff5d6" stopOpacity=".92"/><stop offset=".5" stopColor="#bce9d3" stopOpacity=".66"/><stop offset="1" stopColor="#8cbeb7" stopOpacity=".04"/></linearGradient>
 <clipPath id={id+'-clip'}><path d={outline}/></clipPath>
 </defs>
 {strands.filter(s=>s.depth<.5).map(s=><path key={s.j} d={s.d} fill="none" stroke={`url(#${id}-filament)`} strokeWidth="1.3" opacity={.35+s.depth*.4}/>)}
 <path d={outline} fill={`url(#${id}-glass)`} stroke="#d3f4df" strokeOpacity=".47" strokeWidth="1"/>
 <g clipPath={`url(#${id}-clip)`}>
 <g opacity={organ}>
 {[0,1,2,3].map(j=>{const a=j*Math.PI/2+.3,xx=Math.cos(a)*rx,yy=base+Math.sin(a)*26;return <g key={j}><path d={`M0 ${top+60}Q${xx*.05} ${top+133} ${xx} ${yy}`} stroke="#31575a" strokeOpacity=".5" strokeWidth="4" fill="none"/><path d={`M0 ${top+60}Q${xx*.05} ${top+133} ${xx} ${yy}`} stroke="#d2efcf" strokeOpacity={j<2?.58:.25} strokeWidth="1.3" fill="none"/></g>;})}
 <path d="M-15 -89C-27 -58 -28 -15 -22 20Q-19 48 0 68Q21 46 24 18C28 -16 27 -57 15 -89Q0 -103 -15 -89Z" fill={`url(#${id}-organ)`}/>
 {[0,1,2,3].map(j=><path key={j} d={`M${(j-1.5)*9} -76q${j%2?6:-6} 28 1 73`} stroke={j%2?'#ffe4b1':'#69382c'} opacity=".5" strokeWidth="3" fill="none"/>)}
 <path d="M-4 60Q0 51 5 60L3 76L0 73L-3 76Z" fill="#cda079"/>
 <path d={`M-12 ${top+30}Q-28 ${top+72} -18 -78L17 -78Q25 ${top+72} 9 ${top+30}`} fill="#d8f6e4" fillOpacity=".07" stroke="#d8f6e4" strokeOpacity=".14" strokeWidth="1"/>
 </g>
 {[.22,.36,.57,.73,.88].map((q,j)=><path key={q} d={`M${-rx*q} ${base+7}C${-rx*q*1.16} ${top+85} ${-rx*q*.7} ${top+5+j*3} ${rx*.16} ${top+6}C${rx*q} ${top+16} ${rx*q*1.1} ${top+100} ${rx*q} ${base+8}`} fill="none" stroke="#c5f3df" strokeOpacity={(j%2?.12:.2)*(1-r*.6)} strokeWidth={j===1?3:.7}/>) }
 <path d={`M${-rx*.84} ${base-17}C${-rx*.97} ${top+105} ${-rx*.65} ${top+24} ${-rx*.13} ${top+9}`} stroke="#f6fff0" strokeWidth="5" strokeOpacity=".37" fill="none"/>
 <path d={`M${rx*.89} ${base-13}Q${rx*1.03} ${top+93} ${rx*.54} ${top+35}`} stroke="#c5ffe9" strokeWidth="2" strokeOpacity=".23" fill="none"/>
 <g opacity={r*.65}>{Array.from({length:8},(_,j)=><path key={j} d={`M${-rx+15+j*27} ${base+10}q${12-j} ${-19-r*19} 25 ${-8-j%3*7}`} stroke="#e5c899" strokeWidth="2.5" fill="none" opacity=".5"/>)}</g>
 </g>
 <ellipse cy={base+4} rx={rx*.87} ry={20-r*8} fill="#d3efc4" fillOpacity=".06" stroke="#b7d7be" strokeOpacity=".22" strokeWidth="4"/>
 <ellipse cy={base} rx={rx} ry={26-r*12} fill="none" stroke="#e4efc5" strokeOpacity=".75" strokeWidth="1.3"/>
 {strands.filter(s=>s.depth>=.5).map(s=><g key={s.j}><path d={s.d} fill="none" stroke={`url(#${id}-filament)`} strokeWidth={1.5+s.depth*.45}/><ellipse cx={s.sx} cy={s.sy} rx="3.1" ry="4" fill="#dfd9ac" opacity={1-r*.9}/><circle cx={s.sx} cy={s.sy+1} r="1.3" fill="#a75037" opacity={organ}/></g>)}
 </g>;
};
export const MarineWorld:React.FC<{frame:number;stage:number;phase:number}>=({frame,stage,phase})=>{
 const macro=stage===4||stage===5||stage===6,pan=Math.sin(frame*.004)*45,light=stage===5||stage===8?'#557a69':macro?'#2c6361':'#1d5965';
 return <><defs>
 <radialGradient id="film-water" cx={stage===0?'65%':macro?'43%':'55%'} cy={macro?'48%':'31%'} r="77%"><stop stopColor={light}/><stop offset=".47" stopColor={macro?'#123b3c':'#082d39'}/><stop offset="1" stopColor="#010e19"/></radialGradient>
 <linearGradient id="film-shaft" x1=".8" y1="0" x2=".25" y2="1"><stop stopColor="#c6efd5" stopOpacity=".22"/><stop offset=".6" stopColor="#6bb7b6" stopOpacity=".07"/><stop offset="1" stopColor="#397885" stopOpacity="0"/></linearGradient>
 <radialGradient id="film-volume"><stop stopColor="#b0e7cc" stopOpacity=".2"/><stop offset="1" stopColor="#7ebbb4" stopOpacity="0"/></radialGradient>
 <filter id="film-soft"><feGaussianBlur stdDeviation="29"/></filter>
 </defs><rect width="1080" height="1920" fill="url(#film-water)"/>
 <g filter="url(#film-soft)" transform={`translate(${pan} 0)`} opacity={stage===5?.3:1}><path d="M750 -80L1050 -80L530 1500L-160 1640Z" fill="url(#film-shaft)"/><path d="M1170 -60L1210 -60L630 1400L460 1400Z" fill="url(#film-shaft)" opacity=".45"/></g>
 <ellipse cx={520+pan} cy={macro?1070:820} rx={macro?420:580} ry="520" fill="url(#film-volume)" opacity=".5"/>
 {/* Only sparse slow marine flecks, never the explanatory event. */}
 {Array.from({length:12},(_,j)=><circle key={j} cx={(j*263+Math.sin(frame*.004+j)*12)%1080} cy={(j*173+frame*(.07+j%3*.04))%1500} r={j%3===0?1.4:.65} fill="#e1f1db" opacity={.06+j%3*.025}/>)}
 {macro&&<g opacity=".12" transform={`translate(${phase*-30} 0)`}><path d="M-180 1270Q65 1050 240 1130L350 1420L-180 1540Z" fill="#4b7770"/><path d="M870 1150Q1030 1000 1240 1140L1240 1510L880 1400Z" fill="#315550"/></g>}
 </>;
};
export const FilmSubstrate:React.FC<{frame:number;y?:number;pan?:number}>=({frame,y=1180,pan=0})=><g transform={`translate(${pan} ${y})`}>
 <defs><linearGradient id="film-rock" x1=".15" y1="0" x2=".5" y2="1"><stop stopColor="#759181"/><stop offset=".13" stopColor="#3d6259"/><stop offset=".5" stopColor="#153d3d"/><stop offset="1" stopColor="#05232b"/></linearGradient></defs>
 <path d="M-200 100Q35 -60 235 -7Q410 -64 570 -12Q720 -46 850 6Q1010 15 1250 120L1250 420L-200 420Z" fill="url(#film-rock)"/>
 {Array.from({length:66},(_,j)=>{const xx=j*197%1330-100,yy=j*47%245;return <path key={j} d={`M${xx} ${yy+20}q${14+j%23} ${-7-j%5} ${33+j%34} ${j%6-2}`} stroke={j%3===0?'#071f25':'#acc0a0'} strokeWidth={j%4===0?3:1} opacity={(.04+j%5*.025)*(1-yy/420)+Math.sin(frame*.007)*.003} fill="none"/>;})}
 <path d="M-150 220Q80 95 260 128Q400 80 610 142Q840 50 1210 246L1210 440L-150 440Z" fill="#04202a" opacity=".55"/>
 </g>;
export const FilmCyst:React.FC<{id:string;x:number;y:number;scale:number;opacity?:number}>=({id,x,y,scale,opacity=1})=><g data-qabounds="critical-visual" aria-label="Attached cyst-like tissue" opacity={opacity} transform={`translate(${x} ${y}) scale(${scale})`}>
 <defs><radialGradient id={id} cx="30%" cy="25%" r="78%"><stop stopColor="#e4cca0"/><stop offset=".28" stopColor="#b39972"/><stop offset=".75" stopColor="#686d52"/><stop offset="1" stopColor="#2b4740"/></radialGradient></defs>
 <ellipse cy="14" rx="89" ry="15" fill="#001c25" opacity=".45"/>
 <path d="M-80 5C-85 -19 -61 -36 -37 -32C-20 -55 5 -47 19 -38C49 -51 76 -22 78 -5Q86 15 48 19Q-21 35 -80 5Z" fill={`url(#${id})`} stroke="#c6c3a0" strokeOpacity=".7" strokeWidth="1.1"/>
 <path d="M-65 -12Q-40 -31 -21 -22Q5 -43 30 -27Q53 -30 65 -8M-21 -22Q-2 -11 0 15M30 -27Q19 -9 29 18" fill="none" stroke="#e8d9b1" strokeOpacity=".24" strokeWidth="1.2"/>
 {Array.from({length:37},(_,j)=><ellipse key={j} cx={j*31%135-68} cy={j*23%39-24} rx={1.6+j%4} ry={1+j%3} fill={j%3?'#e5d9ac':'#374d40'} opacity=".13"/>)}
 <path d="M-63 -17Q-45 -30 -31 -26" stroke="#fff0c7" strokeWidth="3" strokeLinecap="round" strokeOpacity=".4" fill="none"/>
 </g>;
const Polyp:React.FC<{id:string;frame:number;x:number;y:number;growth:number;size:number}>=({id,frame,x,y,growth,size})=>{
 const g=ease(growth);return <g transform={`translate(${x} ${y}) scale(${size*g})`}>
 <defs><linearGradient id={id}><stop stopColor="#294f4b"/><stop offset=".35" stopColor="#c0c5a0"/><stop offset=".53" stopColor="#f0dec0"/><stop offset=".7" stopColor="#91a78a"/><stop offset="1" stopColor="#304e49"/></linearGradient></defs>
 <path d="M-5 45Q-14 3 -17 -38Q-17 -76 -7 -91Q0 -101 8 -91Q21 -65 16 -37Q12 1 5 45Z" fill={`url(#${id})`} stroke="#d6d7b8" strokeOpacity=".4" strokeWidth=".9"/>
 <path d="M-3 -80Q-10 -39 -2 22M7 -74Q12 -30 4 31" stroke="#f3e6c6" strokeOpacity=".5" fill="none" strokeWidth="1.2"/>
 {Array.from({length:16},(_,j)=>{const a=j/16*Math.PI*2,xx=Math.cos(a)*12,yy=-79+(j%5)*14,s=Math.cos(a)*(40+j%3*9),w=Math.sin(frame*.02+j)*7;return <path key={j} d={`M${xx} ${yy}C${s*.6} ${yy-13} ${s+w} ${yy-38} ${s+w*1.4} ${yy-55-j%3*5}`} fill="none" stroke="#dce6c3" strokeWidth="1.25" opacity={.36+(Math.sin(a)+1)*.2}/>;})}
 </g>;
};
export const FilmColony:React.FC<{frame:number;growth?:number;bud?:number;x:number;y:number;scale:number;track?:boolean}>=({frame,growth=1,bud=1,x,y,scale,track=true})=>{
 const g=ease(growth),stem=ease(growth*1.7);return <g data-qabounds={track?'critical-visual':undefined} aria-label="Attached polyp colony" transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-46 2Q-1 -3 48 0" stroke="#b9c29f" strokeWidth="7" strokeLinecap="round" fill="none" strokeDasharray="110" strokeDashoffset={110*(1-stem)}/>
 <g opacity={stem}><path d={`M0 0Q-6 ${-100*stem} 0 ${-220*stem}`} stroke="#426a5b" strokeWidth="11" fill="none"/><path d={`M-2 0Q-8 ${-100*stem} -2 ${-220*stem}`} stroke="#b9c4a1" strokeWidth="4" fill="none"/>
 <path d={`M0 ${-90*g}Q${-47*g} ${-134*g} ${-66*g} ${-180*g}M0 ${-147*g}Q${49*g} ${-176*g} ${74*g} ${-224*g}`} stroke="#839c7d" strokeWidth="6" fill="none"/>
 <Polyp id="v2-center" frame={frame} x={0} y={-244*stem} size={1} growth={(growth-.03)*1.6}/><Polyp id="v2-left" frame={frame} x={-66*g} y={-205*g} size={.8} growth={(growth-.24)*1.7}/><Polyp id="v2-right" frame={frame} x={74*g} y={-249*g} size={.85} growth={(growth-.42)*1.9}/>
 </g>
 {bud>0&&<g opacity={ease((growth-.5)*3)}><path d="M3 -176Q39 -167 46 -202" stroke="#98ac8e" strokeWidth="4" fill="none"/><FilmMedusa id="v2-polyp-bud" frame={frame} x={47} y={-220} scale={.12*ease(bud*2)} juvenile tilt={15}/></g>}
 </g>;
};
