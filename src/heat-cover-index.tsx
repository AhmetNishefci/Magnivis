import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,continueRender,delayRender,registerRoot} from 'remotion';
import {ThermalDefs,Metal,Water} from './components/ThermalInterfaceV4';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
const Cover=()=>{
 const root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Heat cover font and bounds'));
 useEffect(()=>{let active=true;document.fonts.ready.then(()=>{
  if(!active)return;const origin=root.current!.getBoundingClientRect();
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {kind:'critical',text:e.textContent,x:b.x-origin.x,y:b.y-origin.y,width:b.width,height:b.height};});
  console.log('HEAT_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 82px Manrope'),bounds}));continueRender(handle);
 });return ()=>{active=false;};},[handle]);
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 46% 38%, #35434A 0%, #17262D 58%, #111C22 100%)',fontFamily:'Manrope',color:'#EDF4F7'}}>
  <div data-critical style={{position:'absolute',left:140,top:560,width:800,textAlign:'center',fontSize:82,fontWeight:600,lineHeight:1.12}}>Why can hotter<br/>last longer?</div>
  <svg width={1080} height={1920} style={{position:'absolute'}} aria-label="Original illustration of a water drop supported above hot metal by an enlarged vapor layer">
   <ThermalDefs/><g data-critical transform="translate(50 0)"><Metal y={1140}/><Water baseY={1050}/><rect x={278} y={1057} width={424} height={80} fill="url(#vapor)"/>{[0,1,2,3].map(i=><path key={i} d={`M${300+i*8} ${1068+i*15} Q490 ${1053+i*15} 680 ${1068+i*15}`} stroke="#D8F4F7" strokeOpacity={.35} strokeWidth={2} fill="none"/>)}</g>
  </svg>
  <div data-critical style={{position:'absolute',left:140,top:1270,width:800,textAlign:'center',fontSize:32,lineHeight:1.25,color:'#F3CC99'}}>The Leidenfrost effect</div>
  <div data-critical style={{position:'absolute',left:140,top:1340,width:800,textAlign:'center',fontSize:27,lineHeight:1.3,color:'#AEC4CD'}}>Qualitative illustration • vapor gap enlarged</div>
  <div data-critical style={{position:'absolute',left:140,top:1420,width:800,textAlign:'center',fontSize:27,letterSpacing:5,color:'#AEC4CD'}}>MAGNIVIS</div>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Magnivis-Heat-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>;
registerRoot(Root);
