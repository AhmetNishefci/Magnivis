import React from 'react';

export const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
export const palette={ivory:'#fff5e8',teal:'#91e0cd',amber:'#e5a56c',ink:'#172d30'};
const critical={'data-qabounds':'critical-visual'};

/** Original studio illustration. Skin folds and hand motion are qualitative, not anatomical measurements. */
export const Materials:React.FC=()=> <defs>
 <linearGradient id="film-skin" x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#f9d4b2"/><stop offset=".32" stopColor="#dba187"/><stop offset=".68" stopColor="#a76959"/><stop offset="1" stopColor="#5c3638"/></linearGradient>
 <linearGradient id="film-hand" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffdbba"/><stop offset=".32" stopColor="#dfad91"/><stop offset=".7" stopColor="#bb816b"/><stop offset="1" stopColor="#744347"/></linearGradient>
 <radialGradient id="film-rim" cx="20%" cy="25%" r="85%"><stop stopColor="#ffe8c8" stopOpacity=".8"/><stop offset=".45" stopColor="#d69b7b" stopOpacity=".12"/><stop offset="1" stopColor="#3c1a30" stopOpacity=".5"/></radialGradient>
 <linearGradient id="film-cloth" x1="0" y1="0" x2="1" y2=".3"><stop stopColor="#58404c"/><stop offset=".38" stopColor="#26272c"/><stop offset=".75" stopColor="#35363a"/><stop offset="1" stopColor="#131c22"/></linearGradient>
 <linearGradient id="film-edge" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e2eadf"/><stop offset=".2" stopColor="#a5b5ac"/><stop offset=".53" stopColor="#3c5555"/><stop offset=".72" stopColor="#c1cec2"/><stop offset="1" stopColor="#314347"/></linearGradient>
 <linearGradient id="film-surface" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f5caa5"/><stop offset=".3" stopColor="#dba383"/><stop offset="1" stopColor="#70474a"/></linearGradient>
 <radialGradient id="film-contact"><stop stopColor="#efc49d" stopOpacity=".45"/><stop offset="1" stopColor="#9c5f50" stopOpacity="0"/></radialGradient>
 <filter id="film-shadow" x="-60%" y="-70%" width="220%" height="240%"><feGaussianBlur stdDeviation="12"/></filter>
 </defs>;

/** Palm, separate articulated fingers, restrained nails/creases; local index fingertip is (190,-24). */
export const Hand:React.FC<{x:number;y:number;scale?:number;flip?:boolean;curl?:number;ghost?:boolean;id:string;measure?:boolean}>=({x,y,scale=1,flip=false,curl=0,ghost=false,id,measure=true})=> <g transform={`translate(${x} ${y}) scale(${flip?-scale:scale} ${scale})`} opacity={ghost?.4:1}>
 <g {...(measure?critical:{})} aria-label={ghost?'Anticipated future hand position; conceptual overlay':'Articulated touching hand'} data-hand={id}>
 <path d="M-12-40Q30-53 76-41Q102-29 105 16Q106 49 71 62L-12 42Z" fill={ghost?'none':'url(#film-hand)'} stroke={ghost?palette.teal:'#e5b495'} strokeWidth={ghost?3:1} strokeDasharray={ghost?'8 7':undefined}/>
 {[{sy:-28,ey:-24,end:190,w:24},{sy:-2,ey:3,end:182,w:25},{sy:23,ey:31,end:166,w:23},{sy:46,ey:57,end:144,w:20}].map((finger,i)=> <g key={i}>
  <path data-contact-tip={i===0?id:undefined} d={`M76 ${finger.sy}Q112 ${finger.sy-6} 139 ${finger.ey+curl*(i+1)}L${finger.end} ${finger.ey+curl*(i+1)}`} stroke={ghost?palette.teal:'url(#film-hand)'} strokeWidth={ghost?3:finger.w} strokeLinecap="round" fill="none" strokeDasharray={ghost?'8 6':undefined}/>
  {!ghost&&<><path d={`M${finger.end-21} ${finger.ey-5+curl*(i+1)}h9`} stroke="#f5d4b8" strokeWidth={8} strokeLinecap="round" opacity={.6}/><path d={`M122 ${finger.ey-6+curl*(i+1)}l-2 10`} stroke="#986857" strokeWidth={1.6} opacity={.6}/></>}
 </g>)}
 <path d="M30 46Q56 69 94 78Q111 80 115 66Q116 52 99 48L73 37" fill={ghost?'none':'url(#film-hand)'} stroke={ghost?palette.teal:'#bb856c'} strokeWidth={ghost?3:1.5} strokeDasharray={ghost?'8 7':undefined}/>
 {!ghost&&<path d="M31-10Q61 5 57 32M73-22Q86 6 81 28" stroke="#9f6b59" strokeWidth={2} opacity={.32} fill="none"/>}
 </g>
 </g>;

