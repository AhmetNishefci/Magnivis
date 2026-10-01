import {trafficPalette, vehicleState, roadTraffic, ringTraffic, trafficLength, congestionPosition, growthEnvelope, mechanismVehicleState} from '../production/traffic-motion';

export const TrafficCar = ({id, x, y, rotation = 0, scale = 1, slow = false, tracked = false, secondary = false}: {
  id: number; x: number; y: number; rotation?: number; scale?: number; slow?: boolean; tracked?: boolean; secondary?: boolean;
}) => {
  const color = secondary ? '#a9d9e3' : tracked ? '#e6c779' : trafficPalette[id % trafficPalette.length];
  return <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    <rect x={-14} y={-16} width={31} height={43} rx={7} fill="#000" opacity={0.38} transform="translate(5 5)" />
    <rect x={-14} y={-13} width={4} height={9} rx={1} fill="#080c0f" /><rect x={10} y={-13} width={4} height={9} rx={1} fill="#080c0f" />
    <rect x={-14} y={8} width={4} height={9} rx={1} fill="#080c0f" /><rect x={10} y={8} width={4} height={9} rx={1} fill="#080c0f" />
    <rect x={-12} y={-21} width={24} height={42} rx={6} fill={color} stroke="#f4fff8" strokeOpacity={0.24} />
    <path d="M-9 -10 Q0 -15 9 -10 L8 -2 Q0 -5 -8 -2Z" fill="#192a37" stroke="#b0d6db" strokeOpacity={0.45}/>
    <path d="M-8 9 Q0 12 8 9 L8 14 L-8 14Z" fill="#26383e" />
    <path d="M-8 -18 L8 -18 M-8 -16 L8 -16" stroke="#fff" strokeOpacity={0.26}/>
    <path d="M-9 -18 L-5 -18 M5 -18 L9 -18" stroke="#fff4cb" strokeWidth={2}/>
    <path d="M-9 18 L-5 18 M5 18 L9 18" stroke={slow ? '#ff6259' : '#ad4944'} strokeWidth={slow ? 3 : 2}/>
    {(tracked || secondary) && <><rect x={-16} y={-25} width={32} height={50} rx={10} fill="none" stroke={secondary ? '#b6e7f0' : '#e9d18d'} strokeWidth={1.6}/><circle cx={0} cy={1} r={3} fill="#fff5cb"/></>}
  </g>;
};

const Environment = () => <>
  <defs>
    <linearGradient id="terrain" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#18252a"/><stop offset="1" stopColor="#060d13"/></linearGradient>
    <linearGradient id="asphalt" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#1a242d"/><stop offset="0.45" stopColor="#37424a"/><stop offset="1" stopColor="#1b2832"/></linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#061018" stopOpacity="0.95"/><stop offset="0.3" stopColor="#061018" stopOpacity="0"/><stop offset="0.72" stopColor="#061018" stopOpacity="0"/><stop offset="1" stopColor="#061018" stopOpacity="1"/></linearGradient>
    <pattern id="gravel" width="37" height="41" patternUnits="userSpaceOnUse"><circle cx="7" cy="10" r="0.9" fill="#bccdd2" opacity="0.1"/><circle cx="29" cy="31" r="0.8" fill="#000" opacity="0.16"/><path d="M17 23h3" stroke="#82939a" opacity="0.09"/></pattern>
    <clipPath id="action"><rect x="130" y="345" width="730" height="1000" rx="34"/></clipPath>
    <radialGradient id="light"><stop stopColor="#d4e3e4" stopOpacity="0.1"/><stop offset="1" stopColor="#d4e3e4" stopOpacity="0"/></radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#terrain)" />
  {Array.from({length: 22}, (_,i) => <g key={i} opacity={0.5} transform={`translate(${i % 2 ? 970 : 85} ${i * 89 + 35})`}>
    <ellipse cx={4} cy={13} rx={54} ry={32} fill="#03080c"/><ellipse rx={48} ry={28} fill={i % 3 ? '#152e2b' : '#203631'}/><ellipse cx={-6} cy={-8} rx={31} ry={19} fill="#28423a" opacity={0.55}/>
  </g>)}
  <ellipse cx="440" cy="700" rx="590" ry="900" fill="url(#light)"/>
</>;

