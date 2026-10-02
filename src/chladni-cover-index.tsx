import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,continueRender,delayRender,registerRoot} from 'remotion';
import {ChladniPlate} from './components/ChladniPlate';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';

const Cover=()=>{
 const root=useRef<HTMLDivElement>(null);const [handle]=useState(()=>delayRender('Cover font and bounds'));
 useEffect(()=>{let active=true;document.fonts.ready.then(()=>{
  if(!active)return;
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {kind:'critical',text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height};});
  console.log('CHLADNI_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 80px Manrope'),bounds}));continueRender(handle);
 });return ()=>{active=false;};},[handle]);
 return <AbsoluteFill ref={root} style={{background:'#101816',fontFamily:'Manrope',color:'#F5E8CE'}}>
  <div data-critical style={{position:'absolute',left:140,top:500,width:800,textAlign:'center',fontSize:82,fontWeight:600,lineHeight:1.12}}>Drawn by<br/>vibration</div>
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}} aria-label="Illustrative grains gathered along a plate's nodal lines">
   <g transform="translate(540 1030) scale(.86) translate(-490 -825)"><ChladniPlate mode={0} formation={1} time={0} /></g>
  </svg>
  <div data-critical style={{position:'absolute',left:140,top:1405,width:800,textAlign:'center',fontSize:32,lineHeight:1.2,color:'#B7C4BA'}}>Chladni sand · illustrative model</div>
  <div data-critical style={{position:'absolute',left:140,top:1475,width:800,textAlign:'center',fontSize:27,letterSpacing:5,fontWeight:600,color:'#99D8B6'}}>MAGNIVIS</div>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Magnivis-Chladni-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>;
registerRoot(Root);
