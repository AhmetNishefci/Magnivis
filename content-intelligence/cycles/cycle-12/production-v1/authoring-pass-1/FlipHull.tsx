/** Original explanatory silhouette. Local x runs stern to bow; no source pixels. */
export const FlipHull=({ballast=0,cutaway=false,accent='#EFB46F'}:{ballast?:number;cutaway?:boolean;accent?:string})=> <g>
 <defs><linearGradient id="flip-metal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#F0E8D8"/><stop offset=".5" stopColor="#D7CCB7"/><stop offset="1" stopColor="#879EA2"/></linearGradient><clipPath id="flip-hull-clip"><path d="M0-27H410L610-18H670L695-38H755Q780-38 780 0Q780 38 755 38H695L670 18H610L410 27H0Z"/></clipPath></defs>
 <path d="M0-27H410L610-18H670L695-38H755Q780-38 780 0Q780 38 755 38H695L670 18H610L410 27H0Z" fill="url(#flip-metal)" stroke="#344F5D" strokeWidth="3"/>
 <path d="M8-17H405L610-9H667M8 17H405L610 9H667" fill="none" stroke="#F8F0DD" strokeWidth="2" opacity=".6"/>
 {[25,110,195,280,365,450,535,620].map((x,i)=><g key={x} clipPath="url(#flip-hull-clip)" opacity={cutaway?1:.13}>
  <rect x={x} y={-22} width={76} height={44} fill={cutaway?'#334B59':'none'} stroke="#5B7782" strokeWidth="2"/>
  <rect x={x} y={22-44*Math.max(0,Math.min(1,ballast*1.7-i*.085))} width={76} height={44*Math.max(0,Math.min(1,ballast*1.7-i*.085))} fill={accent}/>
 </g>)}
 <path d="M680-30H755L765-15H688Z" fill="#3B6270" stroke="#F5ECDD" strokeWidth="2"/>
 {[696,716,736].map(x=><rect key={x} x={x} y={-27} width={12} height={9} rx={2} fill="#CDE9E8"/>)}
 <path d="M680 22H755M678-35V-57H744V-39M686-57L697-82M693-76H736" fill="none" stroke="#435F68" strokeWidth="4"/>
 <path d="M699-84H731V-57H701Z" fill="#EAE2D2" stroke="#496572" strokeWidth="2"/>
 <rect x={707} y={-80} width={16} height={11} fill="#3C6575"/>
 <path d="M10-26V-58M9-55L53-28M0-56H41" fill="none" stroke="#496572" strokeWidth="3"/>
 </g>;