export const RoadTrafficScene = ({time, wide = false, opening = false, membership = false, mechanism = false}: {
  time: number; wide?: boolean; opening?: boolean; membership?: boolean; mechanism?: boolean;
}) => {
  const scale = wide ? 0.66 : 1;
  const baseY = wide ? 500 : opening ? 800 : 610;
  const length = trafficLength(roadTraffic);
  const regionY = baseY - congestionPosition(time) * scale;
  const trackedId = opening ? 12 : 5;
  const cars = (mechanism
    ? Array.from({length:13},(_,id)=>{const c=mechanismVehicleState(id,time);return {...c,y:480-c.position};})
    : Array.from({length: roadTraffic.count}, (_,id) => vehicleState(id, time)).flatMap((c) => [-2,-1,0,1,2].map(copy => ({...c,y: baseY - (c.position + copy * length) * scale}))))
    .filter(c=>c.y > 310 && c.y < 1390);
  return <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
    <Environment />
    <g clipPath="url(#action)">
      <rect x="400" y="200" width="150" height="1400" fill="#060b10"/>
      <rect x="407" y="200" width="136" height="1400" fill="url(#asphalt)"/>
      <rect x="407" y="200" width="136" height="1400" fill="url(#gravel)"/>
      <path d="M417 200V1600 M533 200V1600" stroke="#d5ded6" strokeWidth="3" opacity="0.65"/>
      <path d="M427 200V1600 M523 200V1600" stroke="#8d9fa5" strokeWidth="1" opacity="0.18"/>
      {Array.from({length:20},(_,i)=><g key={i} opacity="0.3"><rect x="389" y={i*80+170} width="5" height="35" fill="#c6d3cd"/><rect x="562" y={i*80+170} width="5" height="35" fill="#c6d3cd"/></g>)}
      {!mechanism && [-1,0,1].map(copy=><g key={copy} transform={`translate(0 ${regionY + copy * length * scale})`}>
        <rect x="393" y={-118*scale} width="164" height={236*scale} rx="28" fill="#e1a764" opacity="0.16"/>
        <rect x="393" y={-118*scale} width="164" height={236*scale} rx="28" fill="none" stroke="#e1bb76" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="7 7"/>
        <path d={`M602 ${-107*scale}v${214*scale}`} stroke="#e1bb76" strokeWidth="3" opacity="0.65"/>
        {opening && <text x="635" y="0" fill="#efce89" fontFamily="Manrope" fontSize="25" fontWeight="700">SLOW PATCH</text>}
      </g>)}
      {cars.map(c=><TrafficCar key={`${c.id}-${c.y}`} id={c.id} x={475} y={c.y} scale={mechanism ? 1.6 : wide ? 1.25 : 2} slow={c.slow} tracked={c.id===trackedId} secondary={membership && c.id===8}/>)}
      {opening && <><text x="173" y="421" fill="#e1ece9" fontFamily="Manrope" fontSize="23" fontWeight="700">FORWARD</text><path d="M301 444V382l-8 12m8-12 8 12" fill="none" stroke="#f0d993" strokeWidth="3"/></>}
    </g>
    <rect width="1080" height="1920" fill="url(#shade)" pointerEvents="none"/>
  </svg>;
};

export const ExperimentTrafficScene = ({time}: {time: number}) => {
  const growth = growthEnvelope(Math.max(0,time-0.7),5);
  const length=trafficLength(ringTraffic);
  const states=Array.from({length:22},(_,id)=>vehicleState(id,time,ringTraffic,growth));
  const jamAngle=congestionPosition(time,ringTraffic)/length*Math.PI*2-Math.PI/2;
  return <svg width="1080" height="1920" style={{position:'absolute',inset:0}} viewBox="0 0 1080 1920">
    <Environment/>
    <ellipse cx="493" cy="842" rx="355" ry="359" fill="#02070a" opacity="0.65"/>
    <circle cx="475" cy="820" r="288" fill="none" stroke="#1a262e" strokeWidth="103"/>
    <circle cx="475" cy="820" r="288" fill="none" stroke="url(#asphalt)" strokeWidth="91"/>
    <circle cx="475" cy="820" r="335" fill="none" stroke="#c9d4ce" strokeWidth="2" opacity="0.6"/>
    <circle cx="475" cy="820" r="241" fill="none" stroke="#c9d4ce" strokeWidth="2" opacity="0.6"/>
    <circle cx="475" cy="820" r="287" fill="none" stroke="url(#gravel)" strokeWidth="86"/>
    <circle cx="475" cy="820" r="196" fill="#0f2324"/>
    <circle cx="475" cy="820" r="179" fill="#16302c"/>
    <path d="M356 806Q474 730 596 820 M375 916Q495 840 568 907" stroke="#26453b" strokeWidth="24" opacity="0.4" fill="none"/>
    {growth.amount>0.01 && <path d={`M${475+288*Math.cos(jamAngle-0.32)} ${820+288*Math.sin(jamAngle-0.32)} A288 288 0 0 1 ${475+288*Math.cos(jamAngle+0.32)} ${820+288*Math.sin(jamAngle+0.32)}`} fill="none" stroke="#e4b870" strokeWidth="78" opacity={growth.amount*0.2}/>}
    {states.map(c=>{const angle=c.position/length*Math.PI*2-Math.PI/2;return <TrafficCar key={c.id} id={c.id} x={475+288*Math.cos(angle)} y={820+288*Math.sin(angle)} rotation={angle*180/Math.PI+180} scale={0.95} slow={c.slow} tracked={c.id===12}/>;})}
    <text x="475" y="810" textAnchor="middle" fontFamily="Space Grotesk" fontSize="78" fontWeight="700" fill="#edf1e6">22</text>
    <text x="475" y="855" textAnchor="middle" fontFamily="Manrope" fontSize="22" fontWeight="600" letterSpacing="5" fill="#acbbb7">CARS</text>
    <rect width="1080" height="1920" fill="url(#shade)"/>
  </svg>;
};
