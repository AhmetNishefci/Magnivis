import React from 'react';
import {colors,faces,branches,enumerate,type DieId} from '../production/dice-v4/model';
import {smooth} from '../production/dice-v4/choreography';
export const EvidenceText:React.FC<{x:number;y:number;size?:number;children:React.ReactNode;muted?:boolean}>=({x,y,size=40,children,muted=false})=><text data-critical="label" x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="600" fill={muted?'#D5C4AF':'#FFF6E5'} stroke="#160E09" strokeWidth=".6" paintOrder="stroke">{children}</text>;
export const FaceChip:React.FC<{id:DieId;value:number;x:number;y:number;angle?:number;active?:boolean;size?:number;outcome?:'win'|'loss'|undefined;opacity?:number}>=({id,value,x,y,angle=0,active=true,size=92,outcome,opacity=1})=>{const s=size/92,uid=`chip-${id}-${value}-${Math.round(x)}-${Math.round(y)}`;return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} opacity={opacity*(active?1:.53)} data-critical="face">
 <defs><linearGradient id={uid} x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".32"/><stop offset="1" stopColor="#18221D" stopOpacity=".2"/></linearGradient></defs>
 <ellipse cy="53" rx="56" ry="15" fill="#050302" opacity=".4"/>
 <path d="M-46 32L46 32L46 49Q43 56 36 56L-36 56Q-46 53 -46 45Z" fill="#493526"/>
 <rect x="-46" y="-46" width="92" height="92" rx="18" fill={colors[id]} stroke={outcome==='win'?'#D9EDD0':outcome==='loss'?'#DDB5A1':'#F0D9B9'} strokeWidth={outcome?4:1.7}/>
 <rect x="-43" y="-43" width="86" height="86" rx="15" fill={`url(#${uid})`}/>
 <text y="3" textAnchor="middle" dominantBaseline="central" fontSize="59" fontWeight="700" fill="#101A1D">{value}</text>
 {outcome&&<text y="89" textAnchor="middle" fontSize="30" fontWeight="700" fill={outcome==='win'?'#DCF0CD':'#F0BCAA'}>{outcome==='win'?'✓':'×'}</text>}
 </g>;};
export const SixFaceFanV4=({id,t,opponentValue,reverse=false}:{id:DieId;t:number;opponentValue:number;reverse?:boolean})=>{const k=smooth(t,.9,2.2);return <g>{faces[id].map((v,i)=>{const j=reverse?5-i:i,x=185+j*116,y=965+Math.pow(j-2.5,2)*17;return <FaceChip key={i} id={id} value={v} x={(reverse?660:650)+(x-(reverse?660:650))*k} y={1100+(y-1100)*k} angle={(-16+j*6)*k} size={106} active={true} outcome={t>2.3?(id==='orange'?(opponentValue>v?'win':'loss'):(v>opponentValue?'win':'loss')):undefined} opacity={k}/>;})}</g>;};
const FaceWheel=({id,cx,cy,indices,active,t}:{id:DieId;cx:number;cy:number;indices:number[];active:(value:number)=>boolean;t:number})=><g>{indices.map((index,i)=>{const a=(i*60-150)*Math.PI/180,r=157,k=smooth(t,.65,1.30),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;return <FaceChip key={index} id={id} value={faces[id][index]!} x={cx+(x-cx)*k} y={cy+(y-cy)*k} size={88} angle={Math.cos(a)*8} active={active(faces[id][index]!)} opacity={k}/>;})}</g>;
export const MixedProofV4=({kind,t}:{kind:'green'|'orange';t:number})=>{const b=branches[kind],green=kind==='green',second=t>3.50,summary=t>6.05,firstCount=enumerate(b.winner,b.opponent).filter(p=>p.win&&p.a===b.firstValue).length,secondCount=enumerate(b.winner,b.opponent).filter(p=>p.win&&p.a===b.secondValue).length,cx=green?685:285,cy=620;
 const winnerIndices=green?[3,4,5,0,1,2]:[4,5,0,1,2,3],opponentIndices=green?[0,1,2,3,4,5]:[0,1,2,3,4,5];
 const winCount=second?firstCount+secondCount:firstCount;const reveal=smooth(t,1.1,2.5);
 return <g>
 <FaceWheel id={b.winner} cx={green?310:670} cy={650} indices={winnerIndices} active={v=>summary||v===(second?b.secondValue:b.firstValue)} t={t}/>
 <FaceWheel id={b.opponent} cx={green?655:325} cy={1060} indices={opponentIndices} active={v=>summary||!second||v<b.secondValue} t={t}/>
 <g opacity={smooth(t,1.3,2.0)} data-critical="probability-beads">{Array.from({length:36},(_,i)=>{const a=(i*10-90)*Math.PI/180,win=i<winCount,known=summary||second||i<firstCount;return <circle key={i} cx={cx+Math.cos(a)*128} cy={cy+Math.sin(a)*128} r="9" fill={win?colors[b.winner]:known?'#C48975':'#706257'} opacity={win?reveal:.7} stroke="#F4D7AE" strokeOpacity=".2" strokeWidth="1.5"/>;})}
 <EvidenceText x={cx} y={cy-8} size={summary?48:42}>{summary?'24 / 36':second?`+ ${secondCount} wins`:`${firstCount} wins`}</EvidenceText>
 <EvidenceText x={cx} y={cy+47} size={summary?38:30}>{summary?'2 / 3':second?`${firstCount} counted`:'36 pairs'}</EvidenceText>
 </g>
 <g opacity={smooth(t,1.1,1.8)}><EvidenceText x={green?310:670} y={900} size={39}>{summary?(green?'6 green faces':'6 orange faces'):green?(second?'3 ones':'3 fives'):(second?'4 twos':'2 sixes')}</EvidenceText></g>
 <g opacity={smooth(t,1.2,1.9)}><EvidenceText x={green?655:325} y={1310} size={37}>{summary?(green?'6 blue faces':'6 green faces'):second?(green?'2 blue zeros':'3 green ones'):(green?'all 6 blue faces':'all 6 green faces')}</EvidenceText></g>
 {second&&<g opacity={smooth(t,3.5,4.3)}><EvidenceText x={cx} y={805} size={34}>{green?'1 < 4':'2 < 5'} · 12 losses</EvidenceText></g>}
 </g>;};
