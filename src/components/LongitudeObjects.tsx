import type {ReactNode} from 'react';
import {eastLongitudePoint} from '../production/longitude-geometry';
export const theatreColors={ivory:'#F1EBDD',paper:'#F8F3E8',ink:'#322D3A',sea:'#526C68',earth:'#81968B',accent:'#9D493E',muted:'#706873'} as const;
export const TheatreSurface=({children}:{children:ReactNode})=><svg viewBox="0 0 720 750" width="100%" height="100%" style={{overflow:'visible'}}>
 <defs>
  <linearGradient id="theatre-paper" x1="0" y1="0" x2="0.8" y2="1"><stop stopColor="#FEFBF4"/><stop offset="1" stopColor="#E8DFCE"/></linearGradient>
  <filter id="theatre-shadow" x="-35%" y="-35%" width="170%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#493B39" floodOpacity="0.13"/></filter>
  <linearGradient id="theatre-silver" x1="0" x2="1"><stop stopColor="#AAA6A0"/><stop offset="0.25" stopColor="#F7F4EB"/><stop offset="0.65" stopColor="#B7B4AF"/><stop offset="1" stopColor="#E5DED0"/></linearGradient>
  <radialGradient id="theatre-globe" cx="0.3" cy="0.2"><stop stopColor="#AFBFB0"/><stop offset="1" stopColor="#718A7F"/></radialGradient>
 </defs>
 <rect x="8" y="8" width="704" height="734" rx="34" fill="url(#theatre-paper)" filter="url(#theatre-shadow)"/>
 {children}
</svg>;
export const ObjectLabel=({x,y,children,size=25,color=theatreColors.ink,anchor='middle'}:{x:number;y:number;children:ReactNode;size?:number;color?:string;anchor?:'middle'|'start'|'end'})=><text data-critical-label="true" x={x} y={y} fill={color} textAnchor={anchor} fontSize={size} fontFamily="Longitude Source Sans" fontWeight={600}>{children}</text>;
export const LongitudeWatch=({x,y,r=115,historical=false}:{x:number;y:number;r?:number;historical?:boolean})=>{
 const roman=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
 return <g transform={`translate(${x} ${y})`}>
  <g filter="url(#theatre-shadow)">
   {historical&&<><path d={`M ${-r*.23} ${-r*1.12} C ${-r*.55} ${-r*1.7} ${r*.55} ${-r*1.7} ${r*.23} ${-r*1.12}`} fill="none" stroke="#B7B5AF" strokeWidth={r*.055}/><rect x={-r*.15} y={-r*1.18} width={r*.3} height={r*.22} rx={r*.06} fill="url(#theatre-silver)"/><path d={`M ${-r*.99} ${-r*.35} L ${-r*1.12} ${-r*.27} L ${-r*1.12} ${r*.27} L ${-r*.99} ${r*.35}`} fill="none" stroke="#B5B2AA" strokeWidth={r*.035}/></>}
   <circle r={r} fill="url(#theatre-silver)" stroke="#AAA79F" strokeWidth="2"/>
   <circle r={r*.91} fill="#FBF9F0" stroke="#C2BBB0" strokeWidth="2"/>
   <circle r={r*.70} fill="none" stroke="#9C9891" strokeWidth="1"/>
  </g>
  {Array.from({length:60},(_,i)=>{const a=i*Math.PI/30;return <line key={i} x1={Math.sin(a)*r*.84} y1={-Math.cos(a)*r*.84} x2={Math.sin(a)*r*(i%5===0?.78:.81)} y2={-Math.cos(a)*r*(i%5===0?.78:.81)} stroke="#645C60" strokeWidth={i%5===0?2:1}/>;})}
  {roman.map((n,i)=>{const a=i*Math.PI/6;return <text key={n} x={Math.sin(a)*r*.61} y={-Math.cos(a)*r*.61+r*.035} textAnchor="middle" fontFamily="Longitude Source Serif" fontSize={r*.14} fill="#322D3A">{n}</text>;})}
  <path d={historical?`M 0 0 L ${-r*.4} ${-r*.28} M 0 0 L ${r*.56} ${-r*.4}`:`M 0 0 L 0 ${-r*.49} M 0 0 L 0 ${-r*.74}`} stroke="#322D3A" strokeWidth={r*.028} strokeLinecap="round"/>
  <circle r={r*.035} fill="#322D3A"/>
 </g>;
};
export const ShipObject=({x,y,scale=1}:{x:number;y:number;scale?:number})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <ellipse cx="0" cy="65" rx="120" ry="25" fill="#526C68" opacity="0.13"/>
 {[-10,25,55,90].map((dy,i)=><path key={i} d={`M -130 ${dy} Q -70 ${dy-12} -20 ${dy} T 90 ${dy} T 150 ${dy}`} stroke="#526C68" strokeWidth="3" fill="none" opacity="0.3"/>)}
 <g filter="url(#theatre-shadow)"><path d="M -95 20 L 105 20 L 65 62 L -65 62 Z" fill="#526C68"/><path d="M 0 15 L 0 -145" stroke="#6A5C59" strokeWidth="8"/><path d="M 12 -132 L 90 5 L 12 5 Z" fill="#FBF8ED" stroke="#D2C8B8" strokeWidth="2"/><path d="M -10 -110 L -75 5 L -10 5 Z" fill="#ECE2D0"/></g>
