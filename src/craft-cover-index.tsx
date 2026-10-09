import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Composition,Img,continueRender,delayRender,registerRoot,staticFile} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
const Cover=()=>{
 const root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Craft cover fonts and bounds'));
 useEffect(()=>{let active=true;document.fonts.ready.then(()=>{
  if(!active)return;const origin=root.current!.getBoundingClientRect();
  const bounds=[...root.current!.querySelectorAll('[data-critical]')].map(e=>{const b=e.getBoundingClientRect();return {text:e.textContent,x:b.x-origin.x,y:b.y-origin.y,width:b.width,height:b.height};});
  const headline=root.current!.querySelector<HTMLElement>('[data-headline]')!;
  console.log('CRAFT_COVER_QA '+JSON.stringify({fontsLoaded:document.fonts.check('600 76px Manrope'),headlineFit:headline.scrollWidth<=headline.clientWidth&&headline.scrollHeight<=headline.clientHeight,bounds}));continueRender(handle);
 });return()=>{active=false;};},[handle]);
 return <AbsoluteFill ref={root} style={{background:'#17232A',fontFamily:'Manrope',color:'#EFE9DD'}}>
  <div data-critical style={{position:'absolute',left:130,top:525,width:820,textAlign:'center',fontSize:26,letterSpacing:5,color:'#BDC9C9'}}>MAGNIVIS</div>
  <div data-critical data-headline style={{position:'absolute',left:130,top:585,width:820,height:260,textAlign:'center',fontSize:76,fontWeight:600,lineHeight:1.08}}>ESCAPE AS<br/>THE <span style={{color:'#E6B482'}}>SLAVEHOLDER</span></div>
  <div data-critical style={{position:'absolute',left:205,top:840,width:310,height:350,overflow:'hidden',background:'#EFE9DD'}}><Img src={staticFile('visuals/craft-escape/ellen-frontispiece.jpg')} style={{position:'absolute',width:465,left:-81,top:-63,filter:'grayscale(1)'}}/></div>
  <div data-critical style={{position:'absolute',left:565,top:840,width:310,height:350,overflow:'hidden',background:'#EFE9DD'}}><Img src={staticFile('visuals/craft-escape/craft-portraits.jpg')} style={{position:'absolute',width:713,left:-167,top:-140,filter:'grayscale(1)'}}/></div>
  <div data-critical style={{position:'absolute',left:130,top:1220,width:820,textAlign:'center',fontSize:37,fontWeight:600}}>Ellen &amp; William Craft • 1848</div>
  <div data-critical style={{position:'absolute',left:130,top:1285,width:820,textAlign:'center',fontSize:28,color:'#BDC9C9'}}>Later portraits • 1860 / 1872</div>
 </AbsoluteFill>;
};
registerRoot(()=> <Composition id="Magnivis-Craft-Cover" component={Cover} width={1080} height={1920} fps={30} durationInFrames={1}/>);
