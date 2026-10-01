import {Composition,registerRoot} from 'remotion';
import {TrafficCar} from '../components/TrafficWorld';
import {roadTraffic,vehicleState} from '../production/traffic-motion';
import '../styles.css';
export const PhantomTrafficInstagramCover=()=> <svg width="1080" height="1920" viewBox="0 0 1080 1920">
 <defs>
  <radialGradient id="cover-ground"><stop stopColor="#203638"/><stop offset="1" stopColor="#071019"/></radialGradient>
  <linearGradient id="cover-road" x2="0" y2="1"><stop stopColor="#18262c"/><stop offset=".45" stopColor="#3b484d"/><stop offset="1" stopColor="#15232a"/></linearGradient>
  <clipPath id="cover-action"><rect x="120" y="980" width="840" height="220" rx="26"/></clipPath>
 </defs>
 <rect width="1080" height="1920" fill="url(#cover-ground)"/>
 {[360,460,1360,1460].map((y,i)=><g key={y} opacity=".3"><ellipse cx={i%2?850:220} cy={y+16} rx="100" ry="52" fill="#02080c"/><ellipse cx={i%2?850:220} cy={y} rx="90" ry="42" fill="#29483b"/></g>)}
 <text x="540" y="560" textAnchor="middle" fill="#99adb0" fontFamily="Manrope" fontSize="24" fontWeight="700" letterSpacing="7">MAGNIVIS</text>
 <text x="540" y="725" textAnchor="middle" fill="#f0f2e9" fontFamily="Space Grotesk" fontSize="112" fontWeight="700">A JAM.</text>
 <text x="540" y="818" textAnchor="middle" fill="#e8c882" fontFamily="Space Grotesk" fontSize="64" fontWeight="700">NO BLOCKED ROAD.</text>
 <g clipPath="url(#cover-action)">
  <rect x="100" y="1022" width="880" height="152" fill="#02090f"/>
  <rect x="100" y="1030" width="880" height="136" fill="url(#cover-road)"/>
  <path d="M100 1040H980 M100 1156H980" stroke="#c4cec4" strokeWidth="3" opacity=".7"/>
  <rect x="427" y="1017" width="146" height="160" rx="25" fill="#d9ac6c" opacity=".18"/>
  <rect x="427" y="1017" width="146" height="160" rx="25" fill="none" stroke="#e7c17e" strokeWidth="2" strokeDasharray="7 7" opacity=".7"/>
  {Array.from({length:roadTraffic.count},(_,id)=>vehicleState(id,0)).map(c=>({...c,x:500+c.position*.55})).filter(c=>c.x>145&&c.x<930).map(c=><TrafficCar key={c.id} id={c.id} x={c.x} y={1098} rotation={90} scale={1.05} slow={c.slow} tracked={c.id===12}/>)}
 </g>
 <text x="540" y="1250" textAnchor="middle" fill="#99adb0" fontFamily="Manrope" fontSize="20" fontWeight="650" letterSpacing="1">SIMPLIFIED EXPLANATORY MODEL</text>
</svg>;
registerRoot(()=> <Composition id="PhantomTraffic-Instagram-Cover" component={PhantomTrafficInstagramCover} durationInFrames={1} fps={30} width={1080} height={1920}/>);