/** An abstract experience marker placed at contact, never a neural recording or calibrated amplitude. */
export const Ripple:React.FC<{x:number;y:number;age:number;weak?:boolean;vertical?:boolean;color?:string;attenuation?:number|undefined}>=({x,y,age,weak=false,vertical=false,color=palette.amber,attenuation})=>{
 const visibility=smooth(age/6),radius=attenuation===undefined?(weak?33:73):73-40*smooth(attenuation);
 return <g opacity={visibility} {...critical} aria-label="Touch remains felt; illustrative unmeasured sensation motif">
 {[0,1,2].map(i=><ellipse key={i} cx={x} cy={y} rx={(radius+i*18)*(vertical?.48:1)} ry={(radius+i*18)*(vertical?1:.28)} stroke={color} strokeWidth={3-i*.5} fill="none" opacity={(.8-i*.2)*(.88+.12*Math.sin(age*.13-i))}/>)}
 </g>;
};

export const RibEncounter:React.FC<{frame:number;self:boolean;forecast?:boolean;ending?:boolean;id:string}>=({frame,self,forecast=false,ending=false,id})=>{
 const reach=smooth((frame-(ending?38:6))/(ending?48:22)),contact=reach>.98,contactFrame=ending?86:28;
 const reaction=contact?(self?2:15)*Math.sin(Math.max(0,frame-contactFrame)*.15)*Math.exp(-Math.max(0,frame-contactFrame)/90):0;
 const camera=ending?1.05-.06*smooth(frame/120):1.12-.12*smooth(frame/70),cx=650+reaction,cy=855;
 const handScale=1.12,wx=self?cx-190*handScale-(1-reach)*190:cx+190*handScale+(1-reach)*210,wy=cy+24*handScale;
 return <g transform={`translate(${(1-camera)*500} ${(1-camera)*850}) scale(${camera})`}>
 <g transform={`translate(${reaction} 0) rotate(${self?0:reaction*.07} 530 890)`}>
  <path d="M290 390C490 340 701 429 751 588C785 676 710 764 657 843Q623 1007 690 1325L228 1375Q134 980 177 690Q195 485 290 390Z" fill="url(#film-skin)"/><path d="M290 390C490 340 701 429 751 588C785 676 710 764 657 843Q623 1007 690 1325L228 1375Q134 980 177 690Q195 485 290 390Z" fill="url(#film-rim)"/>
  <path d="M257 340Q375 372 489 414Q579 588 564 718Q515 947 575 1330L172 1405Q112 1070 135 761Q135 444 257 340Z" fill="url(#film-cloth)"/>
  <path d="M489 414Q591 605 565 720Q518 947 575 1330" fill="none" stroke="#7c6d6e" strokeWidth={4} opacity={.45}/>
  {[0,1,2,3].map(i=><path key={i} d={`M${580+i*6} ${742+i*83}q52 6 72 30`} stroke="#f0c0a1" strokeWidth={2} opacity={.16} fill="none"/>)}
  <path d="M286 498Q224 637 244 808" fill="none" stroke="#88737a" strokeWidth={3} opacity={.2}/>
 </g>
 {self&&<path d={`M280 550Q158 730 205 1068Q${wx-70} ${wy+130} ${wx} ${wy}`} fill="none" stroke="url(#film-hand)" strokeWidth={78} strokeLinecap="round" aria-label="Own arm visibly connects shoulder to touching hand"/>}
 {!self&&<path d={`M1160 ${wy+50}Q990 ${wy-10} ${wx} ${wy}`} fill="none" stroke="url(#film-hand)" strokeWidth={77} strokeLinecap="round"/>}
 {forecast&&<g opacity={smooth((frame-12)/14)} {...critical} aria-label="Anticipated contact appears before the actual hand arrives"><ellipse cx={cx} cy={cy} rx={30} ry={66} stroke={palette.teal} strokeWidth={4} strokeDasharray="9 8" fill="none"/><path d={`M${cx-17} ${cy-26}q29 6 28 35`} fill="none" stroke={palette.teal} strokeWidth={3}/></g>}
 <ellipse cx={cx} cy={cy} data-qabounds="critical-visual" aria-label="Essential rib contact site" rx={53} ry={88} fill="url(#film-contact)" opacity={reach*.7}/>
 <Hand x={wx} y={wy} scale={handScale} flip={!self} curl={contact?Math.sin(frame*.32)*1.4:0} id={id} measure={self}/>
 {contact&&<Ripple x={cx} y={cy} age={frame-contactFrame} weak={self} vertical color={self?palette.teal:palette.amber}/>}
 </g>;
};

