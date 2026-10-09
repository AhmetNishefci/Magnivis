import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,Img,continueRender,delayRender,registerRoot,staticFile} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
const Cover=()=>{
 const root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Vermeer cover fonts and bounds'));
 useEffect(()=>{let active=true;document.fonts.ready.then(()=>{
  if(!active)return;const origin=root.current!.getBoundingClientRect();
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {text:e.textContent,x:b.x-origin.x,y:b.y-origin.y,width:b.width,height:b.height};});
  const headline=root.current!.querySelector<HTMLElement>('[data-headline]')!;
  console.log('VERMEER_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 76px Manrope'),headlineFit:headline.scrollWidth<=headline.clientWidth&&headline.scrollHeight<=headline.clientHeight,bounds}));continueRender(handle);
 });return()=>{active=false;};},[handle]);
 return <AbsoluteFill ref={root} style={{background:'#17232A',fontFamily:'Manrope',color:'#EFE9DD'}}>
  <div data-critical style={{position:'absolute',left:130,top:485,width:820,textAlign:'center',fontSize:26,letterSpacing:5,color:'#BDC9C9'}}>MAGNIVIS</div>
  <div data-critical data-headline style={{position:'absolute',left:130,top:555,width:820,height:180,textAlign:'center',fontSize:76,fontWeight:600,lineHeight:1.08}}>HIS DEFENSE?<br/><span style={{color:'#E6B482'}}>IT’S A FORGERY.</span></div>
  <div data-critical style={{position:'absolute',left:240,top:785,width:600,height:400,overflow:'hidden'}}><Img src={staticFile('visuals/vermeer-forgery/court.jpg')} style={{width:600,height:400,objectFit:'cover'}}/></div>
  <div data-critical style={{position:'absolute',left:130,top:1225,width:820,textAlign:'center',fontSize:37,fontWeight:600}}>Han van Meegeren</div>
  <div data-critical style={{position:'absolute',left:130,top:1290,width:820,textAlign:'center',fontSize:28,color:'#BDC9C9'}}>Court photograph • 1947</div>
  <div data-critical style={{position:'absolute',left:130,top:1340,width:820,textAlign:'center',fontSize:28,color:'#BDC9C9'}}>Modern summary • not a quotation</div>
 </AbsoluteFill>;
};
registerRoot(()=> <Composition id="Magnivis-Vermeer-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>);