</g>;
export const SunObject=({x,y,r=38}:{x:number;y:number;r?:number})=><g transform={`translate(${x} ${y})`}>
 {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <line key={i} x1={Math.sin(a)*(r+10)} y1={Math.cos(a)*(r+10)} x2={Math.sin(a)*(r+21)} y2={Math.cos(a)*(r+21)} stroke="#9D493E" strokeWidth="3"/>;})}
 <circle r={r} fill="#E5C399" stroke="#AD8A63" strokeWidth="2" filter="url(#theatre-shadow)"/>
</g>;
export const ReadingCard=({x,y,label,value,small=false}:{x:number;y:number;label:string;value:string;small?:boolean})=><g>
 <rect x={x} y={y} width="286" height={small?144:225} rx="18" fill="#FBF8EE" stroke="#D3C9B9" strokeWidth="2" filter="url(#theatre-shadow)"/>
 <ObjectLabel x={x+143} y={y+42} size={29}>{label}</ObjectLabel>
 <ObjectLabel x={x+143} y={y+(small?118:141)} size={small?58:72}>{value}</ObjectLabel>
 {!small&&<ObjectLabel x={x+143} y={y+199} size={26} color={theatreColors.muted}>MEAN SOLAR TIME</ObjectLabel>}
</g>;
export const MeridianGlobe=({degrees=30,reveal=1,r=190,cy=375,showViewLabel=true}:{degrees?:number;reveal?:number;r?:number;cy?:number;showViewLabel?:boolean})=>{
 const cx=360;const p=eastLongitudePoint(degrees*reveal,r,{x:cx,y:cy});
 const start=eastLongitudePoint(0,r,{x:cx,y:cy});
 // Build center-specific arc directly to keep angle and radius geometrically exact.
 const a=eastLongitudePoint(0,r*.8,{x:cx,y:cy});const b=eastLongitudePoint(degrees*reveal,r*.8,{x:cx,y:cy});
 return <g>
  <circle cx={cx} cy={cy} r={r+8} fill="#D6CDBC" filter="url(#theatre-shadow)"/>
  <circle cx={cx} cy={cy} r={r} fill="url(#theatre-globe)"/>
  {[.33,.66].map(n=><circle key={n} cx={cx} cy={cy} r={r*n} fill="none" stroke="#D8E0D2" opacity="0.48" strokeWidth="1"/>)}
  {Array.from({length:12},(_,i)=>{const q=eastLongitudePoint(i*30,r,{x:cx,y:cy});return <line key={i} x1={cx} y1={cy} x2={q.x} y2={q.y} stroke="#D6DECE" opacity="0.4"/>;})}
  <path d={`M ${cx} ${cy} L ${a.x} ${a.y} A ${r*.8} ${r*.8} 0 0 0 ${b.x} ${b.y} Z`} fill="#9D493E" opacity="0.25"/>
  <path d={`M ${a.x} ${a.y} A ${r*.8} ${r*.8} 0 0 0 ${b.x} ${b.y}`} fill="none" stroke="#9D493E" strokeWidth="8"/>
  <line x1={cx} y1={cy} x2={start.x} y2={start.y} stroke="#322D3A" strokeWidth="4"/>
  <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#9D493E" strokeWidth="5"/>
  <circle cx={cx} cy={cy} r="8" fill="#F8F3E8"/>
  {showViewLabel&&<ObjectLabel x={cx} y={cy+r+38} size={24}>NORTH-POLE VIEW</ObjectLabel>}
  <ObjectLabel x={cx+67} y={cy-r-17} size={24}>REFERENCE</ObjectLabel>
  <ObjectLabel x={cx-r-25} y={cy-r*.58} size={23} color={theatreColors.accent}>EAST ↶</ObjectLabel>
 </g>;
};