export const ContactStudy:React.FC<{frame:number;weak?:boolean;prediction?:boolean;id:string;staticContact?:boolean;cropForearm?:boolean;attenuation?:number|undefined}>=({frame,weak=false,prediction=false,id,staticContact=false,cropForearm=false,attenuation})=>{
 const reach=staticContact?1:smooth((frame-16)/55),x=670-(1-reach)*250,y=902-(1-reach)*250,contact=reach>.985,age=frame-71;
 const preview=prediction?smooth((frame-10)/18):0;
 return <g data-contact-root={id} data-contact-level={contact?1:0}>
 <ellipse cx={495} cy={1170} rx={355} ry={32} fill="#122c2e" opacity={.2} filter="url(#film-shadow)"/>
 <path d={`M105 1015Q390 930 565 982Q600 ${contact?1010:973} 635 982Q740 990 852 1015L866 1140Q506 1250 105 1140Z`} fill="url(#film-surface)"/>
 <path data-contact-surface={id} d={`M105 1015Q390 930 565 982Q600 ${contact?1010:973} 635 982Q740 990 852 1015`} fill="none" stroke="#ffe1bc" strokeWidth={5} opacity={.7}/>
 <path d="M130 1092Q480 1168 833 1094" fill="none" stroke="#96604d" strokeWidth={2} opacity={.35}/>
 {prediction&&<g opacity={preview} {...critical} aria-label="Conceptual forecast at the future contact site, before actual touch"><ellipse cx={600} cy={994} rx={65} ry={23} fill="none" stroke="#207e77" strokeWidth={4} strokeDasharray="10 8"/><path d="M560 966q38-24 77 0" fill="none" stroke="#207e77" strokeWidth={3}/></g>}
 <ellipse cx={600} cy={1000} rx={72} ry={21} fill="#4c3e39" opacity={reach*.22} filter="url(#film-shadow)"/>
 {prediction&&frame<72&&<g opacity={.45*preview}><g transform="translate(600 994) rotate(56) translate(-190 24)"><Hand x={0} y={0} id={id+'-forecast'} ghost/></g></g>}
 <g transform={`translate(${x-70} ${y+92}) rotate(56) translate(-190 24)`}>
  <path d={`M${cropForearm?-160:-280}-38Q-130-50 4-40L4 41Q-130 55 ${cropForearm?-160:-280} 44Z`} fill="url(#film-hand)"/>
  <Hand x={0} y={0} id={id}/>
 </g>
 {contact&&<><path d="M568 991Q600 1014 634 992" stroke="#8f6150" strokeWidth={3} opacity={.55} fill="none"/><Ripple x={600} y={1016} age={staticContact?frame+6:age} weak={weak} attenuation={attenuation} color={weak?'#237c74':'#9b4c33'}/></>}
 </g>;
};

