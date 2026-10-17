import React from 'react';
export const mirrorColors={ink:'#201b23',paper:'#f8edda',muted:'#d3bca9',accent:'#b9dbcb',copper:'#ce947b'};
export const ease=(t:number)=>{const q=Math.max(0,Math.min(1,t));return q*q*(3-2*q);};
/** A fixation–ballistic shift–fixation trajectory, with no physically frozen mirror image. */
export const gazeAt=(frame:number,slowed=false)=>{const period=slowed?132:76,phase=((frame%period)+period)%period,move=slowed?22:3;return phase<period/2?-1+2*ease((phase-16)/move):1-2*ease((phase-period/2-16)/move);};
export const Eye:React.FC<{x:number;y:number;scale?:number;gaze:number;id:string;critical?:boolean}>=({x,y,scale=1,gaze,id,critical=false})=>{
 const almond='M-55 0Q-29-27 0-25Q33-26 56 0Q30 25 0 24Q-33 26-55 0Z';
 return <g transform={`translate(${x} ${y}) scale(${scale})`} data-qabounds={critical?'critical-visual':undefined} aria-label={critical?'Illustrated eye and visible iris':undefined}>
 <defs><clipPath id={'eye-'+id}><path d={almond}/></clipPath><radialGradient id={'iris-'+id}><stop offset="0" stopColor="#111a19"/><stop offset=".42" stopColor="#506455"/><stop offset=".75" stopColor="#8c9b75"/><stop offset="1" stopColor="#243b38"/></radialGradient><linearGradient id={'white-'+id} x2="0" y2="1"><stop stopColor="#c4bab0"/><stop offset=".45" stopColor="#f1e6d5"/><stop offset="1" stopColor="#bfae9e"/></linearGradient></defs>
 <path d="M-61-7Q-27-42 9-34Q43-31 62-4" stroke="#5e3835" strokeWidth="7" fill="none" opacity=".4"/>
 <path d={almond} fill={`url(#white-${id})`} stroke="#623e39" strokeWidth="2"/>
 <g clipPath={`url(#eye-${id})`}><g transform={`translate(${gaze*8} 0)`}><circle r={24} fill={`url(#iris-${id})`} stroke="#283a35" strokeWidth="2"/>{Array.from({length:37},(_,i)=>{const a=i*Math.PI*2/37,r=10+(i%4);return <path key={i} d={`M${Math.cos(a)*r} ${Math.sin(a)*r}L${Math.cos(a)*(21-i%3)} ${Math.sin(a)*(21-i%3)}`} stroke={i%2?'#b4b58b':'#1f3633'} strokeWidth={.7} opacity={.5}/>;})}<circle r={10} fill="#121c1b"/><ellipse cx={-7} cy={-8} rx={5.5} ry={3} fill="#fff7e7" opacity={.85}/><circle cx={6} cy={8} r={1.8} fill="#d9e0c4" opacity={.6}/></g><path d="M-55 0Q0-32 56 0" stroke="#3b2729" strokeWidth="8" fill="none" opacity={.45}/></g>
 <path d="M-55 0Q-29-27 0-25Q33-26 56 0" stroke="#34272a" strokeWidth="3.2" fill="none"/><path d="M-48 4Q0 34 49 5" stroke="#d6a18a" strokeWidth="2" fill="none"/>
 <path d="M-58-44Q-21-61 15-51Q39-48 58-36" stroke="#453332" strokeWidth="9" strokeLinecap="round" fill="none"/>
 </g>;
};
export const Face:React.FC<{x:number;y:number;scale:number;gaze:number;id:string}>=({x,y,scale,gaze,id})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <defs><linearGradient id={'skin-'+id} x1="0" x2="1" y2=".3"><stop stopColor="#714743"/><stop offset=".4" stopColor="#ce9980"/><stop offset=".66" stopColor="#d8ad8f"/><stop offset="1" stopColor="#69473f"/></linearGradient><radialGradient id={'light-'+id} cx=".4" cy=".35" r=".65"><stop stopColor="#f5c6a1" stopOpacity=".45"/><stop offset="1" stopColor="#5d3737" stopOpacity="0"/></radialGradient></defs>
 <path d="M-190 350Q-172 220-64 216L-59 151H59L64 216Q172 220 190 350Z" fill="#283d3e"/>
 <path d="M-58 124L-58 211Q-4 252 59 210L58 124" fill={`url(#skin-${id})`}/><path d="M-57 145Q0 194 57 145L57 183Q3 214-57 182Z" fill="#583a38" opacity={.5}/>
 <ellipse cx={-123} cy={9} rx={18} ry={37} fill="#a27464"/><ellipse cx={123} cy={9} rx={18} ry={37} fill="#82564c"/>
 <path d="M-117-112Q-94-197 0-193Q102-194 119-103L113 50Q102 130 49 165Q0 189-48 165Q-105 135-115 50Z" fill={`url(#skin-${id})`}/>
 <path d="M-117-112Q-94-197 0-193Q102-194 119-103L113 50Q102 130 49 165Q0 189-48 165Q-105 135-115 50Z" fill={`url(#light-${id})`}/>
 <path d="M-119-28Q-152-155-69-193Q31-237 109-166Q147-127 122-24L104-95Q87-150 45-148Q-15-126-63-149Q-105-124-107-68Z" fill="#2d282b"/>
 {Array.from({length:19},(_,i)=><path key={i} d={`M${-107+i*11} ${-130-Math.sin(i*.17)*47}Q${-50+i*5} ${-201+i%3*4} ${33+i*4} ${-166+i%4*6}`} fill="none" stroke="#6d5045" strokeWidth={1.2} opacity={.42}/>)}
 <path d="M-12-6L-21 63Q-3 76 17 63" stroke="#86584d" strokeWidth="3" fill="none"/><path d="M8-13Q9 31 23 59" stroke="#edb797" strokeWidth="4" fill="none" opacity={.55}/><path d="M-23 67Q-12 61-5 66M9 66Q16 61 24 67" stroke="#61403e" strokeWidth="3" fill="none"/>
 <Eye x={-63} y={-23} scale={.88} gaze={gaze} id={id+'l'} critical/><Eye x={63} y={-23} scale={.88} gaze={gaze} id={id+'r'} critical/>
 <path d="M-42 110Q-20 94 0 105Q21 95 42 110Q0 139-42 110Z" fill="#9a655c"/><path d="M-41 110Q0 115 41 110" stroke="#65413f" strokeWidth="2" fill="none"/><path d="M-26 129Q0 139 26 128" stroke="#dfaa8f" strokeWidth="2" fill="none" opacity={.5}/>
 <path d="M-100 24Q-86 71-48 75M100 24Q86 71 48 75" stroke="#e6b492" strokeWidth="10" opacity={.12} fill="none"/>
 </g>;
