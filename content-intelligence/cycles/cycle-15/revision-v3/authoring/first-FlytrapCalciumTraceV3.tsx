import React from 'react';
// Authored marks encode relative retained/accumulated state; not molecule positions or a cell map.
const seed=(i:number)=>{const x=Math.sin(i*127.1+43.7)*43758.5453;return x-Math.floor(x);};
const marks=Array.from({length:380},(_,i)=>({x:55+seed(i+1)*970,y:420+seed(i+601)*900,phase:seed(i+1001),radius:2+seed(i+1401)*4}));
export const FlytrapCalciumTraceV3:React.FC<{calcium:number;residue:number;macro:boolean;signal:number}>=({calcium,residue,macro,signal})=> <svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
 <defs><clipPath id="leaf-state-mask"><path d={macro?'M0 445 Q440 440 1080 990 L1080 1370 Q500 1330 0 965Z':'M48 400 Q400 280 551 1168 L270 1245 Q20 1000 48 400Z M575 1180 Q600 810 1050 520 L1020 1030 Q915 1240 575 1180Z'}/></clipPath></defs>
 <g clipPath="url(#leaf-state-mask)">{marks.map((m,i)=>{const local=calcium>m.phase?Math.min(1,(calcium-m.phase)*8):0;const retained=residue>m.phase;return <circle key={i} cx={m.x} cy={m.y} r={m.radius*(1+.2*local)} fill={retained?'#e2aa62':'#fff2c9'} opacity={local*.72}/>;})}
 {signal>0&&<path d={macro?'M390 930 Q520 990 810 1070':'M340 875 Q420 1090 805 960'} stroke="#fbf5da" strokeWidth="6" strokeDasharray="36 18" fill="none" opacity=".8"/>}</g>
 </svg>;
