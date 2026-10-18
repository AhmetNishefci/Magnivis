import React from 'react';
export const color={ink:'#302337',muted:'#736875',paper:'#f4eee4',teal:'#217e7f',amber:'#bd6841',skin:'#c78f75'};
export const ease=(x:number)=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
type V=[number,number,number];
type Primitive={a:V;b?:V;r:number;sy?:number;sz?:number;material:'clay'|'shirt'|'dark'|'visitor';id:string};
const mix=(a:V,b:V,t:number):V=>a.map((n,i)=>n+(b[i]!-n)*t) as V;
/** Project original articulated sculpture geometry. No anatomical measurement or neural-pathway claim. */
export const Sculpture:React.FC<{frame:number;self?:boolean;reaction?:number;yaw?:number;zoom?:number;x?:number;y?:number;id?:string;external?:boolean;anticipation?:boolean}>=({frame,self=false,reaction=0,yaw=-.27,zoom=1,x=508,y=925,id='body',external=true,anticipation=false})=>{
 const phase=frame%126,reach=ease((phase-4)/25)*(1-ease((phase-100)/20));
 const contact=phase>30&&phase<98,wiggle=contact?Math.sin(frame*.38)*.025:0;
 const recoil=contact?reaction*(.7+.3*Math.sin(frame*.43)):0;
 const rot=yaw+recoil*.16;
 const project=(v:V)=>{const xx=v[0]*Math.cos(rot)+v[2]*Math.sin(rot),zz=-v[0]*Math.sin(rot)+v[2]*Math.cos(rot),k=1/(1-zz*.085);return {x:x+(xx+recoil*.5)*240*zoom*k,y:y-v[1]*240*zoom*k,z:zz,k};};
 const shapes:Primitive[]=[];
 const ball=(key:string,a:V,r:number,sy=1,sz=1,material:Primitive['material']='clay')=>shapes.push({a,r,sy,sz,material,id:key});
 const bone=(key:string,a:V,b:V,r:number,material:Primitive['material']='clay')=>shapes.push({a,b,r,material,id:key});
 // Faceless head and dressed upper body keep the social experiment abstract and nonclinical.
 ball('head',[recoil*.1,1.98,0],.34,1.34,.89);bone('neck',[0,1.28,-.05],[0,1.72,-.05],.17);

 ball('hips',[0,-.62,0],.52,.64,.65,'dark');
 for(const side of [-1,1]){bone('thigh'+side,[side*.27,-.72,0],[side*.31,-1.48,.03],.245,'dark');bone('shin'+side,[side*.31,-1.45,.03],[side*.32,-2.05,.12],.17);}
 const shoulder:V=[-.66,1.13,0],elbow:V=self?[-.86,.12,.31]:[-.8,.32,0];
 const resting:V=[-.76,-.3,.13],target:V=[.18,.37+wiggle,.43];
 const wrist=mix(resting,target,self?reach:0);
 bone('left-upper',shoulder,elbow,.145);ball('left-shoulder',shoulder,.18);ball('left-elbow',elbow,.145);bone('left-forearm',elbow,wrist,.115);
 const rs:V=[.66,1.12,-.04],re:V=[.95,.82,-.02],rw:V=[1.01,1.45,.03];
 bone('right-upper',rs,re,.145);ball('right-shoulder',rs,.18);bone('right-forearm',re,rw,.11);ball('right-palm',[1.02,1.61,.04],.13,1.4,.55);
 const hand=(key:string,center:V,direction:number,material:Primitive['material'])=>{
  ball(key+'palm',center,.14,1.2,.55,material);
  for(let i=0;i<4;i++){
   const a:V=[center[0]+direction*.09,center[1]+.12-i*.073,center[2]+.035];
   const curl=contact?Math.sin(frame*.38+i*.8)*.035:0;
   const b:V=[a[0]+direction*.16,a[1]-.015,a[2]+curl];
   const c:V=[b[0]+direction*(.08-Math.abs(i-1.5)*.012),b[1]-.04,b[2]-.035];
   bone(key+'f'+i,a,b,.035,material);bone(key+'tip'+i,b,c,.03,material);
  }
  bone(key+'thumb',[center[0],center[1]-.14,center[2]],[center[0]+direction*.14,center[1]-.23,center[2]+.04],.047,material);
 };
 hand('own',wrist,self?1:-.25,'clay');
 if(external&&!self){const center=mix([1.75,.42,.36],[.81,.4+wiggle,.38],reach);bone('visitor-forearm',[2.6,.14,.4],[center[0]+.11,center[1]-.01,center[2]],.115,'visitor');hand('visitor',center,-1,'visitor');}
 const ordered=shapes.map(s=>({...s,p:project(s.a),q:s.b?project(s.b):null})).sort((a,b)=>a.id==='head'?1:b.id==='head'?-1:(a.q?(a.p.z+a.q.z)/2:a.p.z)-(b.q?(b.p.z+b.q.z)/2:b.p.z));
 const draw=(s:typeof ordered[number])=>{const r=s.r*240*zoom*s.p.k,colors=s.material==='shirt'?['#faf4e7','#ded9cc','#918c86']:s.material==='dark'?['#79617e','#48354e','#291d31']:['#ecc4a5','#cd987b','#82574f'];
 const isCritical=!s.id.startsWith('shin')&&!s.id.startsWith('thigh')&&!s.id.startsWith('visitor-forearm');
 const attributes=isCritical?{'data-qabounds':'critical-visual','aria-label':s.id.includes('own')?'Own hand and connected arm':s.id.includes('visitor')?'External fingers contacting flank':'Sculpted '+s.id}:{};
 if(!s.q)return <ellipse {...attributes} key={s.id} cx={s.p.x} cy={s.p.y} rx={r} ry={r*(s.sy??1)} fill={`url(#${id}-${s.material})`}/>;
 const dx=s.q.x-s.p.x,dy=s.q.y-s.p.y,length=Math.hypot(dx,dy)||1,nx=-dy/length*r,ny=dx/length*r,gid=id+'-bone-'+s.id;
 return <g key={s.id} {...attributes}><defs><linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={s.p.x-nx} y1={s.p.y-ny} x2={s.p.x+nx} y2={s.p.y+ny}><stop stopColor={colors[2]}/><stop offset=".34" stopColor={colors[0]}/><stop offset=".65" stopColor={colors[1]}/><stop offset="1" stopColor={colors[2]}/></linearGradient></defs><path d={`M${s.p.x} ${s.p.y}L${s.q.x} ${s.q.y}`} stroke={`url(#${gid})`} strokeWidth={r*2} strokeLinecap="round"/></g>;
 };
 return <g>
 <defs>
 {(['clay','shirt','dark','visitor'] as const).map(mat=><radialGradient key={mat} id={id+'-'+mat} cx="27%" cy="22%" r="82%"><stop stopColor={mat==='shirt'?'#fffaf0':mat==='dark'?'#69516c':mat==='visitor'?'#e2b49a':'#e7b89a'}/><stop offset=".47" stopColor={mat==='shirt'?'#d8d3c6':mat==='dark'?'#413149':mat==='visitor'?'#b2775f':'#c78f75'}/><stop offset="1" stopColor={mat==='shirt'?'#8b8881':mat==='dark'?'#201829':mat==='visitor'?'#704e4d':'#82564f'}/></radialGradient>)}
 <filter id={id+'-shadow'}><feGaussianBlur stdDeviation="15"/></filter>
 </defs>
 <ellipse cx={x+20} cy={y+480*zoom} rx={220*zoom} ry={27*zoom} fill="#493c4b" opacity={.16} filter={`url(#${id}-shadow)`}/>
 <g>
 <defs><linearGradient id={id+'-torso'} x1="0" y1=".15" x2="1" y2=".75"><stop stopColor="#fcf7ea"/><stop offset=".46" stopColor="#e3dfd2"/><stop offset="1" stopColor="#96928c"/></linearGradient></defs>
 {ordered.filter(s=>s.p.z<0).map(s=>draw(s))}
 <g data-qabounds="critical-visual" aria-label="Continuous sculpted torso; contact on flank and self-arm connection are visible">
 <path d={(()=>{const outline:V[]=[[-.19,1.46,.05],[-.54,1.30,.05],[-.67,1.12,.05],[-.58,.67,.14],[-.46,.10,.19],[-.50,-.52,.1],[.50,-.52,.1],[.46,.10,.19],[.58,.67,.14],[.67,1.12,.05],[.54,1.30,.05],[.19,1.46,.05]];const pts=outline.map(project);return `M${(pts.at(-1)!.x+pts[0]!.x)/2},${(pts.at(-1)!.y+pts[0]!.y)/2}`+pts.map((v,i)=>{const n=pts[(i+1)%pts.length]!;return `Q${v.x},${v.y} ${(v.x+n.x)/2},${(v.y+n.y)/2}`;}).join(' ')+'Z';})()} fill={`url(#${id}-torso)`}/>
 </g>
 {ordered.filter(s=>s.p.z>=0).map(s=>draw(s))}
 </g>
 {anticipation&&<g opacity={.7}><ellipse cx={project([.53,.36,.35]).x} cy={project([.53,.36,.35]).y} rx={29} ry={43} stroke={color.teal} strokeWidth={3} strokeDasharray="6 7" fill="none"/></g>}
 {contact&&<g aria-label="Touch remains felt; qualitative contact marker"><ellipse cx={project([.55,.37,.37]).x} cy={project([.55,.37,.37]).y} rx={self?16:28} ry={self?21:37} fill="none" stroke={color.amber} strokeWidth={3} opacity={.75}/></g>}
 </g>;
};
export const SkinContact:React.FC<{frame:number;weak?:boolean;feather?:boolean;id:string}>=({frame,weak=false,feather=false,id})=>{
 const p=(frame%110)/110,down=ease((p-.08)/.2)*(1-ease((p-.72)/.2)),tip=down*24,at=465+Math.sin(frame*.045)*80;
 return <g data-contact-root={id} data-contact-level={down}>
 <defs><linearGradient id={id+'-skin'} x2="0" y2="1"><stop stopColor="#e5b89a"/><stop offset=".3" stopColor="#c58b72"/><stop offset="1" stopColor="#825750"/></linearGradient><linearGradient id={id+'-finger'} x2="1" y2=".3"><stop stopColor="#9e6b59"/><stop offset=".5" stopColor="#e9bea0"/><stop offset="1" stopColor="#b7836c"/></linearGradient></defs>
 <path data-contact-surface={id} d={`M140 940Q${at-95} 915 ${at-36} ${927+tip}Q${at} ${935+tip} ${at+37} ${927+tip}Q650 910 850 940L850 1090Q500 1150 140 1090Z`} fill={`url(#${id}-skin)`}/>
 <g data-qabounds="critical-visual" aria-label="Physical touch indents the surface; sensory input persists">
 {feather?<g data-contact-tip={id} transform={`translate(${at} ${800+down*159}) rotate(-25)`}><path d="M0 0V-260" stroke={color.ink} strokeWidth={5}/><path d="M0-20Q-100-140 0-260Q95-150 0-20" fill="#e2ddd0" stroke="#8f8a7d" strokeWidth={2}/>{Array.from({length:10},(_,i)=><path key={i} d={`M0 ${-30-i*20}l${i%2?44:-44} -35`} stroke="#b0ab9f" strokeWidth={2}/>)}</g>:<path data-contact-tip={id} transform={`translate(0 ${44*down})`} d={`M${at+240} 595Q${at+225} 640 ${at+140} 705L${at+40} ${856+tip}Q${at+7} ${908+tip} ${at-18} ${891+tip}Q${at-49} ${876+tip} ${at-24} ${834+tip}L${at+58} 662Q${at+119} 550 ${at+240} 595Z`} fill={`url(#${id}-finger)`}/>}
 </g>
 <g opacity={down*.85} data-qabounds="critical-visual" aria-label="Qualitative felt-touch motif, not calibrated amplitude or recorded neural activity">
 {[0,1,2].map(i=><ellipse key={i} cx={at} cy={1014} rx={(weak?29:48)+i*18} ry={11+i*7} fill="none" stroke={color.teal} strokeWidth={weak?2:3} opacity={1-i*.25}/>)}
 </g>
 </g>;
};
/** A relationship model: these paths do not claim anatomical neural routing. */
export const PredictionModel:React.FC<{frame:number;duration:number;attenuate?:boolean}>=({frame,duration,attenuate=false})=>{
 const t=frame/duration,reduction=attenuate?ease((t-.58)/.35):0,intent=attenuate?1:ease(t/.15),predict=attenuate?1:ease((t-.16)/.2),actual=attenuate?1:ease((t-.43)/.2),output=attenuate?1:ease((t-.65)/.18);
 const dash=(v:number)=>({strokeDasharray:1100,strokeDashoffset:1100*(1-v)});
 return <g>
 <defs><linearGradient id="ribbon-teal"><stop stopColor="#217e7f"/><stop offset="1" stopColor="#82b1a1"/></linearGradient></defs>
 <path d="M218 684C350 684 300 550 490 550S700 650 732 831" fill="none" stroke="#b5c7bc" strokeWidth={22} opacity={.25}/>
 <path data-qabounds="critical-visual" aria-label="Movement-related prediction branch precedes actual touch" d="M218 684C350 684 300 550 490 550S700 650 732 831" fill="none" stroke="url(#ribbon-teal)" strokeWidth={12} strokeLinecap="round" {...dash(predict)}/>
 <path d="M218 684C330 690 300 1030 480 1030S690 999 732 885" fill="none" stroke="#d6b098" strokeWidth={21} opacity={.25}/>
 <path data-qabounds="critical-visual" aria-label="Actual tactile input branch arrives later in the illustrative sequence" d="M218 684C330 690 300 1030 480 1030S690 999 732 885" fill="none" stroke={color.amber} strokeWidth={12} strokeLinecap="round" {...dash(actual)}/>
 <g opacity={intent}><circle cx={218} cy={684} r={50} fill="#d5b49d"/><path d="M198 690q25-48 40-23m-35 30 20 8" stroke={color.ink} strokeWidth={5} fill="none" strokeLinecap="round"/></g>
 <g opacity={predict}><ellipse cx={492} cy={550} rx={62} ry={28} fill={color.paper} stroke={color.teal} strokeWidth={4} strokeDasharray="7 7"/></g>
 <g opacity={actual}><ellipse cx={492} cy={1030} rx={62} ry={28} fill={color.amber} opacity={.35}/><path d="M444 1030q45-30 93 0" fill="none" stroke={color.amber} strokeWidth={5}/></g>
 <g opacity={output} data-qabounds="critical-visual" aria-label="Predicted and actual touch contribute to weaker nonzero sensation; explanatory model">
 <ellipse cx={735} cy={855} rx={58} ry={74} fill={color.paper} stroke={color.ink} strokeWidth={2}/>
 <path d="M714 855q20-20 40 0" stroke={color.teal} strokeWidth={4} fill="none"/>
 {[0,1,2].map(i=><ellipse key={i} cx={735} cy={855} rx={22+i*(13-5*reduction)} ry={14+i*(10-4*reduction)} stroke={color.teal} strokeWidth={2} fill="none" opacity={.9-i*.22}/>)}
 </g>
 </g>;
};
export const RobotStudy:React.FC<{frame:number;duration:number}>=({frame,duration})=>{
 const time=frame/duration,cycle=frame%105,movement=Math.sin(Math.min(1,cycle/65)*Math.PI*2)*65,delayed=Math.sin(Math.min(1,Math.max(0,cycle-18)/65)*Math.PI*2)*65;
 return <g>
 <defs><linearGradient id="forearm"><stop stopColor="#8c5b51"/><stop offset=".42" stopColor="#ecc3a1"/><stop offset="1" stopColor="#bb826a"/></linearGradient></defs>
 <ellipse cx={515} cy={1090} rx={325} ry={22} fill="#5a4659" opacity={.12}/>
 <path d="M185 1010Q420 970 720 1010L770 1080Q450 1120 185 1080Z" fill="url(#forearm)"/>
 <g data-qabounds="critical-visual" aria-label="Simplified follower robot delivers delayed light touch to forearm; not actual apparatus">
 <path d={`M750 730L620 700L${485+delayed} 873L${485+delayed} 1007`} fill="none" stroke="#786e7b" strokeWidth={29} strokeLinejoin="round"/>
 {[750,620].map((x,i)=><circle key={x} cx={x} cy={i?700:730} r={24} fill="#c8c5bf" stroke="#6c6474" strokeWidth={5}/>)}
 <rect x={463+delayed} y={985} width={45} height={24} rx={10} fill={color.teal}/>
 </g>
 <g data-qabounds="critical-visual" aria-label="Active hand moves a control first; connected visual guide identifies the self-produced origin">
 <path d={`M225 650L${310+movement} 725L${365+movement} 801`} fill="none" stroke="#a59894" strokeWidth={21} strokeLinejoin="round"/>
 <path d={`M${368+movement} 744V812`} stroke={color.ink} strokeWidth={10}/>
 <path d={`M${220+movement} 660Q${310+movement} 650 ${370+movement} 732L${388+movement} 753Q${384+movement} 778 ${360+movement} 764L${300+movement} 717L${220+movement} 727Z`} fill="url(#forearm)"/>
 </g>
 <path d="M350 858Q355 920 450 923" fill="none" stroke={color.amber} strokeWidth={3} strokeDasharray="7 8"/>
 <path d="M436 911l14 12-19 3" fill="none" stroke={color.amber} strokeWidth={3}/>
 <g transform="translate(0 0)"><path d="M240 1195H797M240 1260H797" stroke="#b1a7a9" strokeWidth={2}/><circle cx={275+Math.min(.85,time)*570} cy={1195} r={11} fill={color.teal}/><circle cx={275+Math.max(0,Math.min(.85,time-.15))*570} cy={1260} r={11} fill={color.amber}/></g>
 </g>;
};
