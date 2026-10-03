import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,continueRender,delayRender,registerRoot} from 'remotion';
import {Detector,Absorber} from './components/QuantumPossibilities';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
const Cover=()=>{
 const root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('IFM cover fonts and bounds'));
 useEffect(()=>{let active=true;document.fonts.ready.then(()=>{
  if(!active)return;const origin=root.current!.getBoundingClientRect();
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {kind:'critical',text:e.textContent,x:b.x-origin.x,y:b.y-origin.y,width:b.width,height:b.height};});
  console.log('IFM_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 72px Manrope'),bounds}));continueRender(handle);
 });return()=>{active=false;};},[handle]);
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 52% 48%, #214638 0%, #10271D 55%, #07140E 100%)',fontFamily:'Manrope',color:'#F4EEE1'}}>
  <div data-critical style={{position:'absolute',left:140,top:470,width:800,textAlign:'center',fontSize:72,fontWeight:600,lineHeight:1.15,color:'#89E2DE'}}>OBSTACLE<br/>DETECTED.</div>
  <div data-critical style={{position:'absolute',left:140,top:680,width:800,textAlign:'center',fontSize:68,fontWeight:600,lineHeight:1.15}}>PHOTON NOT<br/>ABSORBED.</div>
  <svg width={1080} height={1920} style={{position:'absolute'}} aria-label="Detector click and absorbing obstacle, separate illustrative symbols">
   <g data-critical><Absorber x={330} y={1040} scale={1.5}/><Detector x={670} y={1040} r={100} click pulse={.5}/><text x={670} y={1056} textAnchor="middle" fill="#092521" fontSize={40} fontWeight={600}>CLICK</text></g>
  </svg>
  <div data-critical style={{position:'absolute',left:140,top:1220,width:800,textAlign:'center',fontSize:30,lineHeight:1.3}}>Not absorbed by the obstacle<br/>in a successful trial • ideal model</div>
  <div data-critical style={{position:'absolute',left:140,top:1350,width:800,textAlign:'center',fontSize:27,letterSpacing:5,color:'#B1C5BD'}}>MAGNIVIS</div>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Magnivis-IFM-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>;
registerRoot(Root);
