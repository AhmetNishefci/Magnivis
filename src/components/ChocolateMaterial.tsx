import React from 'react';
/** Original orthographic projection of beveled chocolate geometry. No image/diagram imports. */
type Point = readonly [number, number, number];
const project = ([x,y,z]:Point) => [x*0.88+y*0.37, y*0.64-x*0.20-z];
const polygon=(points:Point[])=>points.map(p=>project(p).join(',')).join(' ');
const tile=(x:number,y:number,w:number,h:number,z:number)=>{
 const edge=10;const top:Point[]=[[x+edge,y,z],[x+w-edge,y,z],[x+w,y+edge,z],[x+w,y+h-edge,z],[x+w-edge,y+h,z],[x+edge,y+h,z],[x,y+h-edge,z],[x,y+edge,z]];
 return {top,front:[[x,y+h,0],[x+w,y+h,0],[x+w,y+h-edge,z],[x+w-edge,y+h,z],[x+edge,y+h,z],[x,y+h-edge,z]] as Point[],right:[[x+w,y,0],[x+w,y+h,0],[x+w,y+h-edge,z],[x+w,y+edge,z]] as Point[]};
};
export const ChocolateMaterial:React.FC<{x?:number;y?:number;scale?:number;split?:number;soft?:number;shine?:number;window?:boolean}> = ({x=150,y=650,scale=1,split=0,soft=0,shine=.6,window=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <defs><linearGradient id="choc-top" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#A27759"/><stop offset=".20" stopColor="#76492F"/><stop offset=".55" stopColor="#4B2B20"/><stop offset="1" stopColor="#362019"/></linearGradient><linearGradient id="choc-front"><stop stopColor="#392019"/><stop offset="1" stopColor="#613623"/></linearGradient><filter id="choc-shadow"><feGaussianBlur stdDeviation="23"/></filter></defs>
 <ellipse cx="380" cy="360" rx="340" ry="65" fill="#493242" opacity=".16" filter="url(#choc-shadow)"/>
 {[{x:0,w:195,move:0},{x:195,w:383,move:split*16}].map((part,i)=>{const base=tile(part.x,0,part.w,458,18);return <g key={`base-${i}`} transform={`translate(${part.move} 0)`}><polygon points={polygon(base.front)} fill="url(#choc-front)"/><polygon points={polygon(base.right)} fill="#301B15"/><polygon points={polygon(base.top)} fill="#44271D"/></g>})}
 {[0,1,2].flatMap(row=>[0,1,2].map(col=>{const g=tile(col*195,row*155,188,148,52);const dx=col>0?split*16:0;return <g key={`${row}-${col}`} transform={`translate(${dx} ${soft*Math.sin(col*1.2)*35}) rotate(${col>0?-split*2:0} ${col*175} 180)`}>
  <polygon points={polygon(g.front)} fill="url(#choc-front)"/><polygon points={polygon(g.right)} fill="#301B15"/><polygon points={polygon(g.top)} fill="url(#choc-top)" stroke="#683F2A" strokeWidth="2"/>
  <polygon points={polygon(tile(col*195+13,row*155+12,162,121,53).top)} fill="none" stroke="#B68761" strokeWidth="2" opacity=".20"/>
  <path d={`M ${project([col*195+23,row*155+12,53]).join(' ')} l 131 -30`} fill="none" stroke="#E4C1A0" opacity={shine*.35} strokeWidth="3"/>
  {window&&row===1&&col===1?<polygon points={polygon(tile(col*195+22,row*155+20,145,105,54).top)} fill="#C8A886" stroke="#311E19" strokeWidth="5"/>:null}
 </g>}))}
 {split>0?<path d="M 177 77 L 186 126 L 176 155 L 199 186 L 205 221 L 222 263 L 233 300" stroke="#DAC0A4" strokeWidth={split*5} fill="none" opacity={.7}/>:null}
</g>;
export const ingredientPositions=Array.from({length:18},(_,i)=>({x:160+(i%6)*131+(i%2)*13,y:775+Math.floor(i/6)*125+(i%3)*13,sugar:i%3===0}));
export const Solids:React.FC=()=> <g data-scientific-role="retained-sugar-cocoa-solids">{ingredientPositions.map((p,i)=><path key={i} d={`M${p.x} ${p.y-16} l19 7 7 18 -15 17 -20 -6 -7 -22Z`} fill={p.sugar?'#ECE3D7':'#543425'} stroke={p.sugar?'#A88668':'#3D251C'} strokeWidth="3"/>)}</g>;
/** Domain network depicts a larger scale than the packing tokens, not atomic geometry. */
export const CrystalNetwork:React.FC<{order:number;variant?:boolean}>=({order,variant=false})=><g data-scientific-role="larger-fat-crystal-network" opacity={order}>
 {Array.from({length:12},(_,i)=>{const x=195+(i%4)*203;const y=765+Math.floor(i/4)*155;return <g key={i} transform={`translate(${x} ${y}) rotate(${variant?(i*41)%90-35:(i%3-1)*12})`}>
  <path d="M-40 -19 L-16 -35 L43 -17 L35 26 L-25 34Z" fill="#E5C29E" stroke="#AA835C" strokeWidth="3"/>
  {[-12,0,12].map(t=><path key={t} d={`M-21 ${t} h43`} stroke="#A37952" strokeWidth="2" opacity=".6"/>)}
 </g>})}
 {[[195,765,398,765],[398,765,601,765],[601,765,804,765],[195,920,398,920],[398,920,601,920],[601,920,804,920],[195,1075,398,1075],[398,1075,601,1075],[601,1075,804,1075],[195,765,195,920],[398,765,398,920],[601,920,601,1075],[804,920,804,1075]].map((p,i)=><line key={i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke="#A98059" strokeWidth="10" opacity={variant&&i%3===0?.1:.5}/>)}
</g>;