/** Same controller/follower pair: first simultaneous motion, then a visible hold before the follower moves. */
export const DelayExperiment:React.FC<{frame:number}>=({frame})=>{
 const delayed=frame>=58,local=delayed?frame-58:frame,control=smooth((local-6)/16),follower=smooth((local-(delayed?34:6))/16);
 return <g data-robot-control={control} data-robot-follower={follower}>
 <path d="M125 1153L825 1090L875 1194L168 1270Z" fill="#142a2b" opacity={.16}/>
 <path d="M414 1025Q606 991 849 1032L849 1133Q625 1185 414 1121Z" fill="url(#film-surface)"/>
 <g transform="translate(80 0)" {...critical} aria-label="Own moving hand controls the light-touch robot">
  <path d="M155 1077L389 1056L389 1084L155 1113Z" fill="url(#film-edge)"/>
  <path d="M273 1058V841" stroke="#263c3f" strokeWidth={12}/>
  <rect data-control-handle x={232} y={780+control*110} width={81} height={52} rx={18} fill="#68b8a4" stroke="#e2f4df" strokeWidth={3}/>
  <g transform={`translate(273 ${806+control*110}) rotate(56) scale(.85) translate(-190 24)`}><path d="M-160-38H0V42H-160Z" fill="url(#film-hand)"/><Hand x={0} y={0} id="controller"/></g>
 </g>
 <path d="M353 1125Q400 1190 519 1113" fill="none" stroke="#3c7771" strokeWidth={3}/>
 <g {...critical} aria-label="Follower probe moves immediately first, then visibly later">
  <path d={`M811 647L655 633L${660-follower*35} ${799+follower*55}V${884+follower*110}`} fill="none" stroke="#203b3c" strokeWidth={47} strokeLinejoin="round"/>
  <path d={`M811 640L655 626L${660-follower*35} ${792+follower*55}V${877+follower*110}`} fill="none" stroke="url(#film-edge)" strokeWidth={28} strokeLinejoin="round"/>
  {[{x:811,y:647},{x:655,y:633}].map(j=><circle key={j.x} cx={j.x} cy={j.y} r={28} fill="#c3cec1" stroke="#244246" strokeWidth={5}/>)}
  <ellipse cx={660-follower*35} cy={896+follower*110} rx={32} ry={12} fill={palette.amber} stroke="#a06542" strokeWidth={2}/>
 </g>
 {control>.97&&<ellipse {...critical} aria-label="Controller has moved" data-control-marker cx={353} cy={928} rx={41} ry={14} fill="none" stroke="#2a8076" strokeWidth={4}/>}
 {follower>.97&&<Ripple x={625} y={1018} age={local-(delayed?50:22)} weak={!delayed} color="#9e5c37"/>}
 </g>;
};

export const FeatherContact:React.FC<{frame:number;id:string}>=({frame,id})=>{
 const reach=smooth(frame/36),y=790+reach*210;
 return <g>
 <path d="M110 1015Q450 936 850 1015L860 1145Q490 1235 110 1145Z" fill="url(#film-surface)"/>
 <g transform={`translate(574 ${y}) rotate(-22)`} {...critical} aria-label="Light feather-like tickling, distinct from laughter-inducing touch" data-feather={id}>
  <path d="M0 0V-325" stroke="#63746b" strokeWidth={4}/><path d="M0-9Q-133-172 0-325Q140-163 0-9Z" fill="#e3dfc9" stroke="#879c8f" strokeWidth={2}/>
  {Array.from({length:13},(_,i)=><path key={i} d={`M0 ${-25-i*21}q${i%2?58:-58} -26 ${i%2?65:-65} -44`} stroke="#a7b5a1" strokeWidth={2} fill="none"/>)}
 </g>
 {reach>.98&&<Ripple x={574} y={1012} age={frame-36} weak color="#237c74"/>}
 </g>;
};
