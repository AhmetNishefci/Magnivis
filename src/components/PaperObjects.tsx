import type {ReactNode} from 'react';
export const paperInk='#173E35';
export const paperRed='#D14B32';
export const Sheet=({x,y,w,h,rotation=0,opacity=1,children,outline=false}:{x:number;y:number;w:number;h:number;rotation?:number;opacity?:number;children?:ReactNode;outline?:boolean})=> <g transform={`translate(${x} ${y}) rotate(${rotation})`} opacity={opacity}>
 {!outline&&<rect x={-w/2+9} y={-h/2+15} width={w} height={h} rx={2} fill="#173E35" opacity={0.11}/>}
 <rect x={-w/2} y={-h/2} width={w} height={h} rx={1} fill={outline?'none':'#FFFEFA'} stroke={outline?paperRed:'#B6BCAF'} strokeWidth={outline?4:2} strokeDasharray={outline?'12 9':undefined}/>
 {children}
 </g>;
export const InkLabel=({x,y,children,size=38,color=paperInk,anchor='middle'}:{x:number;y:number;children:ReactNode;size?:number;color?:string;anchor?:'middle'|'start'|'end'})=><text data-critical="label" x={x} y={y} textAnchor={anchor} fontFamily="Manrope" fontSize={size} fontWeight={600} fill={color}>{children}</text>;
export const Dimension=({x1,y1,x2,y2,label,lx,ly,color=paperInk}:{x1:number;y1:number;x2:number;y2:number;label:string;lx:number;ly:number;color?:string})=><g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={3}/><circle cx={x1} cy={y1} r={4} fill={color}/><circle cx={x2} cy={y2} r={4} fill={color}/><InkLabel x={lx} y={ly} color={color}>{label}</InkLabel></g>;
/** Original print design; all features share the sheet's uniform coordinate scale. */
export const PrintedDesign=()=> <g>
 <rect x={-125} y={-183} width={250} height={365} fill="#F5F0DB"/>
 <path d="M-125 100 L125 -110 L125 180 L-125 180Z" fill="#173E35"/>
 <circle cx={44} cy={-81} r={59} fill="#D14B32"/>
 <circle cx={44} cy={-81} r={27} fill="#F5F0DB"/>
 <path d="M-91 -146 h80 M-91 -126 h55 M-91 -106 h70" stroke="#173E35" strokeWidth={7}/>
 <path d="M-90 134 h160 M-90 153 h115" stroke="#FFFEFA" strokeWidth={5}/>
 </g>;
