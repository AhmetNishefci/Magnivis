import type {ReactNode} from 'react';
const cyan='#83DBD7',amber='#E8B679',ivory='#EAE8DB';
export const BenchLabel=({x,y,children,size=27,color=ivory}:{x:number;y:number;children:ReactNode;size?:number;color?:string})=><text x={x} y={y} fill={color} fontFamily="Manrope" fontSize={size}>{children}</text>;
export const OpticalDefs=()=> <defs>
 <linearGradient id="mount" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#59605A"/><stop offset=".45" stopColor="#ADB1A1"/><stop offset=".55" stopColor="#555D56"/><stop offset="1" stopColor="#222B28"/></linearGradient>
 <radialGradient id="lens"><stop stopColor="#294A46"/><stop offset=".7" stopColor="#172C2B"/><stop offset="1" stopColor="#080F12"/></radialGradient>
 <radialGradient id="lit"><stop stopColor="#EFFEF7"/><stop offset=".18" stopColor={cyan}/><stop offset=".6" stopColor="#237D78"/><stop offset="1" stopColor="#0F2527"/></radialGradient>
</defs>;
const Mount=({x,y,split=false}:{x:number;y:number;split?:boolean})=><g transform={`translate(${x},${y})`}>
 <rect x={-31} y={-31} width={62} height={62} rx={6} fill="url(#mount)" stroke="#AAB6A3" strokeWidth={1}/>
 <path d="M-24 24 L24 -24" stroke={split?'#B4DED9':'#ECE9C8'} strokeWidth={split?7:11} strokeOpacity={split?.72:1}/>
 <circle cx={-20} cy={-20} r={3} fill="#111F20"/><circle cx={20} cy={20} r={3} fill="#111F20"/>
</g>;
const Detector=({x,y,lit,label,vertical=false}:{x:number;y:number;lit:boolean;label:string;vertical?:boolean})=><g transform={`translate(${x},${y})`}>
 <rect x={-52} y={-52} width={104} height={104} rx={14} fill="#15211F" stroke={lit?cyan:'#616B5F'} strokeWidth={2}/>
 <circle r={35} fill={lit?'url(#lit)':'url(#lens)'} stroke="#718477" strokeWidth={2}/>
 <circle r={42} fill="none" stroke={lit?cyan:'#2B3631'} strokeWidth={1} opacity={lit?.7:1}/>
 <BenchLabel x={vertical?-440:-120} y={vertical?-8:90} size={26}>{label}</BenchLabel>
</g>;
/** Authored ideal topology. Lines denote alternatives, never measured photon trajectories. */
export const OpticalBench=({blocked,darkClick=false,brightClick=false,absorbed=false,progress=0}:{blocked:boolean;darkClick?:boolean;brightClick?:boolean;absorbed?:boolean;progress?:number})=> <g>
 <path d="M140 860 H250 V570 H610 V415 M250 860 H610 V570 H810" stroke="#56605A" strokeWidth={4} fill="none"/>
 <path d="M250 860 V570 H610" stroke={cyan} strokeWidth={5} strokeOpacity={blocked?.2:.8} fill="none"/>
 <path d="M250 860 H610 V570" stroke={amber} strokeWidth={5} strokeOpacity={.8} fill="none"/>
 <path d="M610 570 V467" stroke={darkClick?cyan:'#37423C'} strokeWidth={darkClick?7:3}/>
 <path d="M610 570 H758" stroke={brightClick?amber:'#4C5449'} strokeWidth={brightClick?7:3}/>
 <rect x={126} y={832} width={54} height={56} rx={9} fill="#46514A" stroke="#8A9586"/><circle cx={153} cy={860} r={12} fill={cyan}/>
 <BenchLabel x={125} y={944} size={27}>One photon</BenchLabel>
 <Mount x={250} y={860} split/><Mount x={250} y={570}/><Mount x={610} y={860}/><Mount x={610} y={570} split/>
 <BenchLabel x={344} y={546} size={25} color={cyan}>Path A</BenchLabel><BenchLabel x={365} y={913} size={25} color={amber}>Path B</BenchLabel>
 {blocked&&<g><rect x={215} y={682} width={70} height={72} rx={5} fill="#3A211F" stroke="#D49071" strokeWidth={2}/><path d="M220 700 L279 739 M220 719 L258 746" stroke="#925B46" strokeWidth={3}/>{absorbed&&<circle cx={250} cy={718} r={18+progress*8} fill="#E79B70" opacity={.5}/>}<BenchLabel x={315} y={734} size={26} color="#E9B996">Absorber</BenchLabel></g>}
 <Detector x={610} y={415} lit={darkClick} label={darkClick?'Dark output • click':'Dark output'} vertical/>
 <Detector x={810} y={570} lit={brightClick} label="Bright output"/>
</g>;
const wave=(y:number,inverted=false)=>Array.from({length:101},(_,i)=>`${i===0?'M':'L'}${180+i*3.3} ${y+(inverted?-1:1)*Math.sin(i/100*Math.PI*4)*20}`).join(' ');
export const AmplitudeInset=({blocked=false}:{blocked?:boolean})=> <g>
 <BenchLabel x={145} y={1030} size={27}>At the dark output</BenchLabel>
 <path d="M165 1090 H535" stroke="#46544E"/>
 <path d={wave(1090)} stroke={cyan} strokeWidth={4} fill="none" opacity={blocked?.15:1}/>
 <path d={wave(1090,true)} stroke={amber} strokeWidth={4} fill="none"/>
 <BenchLabel x={560} y={1102} size={35} color={ivory}>=</BenchLabel>
 <path d={blocked?wave(1090,true):'M620 1090 H825'} transform={blocked?'translate(498 0) scale(.68 1)':undefined} stroke={blocked?amber:ivory} strokeWidth={4} fill="none"/>
 <BenchLabel x={145} y={1187} size={27} color="#B3C5B9">{blocked?'One contribution removed':'Opposed contributions cancel'}</BenchLabel>
</g>;
