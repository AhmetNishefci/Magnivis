import {FlipHull} from './FlipHull';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const ink='#163F55',paper='#F4EFE1',accent='#EFB46F';
const Label=({x,y,children,light=false,size=36}:{x:number;y:number;children:string;light?:boolean;size?:number})=><text x={x} y={y} fill={light?paper:ink} fontSize={size} fontWeight={600}>{children}</text>;
/** Video-specific visual choreography; all motion amplitudes are qualitative models. */
export const FlipOceanWorld=({index,t,duration,globalTime}:{index:number;t:number;duration:number;globalTime:number})=>{
 const p=clamp(t/Math.max(.1,duration)),reveal=smooth((p-.06)/.70);
 const rotating=index===3||index===9;
 const turn=index===3?smooth((p-.51)/.47):index===9?1-smooth((p-.47)/.48):1;
 const scale=rotating?.76+.24*turn:1;
 const sea=rotating?320-92*turn:228;
 const residual=index===8||index===10;
 const bob=(index===7||residual)?Math.sin(globalTime*.86)*4:Math.sin(globalTime*.65)*2;
 const drift=residual?Math.sin(globalTime*.23)*9:0;
 const tilt=residual?Math.sin(globalTime*.61)*1.3:0;
 const cx=355+drift,cy=sea+270*turn+bob;
 const angle=-90*turn+tilt;
 const fill=index===3?smooth((p-.43)/.45):index===9?1-smooth((p-.28)/.50):1;
 const waveAmp=index>=6?14:7;
 const wavePoints=Array.from({length:76},(_,i)=>{const x=i*10;return `${i?'L':'M'}${x} ${sea+Math.sin(x*.023-globalTime*1.25)*waveAmp}`;}).join(' ');
 const sensorX=340+Math.sin(globalTime*.7)*18,sensorY=500+Math.sin(globalTime*1.4)*14;
 return <svg data-critical="scene" style={{position:'absolute',left:120,top:380,width:750,height:920,overflow:'hidden'}} viewBox="0 0 750 920" aria-label="Original explanatory FLIP ocean model">
 <defs><linearGradient id="flip-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#F0EFE5"/><stop offset="1" stopColor="#C4DBDE"/></linearGradient><linearGradient id="flip-sea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2F758A"/><stop offset=".42" stopColor="#1E506B"/><stop offset="1" stopColor="#102F4B"/></linearGradient><clipPath id="flip-world"><rect width={750} height={920} rx={18}/></clipPath></defs>
 <g clipPath="url(#flip-world)">
  <rect width={750} height={920} fill="url(#flip-sky)"/>
  <path d={`${wavePoints}L750 920H0Z`} fill="url(#flip-sea)"/>
  <path d={wavePoints} fill="none" stroke="#DDEDE7" strokeWidth={3}/>
  {/* Small surface reference is schematic, with no claimed scale or measured sea state. */}
  {[0,3,4,10].includes(index)&&<g transform={`translate(94 ${sea-7+Math.sin(globalTime*1.1)*5})`}>
   <path d="M-50-10H48L31 9H-35Z" fill="#E5E8DD" stroke={ink} strokeWidth={3}/><path d="M-13-10V-29H22V-10M7-29V-46" fill="#D8CDBB" stroke={ink} strokeWidth={3}/>
  </g>}
  {index===1?<g>
   <Label x={44} y={62} size={40}>A moving reference</Label>
   <path d="M86 420H652" stroke="#BDE2E4" strokeWidth={2} strokeDasharray="10 12"/>
   <circle cx={sensorX} cy={sensorY} r={47} fill="#D6DED4" stroke="#183D51" strokeWidth={4}/>
   <circle cx={sensorX} cy={sensorY} r={16} fill={accent}/>
   <path d={`M${sensorX} ${sensorY}L${sensorX+230} ${sensorY-86+Math.sin(globalTime)*52}`} stroke={accent} strokeWidth={4}/>
   {[70,120,170].map((r)=><path key={r} d={`M${sensorX+r*.6} ${sensorY-r*.8}Q${sensorX+r*1.2} ${sensorY} ${sensorX+r*.6} ${sensorY+r*.8}`} stroke="#BCD8D8" strokeWidth={2} fill="none" opacity={.6}/>)}
   <Label x={90} y={725} light size={40}>Instrument motion</Label>
   <Label x={90} y={789} light size={40}>or ocean change?</Label>
  </g>:index===2?<g>
   <Label x={42} y={62} size={40}>Underwater sound</Label>
   {[0,1,2].map(i=><path key={i} d={`M${65+i*75} 358Q${160+i*75} 494 ${65+i*75} 628`} fill="none" stroke="#96CED1" strokeWidth={2} opacity={.7}/>)}
   <path d="M85 522H650" stroke="#BADEDC" strokeWidth={2} strokeDasharray="8 10"/>
   <g transform={`translate(363 522) rotate(${Math.sin(globalTime)*5})`}>
    <path d="M-220-45H174Q233-43 238 0Q225 45 174 45H-220L-254 0Z" fill="#C6D5CD" stroke="#173D50" strokeWidth={4}/>
    <path d="M-22-44V-77H76V-43M11-78V-115M32-80V-109" fill="#93AEA9" stroke="#183D50" strokeWidth={4}/>
    <path d="M-161 66H161M-161 54V78M161 54V78" stroke={accent} strokeWidth={5}/><circle cx={-161} cy={66} r={9} fill={accent}/><circle cx={161} cy={66} r={9} fill={accent}/>
    <path d="M0 0L252-47" stroke={accent} strokeWidth={3} strokeDasharray="6 9"/>
   </g>
   <Label x={68} y={765} light size={40}>Turning changes the reference</Label>
  </g>:<g>
   <g data-critical="hull" transform={`translate(${cx} ${cy}) rotate(${angle}) scale(${scale}) translate(-390 0)`}>
    <FlipHull ballast={fill} cutaway={rotating} accent={accent}/>
   </g>
   {turn>.85&&<g opacity={smooth((turn-.85)/.15)}>
    <path d={`M${cx} ${sea-72}H${cx+162}L${cx+177} ${sea-55}M${cx} ${sea-55}H${cx-137}`} stroke="#395864" strokeWidth={5} fill="none"/>
    <path d={`M${cx+161} ${sea-72}V${sea+82}`} stroke="#E9D8B9" strokeWidth={2}/>
    <circle cx={cx+161} cy={sea+82} r={9} fill={accent}/>
   </g>}
   {index===0&&<g><Label x={48} y={61} size={47}>A floating laboratory.</Label><Label x={446} y={177} size={40}>Upright.</Label><path d="M449 190H393" stroke={ink} strokeWidth={2}/></g>}
   {index===3&&<g><Label x={35} y={62} size={40}>{turn<.12?'Horizontal tow':'Water enters ballast tanks'}</Label><Label x={35} y={860} light size={31}>Time-compressed · ballast schematic</Label></g>}
   {index===4&&<g opacity={reveal}>
    <path d={`M474 ${sea+14}V863M466 ${sea+14}H482M466 863H482`} fill="none" stroke={accent} strokeWidth={3}/>
    <Label x={498} y={531} light size={58}>~90 m</Label><Label x={498} y={596} light size={34}>submerged</Label>
    <Label x={47} y={67} size={39}>Lab above the surface</Label>
   </g>}
   {index===5&&<g>
    <path d={`M${cx+24} ${sea+33}H572M${cx+29} 677H567`} fill="none" stroke={accent} strokeWidth={3}/>
    <Label x={424} y={sea+88} light size={32}>Narrow upper hull</Label>
    <Label x={429} y={728} light size={32}>Broader deep hull</Label>
    <path d={`M${cx-32} ${sea+15}V${sea+97}M${cx-34} 612V750`} stroke={accent} strokeWidth={7} opacity={.65}/>
   </g>}
   {[6,7].includes(index)&&<g>
    {[0,1,2,3].map(i=>{const r=48*Math.exp(-i*.58)+4,y=sea+70+i*164,x=164,theta=globalTime*1.3;return <g key={i}>
     <circle cx={x} cy={y} r={r} fill="none" stroke="#BCDAD9" strokeWidth={2} opacity={.55}/>
     <circle cx={x+Math.cos(theta)*r} cy={y+Math.sin(theta)*r} r={6} fill="#EAD6B5"/>
    </g>;})}
    <Label x={420} y={430} light size={39}>Wave motion</Label>
    <Label x={420} y={478} light size={33}>weakens with depth</Label>
    {index===7&&<Label x={53} y={861} light size={39}>Reduced response · still moving</Label>}
   </g>}
   {index===8&&<g>
    <Label x={47} y={62} size={40}>Stable ≠ motionless</Label>
    <path d="M426 722Q500 688 573 722M558 708L577 722L558 736" fill="none" stroke={accent} strokeWidth={3}/>
    <Label x={441} y={778} light size={43}>Drift + tilt</Label>
   </g>}
   {index===9&&<g>
    <Label x={37} y={62} size={40}>Air pushes ballast water out</Label>
    {[0,1,2,3].map(i=><circle key={i} cx={216+i*30} cy={690-((t*95+i*47)%180)} r={5+i%2*2} fill={accent} opacity={.7*(1-turn)}/>)}
    <Label x={37} y={860} light size={31}>Time-compressed · ballast schematic</Label>
   </g>}
   {index===10&&<g>
    <Label x={43} y={60} size={40}>A better scientific reference</Label>
    <path d={`M${cx+29} 698H${cx+125}M${cx+125} 698V${sea-20}`} stroke={accent} strokeWidth={3} strokeDasharray="7 8" fill="none"/>
    <circle cx={cx+29} cy={698} r={9} fill={accent}/><circle cx={cx+125} cy={sea-20} r={9} fill={accent}/>
    <Label x={418} y={809} light size={32}>Measure the ocean.</Label>
   </g>}
  </g>}
 </g>
 </svg>;
};
