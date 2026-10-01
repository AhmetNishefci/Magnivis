import {useEffect} from 'react';
import {AbsoluteFill,Composition,registerRoot} from 'remotion';
import {loadLongitudeFonts} from '../design/longitude-fonts';
import {TheatreSurface,LongitudeWatch,ShipObject,ObjectLabel,theatreColors as c} from '../components/LongitudeObjects';
const Cover=()=>{
 useEffect(()=>{void loadLongitudeFonts();},[]);
 return <AbsoluteFill style={{background:c.ivory,color:c.ink,fontFamily:'Longitude Source Sans'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 25% 15%, #FFFCF2 0%, transparent 70%)',opacity:.65}}/>
  <div style={{position:'absolute',left:135,top:530,width:810,height:844}}><TheatreSurface>
   <ObjectLabel x={360} y={91} size={22}>MAGNIVIS / LONGITUDE</ObjectLabel>
   {['How can a clock','tell a ship','where it is?'].map((text,i)=><text key={text} x={360} y={190+i*82} textAnchor="middle" fill={c.ink} fontFamily="Longitude Source Serif" fontSize={62}>{text}</text>)}
   <LongitudeWatch x={215} y={522} r={104}/><ShipObject x={514} y={598} scale={.74}/>
   <ObjectLabel x={360} y={694} size={29} color={c.accent}>TIME → LONGITUDE</ObjectLabel>
  </TheatreSurface></div>
 </AbsoluteFill>;
};
registerRoot(()=> <Composition id="Longitude-Instagram-Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920}/>);
