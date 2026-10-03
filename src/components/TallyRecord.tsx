/** Original qualitative matching-record illustration; no authentic monetary value. */
export const TallyRecord=({split=0,x=170,y=690,scale=1}:{split?:number;x?:number;y?:number;scale?:number})=>{
 const edge='0 53 L48 58 L96 49 L156 57 L210 51 L267 61 L320 54 L383 59 L439 50 L500 56 L560 48 L640 55';
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <defs><linearGradient id="tallyWood" x2="0" y2="1"><stop stopColor="#D7A56C"/><stop offset="1" stopColor="#895138"/></linearGradient></defs>
 <g transform={`translate(0 ${-split*82})`}><path d={`M0 4 Q320 -11 640 0 L640 55 L560 48 L500 56 L439 50 L383 59 L320 54 L267 61 L210 51 L156 57 L96 49 L48 58 L0 53 Z`} fill="url(#tallyWood)" stroke="#E7BA88" strokeWidth={3}/>{[78,160,280,370,490,558].map((p,i)=><path key={p} d={`M${p} 2 L${p-5} 21 L${p+4} 39 L${p} 53`} fill="none" stroke="#3E231F" strokeWidth={i===2?13:6}/>)}</g>
 <g transform={`translate(0 ${split*82})`}><path d={`M${edge} L640 110 Q320 122 0 112 Z`} fill="url(#tallyWood)" stroke="#E7BA88" strokeWidth={3}/>{[78,160,280,370,490,558].map((p,i)=><path key={p} d={`M${p} 56 L${p+4} 75 L${p-5} 95 L${p} 112`} fill="none" stroke="#3E231F" strokeWidth={i===2?13:6}/>)}</g>
 {[19,32,77,93].map(v=><path key={v} d={`M12 ${v+(v>50?split*82:-split*82)} Q190 ${v-10+(v>50?split*82:-split*82)} 360 ${v+2+(v>50?split*82:-split*82)} T628 ${v+(v>50?split*82:-split*82)}`} fill="none" stroke="#F0CDA0" opacity={.19} strokeWidth={2}/>)}
 </g>;
};
