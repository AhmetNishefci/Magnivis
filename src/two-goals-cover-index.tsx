import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,continueRender,delayRender,registerRoot} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
const Cover=()=>{
 const root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Two goals cover fonts and bounds'));
 useEffect(()=>{let active=true;Promise.all([document.fonts.load('600 82px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>{
  if(!active)return;const origin=root.current!.getBoundingClientRect();
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {kind:'critical',text:e.textContent,x:b.x-origin.x,y:b.y-origin.y,width:b.width,height:b.height};});
  const headline=root.current!.querySelector<HTMLElement>('[data-headline]')!;
  console.log('TWO_GOALS_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 82px Manrope'),headlineFit:headline.scrollWidth<=headline.clientWidth,bounds}));continueRender(handle);
 });return()=>{active=false;};},[handle]);
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 50% 48%,#214B3D 0%,#091D18 70%)',fontFamily:'Manrope',color:'#F4EEE1'}}>
  <div data-critical style={{position:'absolute',left:140,top:560,width:800,textAlign:'center',fontSize:25,letterSpacing:5,color:'#B9CDBB'}}>MAGNIVIS</div>
  <div data-critical data-headline style={{position:'absolute',left:140,top:630,width:800,textAlign:'center',fontSize:82,fontWeight:600,lineHeight:1.12}}>DEFEND<br/><span style={{color:'#F3A17F'}}>BOTH GOALS?</span></div>
  <svg width={1080} height={1920} style={{position:'absolute'}} aria-label="Original schematic of Barbados protecting opposite goals, not match footage">
   <g data-critical>
    <rect x={320} y={910} width={440} height={320} rx={24} fill="#164132" stroke="#BED5C7" strokeWidth={3}/>
    <path d="M320 1070H760" stroke="#BED5C7" strokeWidth={2}/><circle cx={540} cy={1070} r={42} stroke="#BED5C7" strokeWidth={2} fill="none"/>
    {[920,1200].map((y,i)=><g key={y}><rect x={475} y={y} width={130} height={24} fill="none" stroke="#F3A17F" strokeWidth={4}/><path d={`M487 ${y}v24m24-24v24m24-24v24m24-24v24m24-24v24m-108-12h130`} stroke="#BED5C7" strokeWidth={1}/><circle cx={540} cy={i?1164:980} r={23} fill="#F3A17F"/><text x={540} y={i?1173:989} textAnchor="middle" fill="#091D18" fontSize={25} fontWeight={600}>B</text></g>)}
   </g>
  </svg>
  <div data-critical style={{position:'absolute',left:140,top:1270,width:800,textAlign:'center',fontSize:30,lineHeight:1.3}}>Barbados vs Grenada • 1994</div>
  <div data-critical style={{position:'absolute',left:140,top:1330,width:800,textAlign:'center',fontSize:23,color:'#B9CDBB'}}>Illustrated reconstruction</div>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Magnivis-Two-Goals-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>;
registerRoot(Root);