export const Room:React.FC<{frame:number;subjective?:boolean;zoom?:number;camera?:boolean}>=({frame,subjective=false,zoom=1,camera=false})=>{
 const g=gazeAt(frame),illustratedGaze=subjective?(g<0?-1:1):g;
 return <g transform={`translate(540 870) scale(${zoom}) translate(-540 -870)`}>
 <defs><linearGradient id="wall" x2="1" y2="1"><stop stopColor="#563b3e"/><stop offset=".5" stopColor="#8d6358"/><stop offset="1" stopColor="#30262e"/></linearGradient><linearGradient id="mirror" x2=".85" y2="1"><stop stopColor="#a9b9af"/><stop offset=".35" stopColor="#677b72"/><stop offset="1" stopColor="#263d3d"/></linearGradient><linearGradient id="metal" x2="1"><stop stopColor="#343c3d"/><stop offset=".2" stopColor="#b6bbb0"/><stop offset=".45" stopColor="#e6dfc9"/><stop offset=".7" stopColor="#71817a"/><stop offset="1" stopColor="#394644"/></linearGradient><clipPath id="mirror-window"><rect x={270} y={350} width={580} height={945} rx={205}/></clipPath></defs>
 <rect width={1080} height={1500} fill="url(#wall)"/><path d="M50 0V1500M994 0V1500" stroke="#be8b74" strokeWidth="3" opacity={.18}/><rect x={248} y={328} width={624} height={989} rx={225} fill="url(#metal)"/><rect x={263} y={343} width={594} height={959} rx={210} fill="#243739"/>
 <g clipPath="url(#mirror-window)"><rect x={270} y={350} width={580} height={945} fill="url(#mirror)"/><path d="M290 520L810 310M290 600L850 377" stroke="#f6e8cf" strokeWidth="25" opacity={.05}/><Face x={560} y={805} scale={1.94} gaze={illustratedGaze} id="reflection"/><path d="M295 380L295 1150" stroke="#f0ead9" strokeWidth="3" opacity={.18}/></g>
 <path d="M0 1304H1080L1080 1410H0Z" fill="#4f4442"/><path d="M0 1304H1080" stroke="#c3a48a" strokeWidth="8"/>
 {!subjective&&<g><path d="M-110 1550L-72 1090Q-50 978 73 975L83 852Q21 771 43 646Q59 527 163 532Q268 535 283 657L270 823Q258 885 226 916L232 984Q385 1045 417 1550Z" fill="#28272e"/><path d="M57 637Q111 552 199 575Q269 595 279 681L264 840Q250 886 218 911L193 848Q232 743 207 667Q155 610 57 637Z" fill="#58423e"/><path d="M82 973Q144 1033 231 982" stroke="#a67965" strokeWidth="5" fill="none" opacity={.5}/></g>}
 {camera&&<g transform="translate(759 1138)"><rect x={-65} y={-50} width={130} height={90} rx={15} fill="#252e30" stroke="#ded5bf" strokeWidth="3"/><circle r={30} fill="#111e22" stroke="#aab8b0" strokeWidth="5"/><circle r={16} fill="#50736d"/><circle cx={-8} cy={-8} r={6} fill="#d9e3cf"/><circle cx={47} cy={-29} r={5} fill="#e5a48d"/><path d="M0 42V138M0 72L-46 138M0 72L46 138" stroke="#778c83" strokeWidth="6"/></g>}
 </g>;
};
export const EyeMacro:React.FC<{frame:number;slowed?:boolean;gaze?:number}>=({frame,slowed=false,gaze})=><g>
 <defs><linearGradient id="macro-skin" x2="1" y2=".35"><stop stopColor="#65463f"/><stop offset=".48" stopColor="#d9a98b"/><stop offset="1" stopColor="#845b4e"/></linearGradient></defs>
 <rect x={0} y={490} width={1080} height={650} rx={120} fill="url(#macro-skin)"/><path d="M525 690L495 1010Q545 1045 594 1008" fill="none" stroke="#875c50" strokeWidth="12" opacity={.7}/>
 <Eye x={310} y={790} scale={2.55} gaze={gaze??gazeAt(frame,slowed)} id="macro-l" critical/><Eye x={695} y={790} scale={2.55} gaze={gaze??gazeAt(frame,slowed)} id="macro-r" critical/>
 </g>;
