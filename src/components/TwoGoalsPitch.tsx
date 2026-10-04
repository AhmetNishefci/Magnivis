/** Original schematic: positions, paths and colors do not claim archival accuracy. */
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
const coral='#F3A17F',mint='#AEDAC5',ivory='#F4EEE1';
const Player=({x,y,team}:{x:number;y:number;team:'B'|'G'})=><g transform={`translate(${x} ${y})`}><ellipse cy={8} rx={23} ry={10} fill="#000" opacity={.25}/><circle r={19} fill={team==='B'?coral:mint} stroke={ivory} strokeWidth={2}/><text y={6} textAnchor="middle" fontFamily="Manrope" fontSize={18} fontWeight={600} fill="#132A25">{team}</text></g>;
const Ball=({x,y}:{x:number;y:number})=><g transform={`translate(${x} ${y})`}><circle r={12} fill={ivory} stroke="#172A24" strokeWidth={2}/><path d="M0 -6 L6 -2 L4 5 L-4 5 L-6 -2Z" fill="#21382E"/></g>;
export const TwoGoalsPitch=({index,p,phase}:{index:number;p:number;phase:string})=>{
 const isBoth=index===0&&p>.52||index===9||index===10||index===11;
 const own=index===6||index===0&&p<=.52;
 const winner=index===12;
 const hypothetical=index===8;
 const secondHypothesis=phase.includes('own goal')||phase.includes('loses')||phase.includes('only one')||phase.includes('still enough');
 const t=smooth(hypothetical?secondHypothesis?(p-.36)/.4:p/.32:own?index===0?p/.48:p/.42:winner?p*2.3:p);
 const bx=own?370-(1-t)*45:winner?365+Math.sin(t*Math.PI)*50:hypothetical?370:370+Math.sin(p*Math.PI)*18;
 const by=own?185-125*t:winner?340+295*t:hypothetical?secondHypothesis?520+120*t:200-140*t:350;
 const emphasizeTop=isBoth||own||hypothetical&&!secondHypothesis;
 const emphasizeBottom=isBoth||winner||hypothetical&&secondHypothesis;
 const zoom=index===0?1+.25*(1-smooth((p-.48)/.16)):1;
 return <svg data-critical="scene" style={{position:'absolute',left:125,top:495,width:735,height:720}} viewBox={`${(735-735/zoom)/2} 0 ${735/zoom} ${720/zoom}`}>
 <defs><linearGradient id="two-turf" x2="0" y2="1"><stop stopColor="#245244"/><stop offset="1" stopColor="#12372E"/></linearGradient><radialGradient id="two-light"><stop stopColor="#B8E4C0" stopOpacity=".12"/><stop offset="1" stopColor="#B8E4C0" stopOpacity="0"/></radialGradient></defs>
 <rect x={52} y={53} width={631} height={594} rx={26} fill="#0A211B"/><rect x={82} y={78} width={571} height={540} rx={3} fill="url(#two-turf)"/>
 {Array.from({length:9},(_,i)=><rect key={i} x={84} y={79+i*60} width={568} height={30} fill="#DBE9CB" opacity={.025}/>)}
 <ellipse cx={365} cy={240} rx={350} ry={340} fill="url(#two-light)"/>
 <g stroke="#D9E6D2" strokeWidth={2.5} opacity={.72} fill="none"><rect x={82} y={78} width={571} height={540}/><path d="M82 348 H653"/><circle cx={368} cy={348} r={67}/><circle cx={368} cy={348} r={3} fill="#D9E6D2"/><path d="M214 78 V176 H522 V78 M290 78 V114 H446 V78 M214 618 V520 H522 V618 M290 618 V582 H446 V618"/></g>
 <g fill="none" stroke={ivory} strokeWidth={3}><path d="M298 78 V50 H438 V78 M298 618 V646 H438 V618"/></g>
 {[0,1,2,3,4,5,6].map(i=><g key={i} stroke={ivory} strokeOpacity={.25}><path d={`M${300+i*23} 52 V77 M${300+i*23} 619 V644`}/><path d={`M300 ${54+i*3.5} H436 M300 ${620+i*3.5} H436`}/></g>)}
 <text x={368} y={30} fill={coral} fontSize={26} fontWeight={600} textAnchor="middle">BARBADOS’ GOAL</text><text x={368} y={688} fill={mint} fontSize={26} fontWeight={600} textAnchor="middle">GRENADA’S GOAL</text>
 {emphasizeTop&&<rect x={281} y={40} width={175} height={48} rx={8} stroke={coral} strokeWidth={4} fill={coral} fillOpacity={.12}/>} {emphasizeBottom&&<rect x={281} y={609} width={175} height={48} rx={8} stroke={isBoth?coral:mint} strokeWidth={4} fill={mint} fillOpacity={.12}/>}
 {isBoth?<><Player x={334} y={128} team="B"/><Player x={402} y={550} team="B"/><Player x={300+30*Math.sin(p*4)} y={230} team="G"/><Player x={440-30*Math.sin(p*4)} y={460} team="G"/><path d="M364 275 V180 M364 420 V510" fill="none" stroke={mint} strokeWidth={3} strokeDasharray="7 8"/><text x={366} y={374} textAnchor="middle" fill={ivory} fontSize={31} fontWeight={600}>BOTH ENDS</text></>:<><Player x={own?320:310} y={own?190:385} team="B"/><Player x={420} y={435} team="G"/><Player x={330} y={490} team="G"/>{!own&&<Player x={370} y={132} team="B"/>}</>}
 {!isBoth&&<Ball x={bx} y={by}/>}
 {own&&<path d="M340 174 Q370 140 370 86" fill="none" stroke={coral} strokeWidth={4} strokeDasharray="5 8" opacity={.55}/>}
 {hypothetical&&<g><rect x={125} y={275} width={485} height={145} rx={12} fill="#102C26" stroke={mint} strokeOpacity={.4}/><text x={368} y={315} textAnchor="middle" fontSize={23} fill={mint}>POSSIBLE FULL-TIME RESULT</text><text x={368} y={357} textAnchor="middle" fontSize={32} fill={ivory} fontWeight={600}>{secondHypothesis?'BARBADOS 3–2 GRENADA':'BARBADOS 2–3 GRENADA'}</text><text x={368} y={396} textAnchor="middle" fontSize={27} fill={mint}>GRENADA QUALIFIES</text></g>}
 {(index===4||index===5)&&<g><rect x={135} y={264} width={465} height={177} rx={16} fill="#102C26" stroke={ivory} strokeOpacity={.3}/><text x={368} y={307} textAnchor="middle" fontSize={27} fill={mint}>EXTRA-TIME WINNER</text><text x={368} y={372} textAnchor="middle" fontSize={38} fontWeight={600} fill={ivory}>1 GOAL → COUNTS AS 2</text><text x={368} y={415} textAnchor="middle" fontSize={25} fill={ivory}>MATCH ENDS AT THAT GOAL</text></g>}
 {index===13&&<g><rect x={146} y={260} width={443} height={180} rx={15} fill="#102C26" stroke={coral} strokeOpacity={.5}/><text x={368} y={321} textAnchor="middle" fontSize={40} fill={ivory} fontWeight={600}>WRONG GOAL.</text><text x={368} y={381} textAnchor="middle" fontSize={40} fill={coral} fontWeight={600}>RIGHT MOVE.</text></g>}
 </svg>;
};
