import {grainModes,smooth} from '../production/chladni-geometry';
export const plateColors={grain:'#F5E8CE',node:'#99D8B6',motion:'#EFA46D'};
/** Original material/grain renderer; imports no historical visual tokens. */
export const ChladniPlate=({mode,formation,time,nodes=false,highlight=false,zoom=1}:{mode:number;formation:number;time:number;nodes?:boolean;highlight?:boolean;zoom?:number})=>{
 const grains=grainModes[mode]!;const settle=smooth(formation);
 const p=plateColors;
 return <g transform="translate(490 825)">
  <defs>
   <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#50504D"/><stop offset=".35" stopColor="#272A2A"/><stop offset=".7" stopColor="#3D403E"/><stop offset="1" stopColor="#202323"/></linearGradient>
   <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9E9F92"/><stop offset=".5" stopColor="#353936"/><stop offset="1" stopColor="#7B8076"/></linearGradient>
   <clipPath id="grain-window"><rect x={-351} y={-351} width={702} height={702}/></clipPath>
   <radialGradient id="light"><stop stopColor="#AFB59F" stopOpacity=".13"/><stop offset="1" stopColor="#AFB59F" stopOpacity="0"/></radialGradient>
  </defs>
  <rect data-critical="plate" x={-360} y={-360} width={720} height={730} rx={12} fill="#111414"/>
  <rect x={-360} y={-360} width={720} height={720} rx={10} fill="url(#metal)" stroke="url(#edge)" strokeWidth={5}/>
  {Array.from({length:75},(_,i)=><line key={i} x1={-354} y1={-350+i*9.4} x2={354} y2={-350+i*9.4} stroke="#D7DAC9" strokeWidth={.65} opacity={.025+(i%4)*.005}/>)}
  <rect x={-355} y={-355} width={710} height={710} fill="url(#light)"/>
  <g clipPath="url(#grain-window)"><g transform={`scale(${zoom})`}>
  {grains.map((g,i)=>{
   const jitter=.8+(1-settle)*(1.2+Math.sin(time*17+g.phase)*1.1);
   const x=(g.x+(g.targetX-g.x)*settle)*347+Math.sin(time*20+g.phase)*jitter;
   const y=(g.y+(g.targetY-g.y)*settle)*347+Math.cos(time*23+g.phase)*jitter;
   return <circle key={i} cx={x} cy={y} r={g.size} fill={highlight?p.node:p.grain} opacity={.7+((i%5)/5)*.3}/>;
  })}
  </g></g>
  {nodes&&<g opacity={.65}>{grains.filter((_,i)=>i%5===0).map((g,i)=><circle key={i} cx={g.targetX*347} cy={g.targetY*347} r={3.0} fill={p.node}/>)}</g>}
 </g>;
};
