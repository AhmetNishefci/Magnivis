import React from 'react';
// Authored marks encode relative retained/accumulated state; not molecule positions or a cell map.
const seed=(i:number)=>{const x=Math.sin(i*127.1+43.7)*43758.5453;return x-Math.floor(x);};
const marks=Array.from({length:380},(_,i)=>({x:55+seed(i+1)*970,y:420+seed(i+601)*900,phase:seed(i+1001),radius:2+seed(i+1401)*4}));
export const FlytrapCalciumTraceV3:React.FC<{calcium:number;residue:number;macro:boolean;signal:number}>=({calcium,residue,macro,signal})=> <svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
 <defs><clipPath id="leaf-state-mask"><path d={macro?'M0 520 Q440 510 1080 1020 L1080 1260 Q540 1170 0 780Z':'M125 390 Q325 310 435 720 L485 995 Q280 1050 90 940 L45 600Z M545 980 Q635 690 935 585 L920 995 Q805 1135 570 1060Z'}/></clipPath></defs>
 <g clipPath="url(#leaf-state-mask)">{marks.map((m,i)=>{const local=calcium>m.phase?Math.min(1,(calcium-m.phase)*8):0;const retained=residue>m.phase;return <circle key={i} cx={m.x} cy={m.y} r={m.radius*(1+.2*local)} fill={retained?'#e2aa62':'#fff2c9'} opacity={local*.72}/>;})}
 {signal>0&&<path d={macro?'M390 930 Q520 990 810 1070':'M340 875 Q420 1090 805 960'} stroke="#fbf5da" strokeWidth="6" strokeDasharray="36 18" fill="none" opacity=".8"/>}</g>
 </svg>;
