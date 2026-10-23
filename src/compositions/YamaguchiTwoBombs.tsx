import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,delayRender,continueRender,interpolate} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import narration from '../production/narration/yamaguchi-two-bombs.json';
import captions from '../captions/plans/yamaguchi-two-bombs.json';
import {FilmPlate,CityLink,TrainMotion,MovingPapers} from '../components/YamaguchiFilm';
const Label:React.FC<{y:number;size?:number;kind?:string;color?:string;children:React.ReactNode}>=({y,size=38,kind='critical',color='#f6f0e4',children})=><div data-qabounds={kind} style={{position:'absolute',left:110,top:y,maxWidth:770,fontSize:size,fontWeight:600,lineHeight:1.25,color,textShadow:'0 2px 18px #000'}}>{children}</div>;
export const YamaguchiTwoBombs:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Yamaguchi artwork and font')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 56px Manrope'),...['engineer','hiroshima','aftermath','train-selected','office','desk','ruins'].map(name=>new Promise<void>((resolve,reject)=>{const im=new Image();im.onload=()=>resolve();im.onerror=()=>reject(new Error('Artwork unavailable'));im.src=staticFile(`visuals/yamaguchi-two-bombs/${name}.png`);}))]).then(()=>setReady(true));},[]);
 const i=narration.cues.reduce((last,q,j)=>frame>=Math.round(q.start*30)?j:last,0),start=Math.round(narration.cues[i]!.start*30),end=i+1<narration.cues.length?Math.round(narration.cues[i+1]!.start*30):narration.durationFrames,t=(frame-start)/(end-start),cap=captions.cues.find(q=>frame>=q.startFrame&&frame<q.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-yamaguchi-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const el=document.querySelector<HTMLElement>('[data-caption]');console.log('YAMAGUCHI_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 56px Manrope'),bounds,caption:el?{width:el.scrollWidth,height:el.scrollHeight,availableWidth:el.clientWidth,availableHeight:el.clientHeight}:null,stage:i}));}continueRender(handle);},[frame,inspectQa,ready,handle,i]);
 const plate=(name:string,progress=t,close=false,children:React.ReactNode=null)=><FilmPlate name={name} frame={frame} progress={progress} close={close}>{children}</FilmPlate>;
 let visual:React.ReactNode,labels:React.ReactNode,disclosure='AI reconstruction · not archival footage',flash=0;
 if(i<=1){visual=plate('engineer',(frame/285),true);labels=<><Label y={270} size={43}>Tsutomu Yamaguchi</Label><Label y={330} size={31} color="#d6d1c4">A documented life · Japan, 1945</Label></>;}
 else if(i===2){visual=plate('hiroshima');labels=<><Label y={270} size={45}>Hiroshima</Label><Label y={333} size={32}>6 August 1945 · 8:15 a.m.</Label></>;flash=interpolate(t,[.70,.81,.91,1],[0,0,.85,.25],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});}
 else if(i===3){visual=plate('aftermath',t,true);labels=<Label y={270} size={32}>Hiroshima · after the bombing</Label>;}
 else if(i===4){const train=t>.43;visual=train?plate('train-selected',(t-.43)/.57,false,<TrainMotion frame={frame-start}/>):<CityLink progress={t/.43}/>;labels=train?<><Label y={270} size={40}>Homeward</Label><Label y={330} size={31}>Departed 7 August · arrived 8 August</Label></>:<><Label y={270} size={39}>Hiroshima → Nagasaki</Label><Label y={331} size={30}>Western Japan · schematic city link</Label></>;disclosure=train?'AI reconstruction · illustrative journey':'Original map · not an exact rail route';}
 else if(i<=6){const p=(frame-825)/(1151-825);visual=plate('office',p,true,i===6?<MovingPapers progress={Math.min(1,t*1.2)}/>:null);labels=<><Label y={270} size={45}>Nagasaki</Label><Label y={333} size={32}>9 August 1945 · {i===6?'11:02 a.m.':'back at work'}</Label></>;if(i===6)flash=interpolate(t,[0,.08,.18,.45,.75,1],[0,.2,.82,.4,.08,0]);}
 else if(i===7){visual=plate('aftermath',.4+t*.4,true);labels=<Label y={270} size={33}>Survival carried lasting consequences.</Label>;}
 else if(i===8){visual=plate('ruins',t);labels=<Label y={270} size={35}>Two devastated cities.</Label>;}
 else if(i<=10){visual=<CityLink progress={1} recognition/>;labels=<><Label y={270} size={45}>Official recognition · 2009</Label><Label y={337} size={32}>{i===10?'Other double survivors are documented.':'Exposure in both cities acknowledged.'}</Label></>;disclosure='Original schematic map';}
 else{visual=plate('desk',(frame-1688)/(1931-1688));labels=<><Label y={270} size={45}>Tsutomu Yamaguchi</Label><Label y={337} size={34}>1916–2010 · aged 93</Label></>;disclosure='AI reconstruction · illustrative memory';}
 return <AbsoluteFill data-yamaguchi-root style={{background:'#172020',fontFamily:'Manrope',color:'#f6f0e4',overflow:'hidden'}}>
 {visual}
 {flash>0&&<AbsoluteFill style={{background:'radial-gradient(ellipse at 80% 25%,#fffdf0,#d8d6c4)',opacity:flash}}/>}
 <div style={{position:'absolute',inset:0,background:'linear-gradient(#060b0bbd,transparent 27%,transparent 59%,#101617df 74%,#101617 93%)'}}/>
 {labels}<Label y={1335} size={32} kind="disclosure" color="#d5d8ce">{disclosure}</Label>
 <div data-qabounds="critical-visual" aria-label={i===4||i===9||i===10?'Authored city-link envelope':'Authored face / desk focal envelope; contextual image full bleed'} style={{position:'absolute',left:140,top:420,width:720,height:790,pointerEvents:'none'}}/>
 {cap&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:150,display:'flex',alignItems:'center',justifyContent:'center',fontSize:56,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 2px 18px #000'}}>{cap.lines.join('\n')}</div>}
 {narration.cues.map(q=><Sequence key={q.id} from={Math.round(q.start*30)} durationInFrames={Math.ceil(q.duration*30)}><Audio src={staticFile(q.file)}/></Sequence>)}
 <Audio src={staticFile('audio/yamaguchi-two-bombs/soundscape.wav')} volume={.22}/>
 </AbsoluteFill>;
};
