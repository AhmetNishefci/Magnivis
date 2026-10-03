import type {ReactNode} from 'react';
/** Original qualitative artwork. Gap and time are deliberately not calibrated. */
export const ThermalDefs=()=> <defs>
 <linearGradient id="steel" x1="0" x2="0.8" y1="0" y2="1"><stop offset="0" stopColor="#B7C1C4"/><stop offset=".24" stopColor="#536268"/><stop offset=".55" stopColor="#78878A"/><stop offset="1" stopColor="#25333A"/></linearGradient>
 <radialGradient id="water" cx=".33" cy=".24" r=".8"><stop stopColor="#EFFAFF" stopOpacity=".85"/><stop offset=".18" stopColor="#ADCEDB" stopOpacity=".5"/><stop offset=".65" stopColor="#325969" stopOpacity=".75"/><stop offset="1" stopColor="#98D2E0" stopOpacity=".95"/></radialGradient>
 <linearGradient id="vapor" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#C7E9EF" stopOpacity=".05"/><stop offset=".5" stopColor="#DDF9FF" stopOpacity=".25"/><stop offset="1" stopColor="#F5C888" stopOpacity=".06"/></linearGradient>
 <marker id="heat-arrow" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L10 6 L1 11" fill="none" stroke="#E9B476" strokeWidth="2"/></marker>
</defs>;
export const Metal=({x=145,y=935,width=690}:{x?:number;y?:number;width?:number})=><g>
 <path d={`M${x} ${y} H${x+width} L${x+width-28} ${y+65} H${x+15} Z`} fill="url(#steel)"/>
 {Array.from({length:15},(_,i)=><path key={i} d={`M${x+14+i%3*7} ${y+5+i*3.1} H${x+width-18-i%5*11}`} stroke={i%3?'#D7E0E2':'#263E48'} strokeOpacity={.12} strokeWidth={1}/>)}
 <path d={`M${x} ${y} H${x+width}`} stroke="#D6E3E7" strokeWidth={3}/>
 <path d={`M${x+10} ${y+65} H${x+width-27}`} stroke="#E8B178" strokeOpacity={.7} strokeWidth={3}/>
</g>;
export const Water=({x=490,baseY=845,width=400,height=255,time=0}:{x?:number;baseY?:number;width?:number;height?:number;time?:number})=>{
 const sway=Math.sin(time*2)*2;
 return <g transform={`translate(${sway} 0)`}>
 <ellipse cx={x} cy={baseY+14} rx={width*.42} ry={10} fill="#D4F2FC" opacity={.12}/>
 <path d={`M${x-width/2} ${baseY} C${x-width*.6} ${baseY-height*.3} ${x-width*.4} ${baseY-height} ${x} ${baseY-height} C${x+width*.4} ${baseY-height} ${x+width*.6} ${baseY-height*.3} ${x+width/2} ${baseY} Q${x} ${baseY+height*.05} ${x-width/2} ${baseY} Z`} fill="url(#water)" stroke="#CCEAF2" strokeOpacity={.8} strokeWidth={2}/>
 <path d={`M${x-width*.31} ${baseY-height*.39} Q${x-width*.3} ${baseY-height*.76} ${x-width*.07} ${baseY-height*.83}`} fill="none" stroke="#E6F7FD" strokeWidth={5} strokeLinecap="round" opacity={.85}/>
 </g>;
};
export const Steam=({x=490,y,time=0,spread=180}:{x?:number;y:number;time?:number;spread?:number})=><g>{Array.from({length:7},(_,i)=>{const p=(time*.35+i/7)%1;return <path key={i} d={`M${x+(i-3)*spread/6} ${y-p*100} q${Math.sin(time+i)*16} -20 0 -40`} stroke="#CBE3EB" strokeOpacity={(1-p)*.25} strokeWidth={3} fill="none"/>;})}</g>;
export const SceneLabel=({x=490,y,children,size=35,color='#DDE9ED',anchor='middle'}:{x?:number;y:number;children:ReactNode;size?:number;color?:string;anchor?:'middle'|'start'})=><text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={600} fill={color}>{children}</text>;
export const PairedDrops=({time=0}:{time?:number})=>{
 const spread=Math.min(1,time/.55),evap=Math.max(0,Math.min(1,(time-.55)/2.5));
 return <g>
 <SceneLabel x={160} y={465} anchor="start" size={37}>Hot • direct contact</SceneLabel>
 <Metal y={690}/>{evap<1&&<Water x={490} baseY={690} width={(270+spread*180)*(1-evap)} height={(180-spread*80)*(1-evap)} time={time}/>}<Steam y={610} time={time}/>
 <SceneLabel x={160} y={860} anchor="start" size={37} color="#F3CC99">Hotter • vapor cushion</SceneLabel>
 <Metal y={1130}/><Water x={490} baseY={1083} width={270} height={180} time={time}/>
 <rect x={350} y={1090} width={280} height={37} fill="url(#vapor)"/>
 {[0,1,2,3].map(i=><path key={i} d={`M${355+i*8} ${1097+i*8} Q490 ${1087+i*8} 625 ${1097+i*8}`} stroke="#D9F2F6" strokeOpacity={.35} strokeWidth={2} fill="none"/>)}
</g>;
};
