/** Original schematic surfaces. Marks are illustrative; no research pixels or text. */
export const ScrollDefs=()=> <defs>
 <linearGradient id="charcoal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#555B5B"/><stop offset=".45" stopColor="#22292C"/><stop offset="1" stopColor="#101B21"/></linearGradient>
 <linearGradient id="digital-sheet" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#E3E8E8"/><stop offset="1" stopColor="#CCD4D6"/></linearGradient>
 <filter id="material-shadow"><feGaussianBlur stdDeviation="15"/></filter>
</defs>;
export const ClosedScroll=({x=490,y=750,scale=1}:{x?:number;y?:number;scale?:number})=> <g transform={`translate(${x} ${y}) scale(${scale})`}>
 <ellipse cx={0} cy={125} rx={285} ry={30} fill="#293A40" opacity={.12} filter="url(#material-shadow)"/>
 <path d="M-275 -90 L175 -118 Q250 -85 285 0 Q258 75 175 112 L-260 91 Q-302 12 -275 -90" fill="url(#charcoal)"/>
 {Array.from({length:18},(_,i)=><path key={i} d={`M${-240+i*27} -85 l${11+Math.sin(i)*9} 56 l-17 34 l22 62`} fill="none" stroke={i%2?'#69716D':'#0F171B'} opacity={.24} strokeWidth={2}/>)}
 <ellipse cx={-265} cy={0} rx={58} ry={96} fill="#1D2428"/>
 {[0,1,2,3,4,5].map(i=><ellipse key={i} cx={-265+i*2} cy={0} rx={52-i*7} ry={88-i*12} fill="none" stroke="#69716B" strokeWidth={2} opacity={.5}/>)}
</g>;
export const SliceLayers=({highlight=0,progress=1}:{highlight?:number;progress?:number})=> <g>
 {[0,1,2,3,4,5,6].map(i=><path key={i} d={Array.from({length:110},(_,j)=>{const t=j/109*Math.PI*2,r=290-i*29+12*Math.sin(t*3+i);return `${j?'L':'M'}${490+Math.cos(t)*r} ${810+Math.sin(t)*r*.75}`;}).join(' ')+' Z'} stroke={i===highlight?'#C44C35':'#A9B3B6'} strokeWidth={i===highlight?7:3} strokeDasharray={i===highlight?'1400':'none'} strokeDashoffset={i===highlight?(1-progress)*1400:0} fill="none"/>) }
</g>;
export const DigitalSurface=({flatten=0,ink=true,scale=1,x=0,y=0}:{flatten?:number;ink?:boolean;scale?:number;x?:number;y?:number})=>{
 const point=(u:number,v:number)=>({x:135+710*u,y:620+360*v+(1-flatten)*(120*Math.sin(u*Math.PI*2)+75*u)});
 const polygon=(u:number,v:number,du:number,dv:number)=>[[u,v],[u+du,v],[u+du,v+dv],[u,v+dv]].map(([a,b])=>{const p=point(a!,b!);return `${p.x},${p.y}`;}).join(' ');
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <polygon points={Array.from({length:41},(_,i)=>point(i/40,0)).concat(Array.from({length:41},(_,i)=>point(1-i/40,1))).map(p=>`${p.x},${p.y}`).join(' ')} fill="url(#digital-sheet)" stroke="#A7B4B9" strokeWidth={2}/>
  {Array.from({length:13},(_,i)=><path key={i} d={Array.from({length:41},(_,j)=>{const p=point(j/40,i/12);return `${j?'L':'M'}${p.x} ${p.y}`;}).join(' ')} fill="none" stroke="#B4C1C5" strokeWidth={1}/>)}
  {Array.from({length:21},(_,i)=><path key={i} d={Array.from({length:21},(_,j)=>{const p=point(i/20,j/20);return `${j?'L':'M'}${p.x} ${p.y}`;}).join(' ')} fill="none" stroke="#B4C1C5" strokeWidth={1}/>)}
  <path d={Array.from({length:41},(_,i)=>{const p=point(i/40,0);return `${i?'L':'M'}${p.x} ${p.y}`;}).join(' ')} fill="none" stroke="#C44C35" strokeWidth={6}/>
  {ink&&Array.from({length:6},(_,row)=>Array.from({length:17},(_,col)=><polygon key={`${row}-${col}`} points={polygon(.04+col*.054,.12+row*.13,.019+(col%3)*.005,.028)} fill="#24363E" opacity={.65+(col%3)*.1}/>))}
 </g>;
};
export const ScrollLabel=({children,x=120,y=390,size=33,color='#26373E'}:{children:React.ReactNode;x?:number;y?:number;size?:number;color?:string})=><text x={x} y={y} fontFamily="Manrope" fontSize={size} fill={color}>{children}</text>;
