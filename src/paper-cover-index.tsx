import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,continueRender,delayRender,registerRoot} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';

const Cover=()=>{
 const root=useRef<HTMLDivElement>(null);const [handle]=useState(()=>delayRender('Cover font and bounds'));
 useEffect(()=>{let active=true;document.fonts.ready.then(()=>{
  if(!active)return;
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {kind:'critical',text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height};});
  console.log('PAPER_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 80px Manrope'),bounds}));continueRender(handle);
 });return ()=>{active=false;};},[handle]);
 const h=340*Math.sqrt(2);
 return <AbsoluteFill ref={root} style={{background:'#f2eee5',fontFamily:'Manrope',color:'#19382f'}}>
  <div data-critical style={{position:'absolute',left:130,top:475,width:820,textAlign:'center',fontSize:84,fontWeight:600,lineHeight:1.12}}>A4’s hidden<br/>geometry</div>
  <svg data-critical width={700} height={525} viewBox="0 0 700 525" style={{position:'absolute',left:190,top:715}} aria-label="An ideal paper rectangle and a rotated half with the same proportions">
   <rect x={180} y={20} width={340} height={h} fill="none" stroke="#19382f" strokeWidth={4} opacity={0.35}/>
   <line x1={180} x2={520} y1={20+h/2} y2={20+h/2} stroke="#bf4838" strokeWidth={4} strokeDasharray="12 9"/>
   <rect x={350-h/4} y={20+(h-340)/2} width={h/2} height={340} fill="#fffaf0" stroke="#19382f" strokeWidth={4}/>
   <circle cx={410} cy={225} r={24} fill="#bf4838"/>
   <path d="M260 180h95 M260 209h60" stroke="#19382f" strokeWidth={5} opacity={0.3}/>
  </svg>
  <div data-critical style={{position:'absolute',left:140,top:1250,width:800,textAlign:'center',fontSize:36,lineHeight:1.2}}>Ideal geometry · real sizes rounded</div>
  <div data-critical style={{position:'absolute',left:140,top:1330,width:800,textAlign:'center',fontSize:30,letterSpacing:6,fontWeight:600}}>MAGNIVIS</div>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Magnivis-Paper-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>;
registerRoot(Root);
