import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,continueRender,delayRender,registerRoot} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
const Cover=()=>{
 const root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Oklo cover fonts and bounds'));
 useEffect(()=>{let active=true;Promise.all([document.fonts.load('600 72px Manrope'),document.fonts.load('400 32px Manrope')]).then(()=>{
  if(!active)return;const origin=root.current!.getBoundingClientRect();
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {kind:'critical',text:e.textContent,x:b.x-origin.x,y:b.y-origin.y,width:b.width,height:b.height};});
  const headline=root.current!.querySelector<HTMLElement>('[data-headline]')!;
  console.log('OKLO_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 72px Manrope'),headlineFit:headline.scrollWidth<=headline.clientWidth,bounds}));continueRender(handle);
 });return()=>{active=false;};},[handle]);
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 50% 48%, #29423D 0%, #132523 55%, #081315 100%)',fontFamily:'Manrope',color:'#F4EEE1'}}>
  <div data-critical data-headline style={{position:'absolute',left:140,top:530,width:800,textAlign:'center',fontSize:72,fontWeight:600,lineHeight:1.14}}>NUCLEAR REACTORS<br/><span style={{color:'#E2BD78'}}>BEFORE HUMANS</span></div>
  <svg width={1080} height={1920} style={{position:'absolute'}} aria-label="Original symbolic ancient Earth; no engineered reactor or actual ancient geography">
   <defs><radialGradient id="oklo-cover-earth" cx=".25" cy=".2"><stop stopColor="#9BAB91"/><stop offset=".4" stopColor="#42676C"/><stop offset="1" stopColor="#142829"/></radialGradient><radialGradient id="oklo-cover-heat"><stop stopColor="#EABD66" stopOpacity=".7"/><stop offset="1" stopColor="#B96C2C" stopOpacity="0"/></radialGradient><clipPath id="oklo-cover-sphere"><circle cx={540} cy={1000} r={230}/></clipPath></defs>
   <g data-critical><circle cx={540} cy={1000} r={230} fill="url(#oklo-cover-earth)" stroke="#92B9B4" strokeWidth={2}/><g clipPath="url(#oklo-cover-sphere)"><path d="M305 1030 Q430 970 555 1030 T775 1040" stroke="#B69C66" strokeWidth={12} fill="none" opacity={.6}/><path d="M305 1050 Q430 990 555 1050 T775 1060" stroke="#A7763D" strokeWidth={18} fill="none" opacity={.45}/><ellipse cx={595} cy={1040} rx={55} ry={29} fill="url(#oklo-cover-heat)"/><path d="M655 780 Q475 965 610 1230 H800 V760Z" fill="#061214" opacity={.55}/></g></g>
  </svg>
  <div data-critical style={{position:'absolute',left:140,top:1280,width:800,textAlign:'center',fontSize:32,lineHeight:1.3}}>Natural fission • ~2 billion years ago</div>
  <div data-critical style={{position:'absolute',left:140,top:1380,width:800,textAlign:'center',fontSize:27,letterSpacing:5,color:'#B7CBBE'}}>MAGNIVIS</div>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="Magnivis-Oklo-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>;
registerRoot(Root);
