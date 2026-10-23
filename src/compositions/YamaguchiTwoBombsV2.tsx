import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,delayRender,continueRender,interpolate} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import narration from '../production/narration/yamaguchi-two-bombs.json';
import captions from '../captions/plans/yamaguchi-two-bombs-v2.json';
import {Img} from 'remotion';
import {YamaguchiJourney,YamaguchiRailWindow,ExposureAcknowledgment} from '../components/YamaguchiJourney';
const Label:React.FC<{y:number;size?:number;kind?:string;color?:string;children:React.ReactNode}>=({y,size=38,kind='critical',color='#f6f0e4',children})=><div data-qabounds={kind} style={{position:'absolute',left:110,top:y,maxWidth:770,fontSize:size,fontWeight:600,lineHeight:1.25,color,textShadow:'0 2px 18px #000'}}>{children}</div>;
export const YamaguchiTwoBombsV2:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Yamaguchi artwork and font')),[ready,setReady]=useState(false);
 const artwork=['yamaguchi-two-bombs/engineer','yamaguchi-two-bombs/hiroshima','yamaguchi-two-bombs/aftermath','yamaguchi-two-bombs/ruins',...['draft-detail','street-after','workplace-wide','workplace-detail','shelter','survival-detail','later-witness','rail-window'].map(n=>'yamaguchi-two-bombs-v2/'+n)];
 useEffect(()=>{Promise.all([document.fonts.load('600 56px Manrope'),...artwork.map(name=>new Promise<void>((resolve,reject)=>{const im=new Image();im.onload=()=>resolve();im.onerror=()=>reject(new Error('Artwork unavailable: '+name));im.src=staticFile(`visuals/${name}.png`);}))]).then(()=>setReady(true));},[]);

 const i=narration.cues.reduce((last,q,j)=>frame>=Math.round(q.start*30)?j:last,0),cap=captions.cues.find(q=>frame>=q.startFrame&&frame<q.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-yamaguchi-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const el=document.querySelector<HTMLElement>('[data-caption]');console.log('YAMAGUCHI_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 56px Manrope'),bounds,caption:el?{width:el.scrollWidth,height:el.scrollHeight,availableWidth:el.clientWidth,availableHeight:el.clientHeight}:null,stage:i}));}continueRender(handle);},[frame,inspectQa,ready,handle,i]);
 const plate=(name:string,v2=true)=><Img src={staticFile(`visuals/${v2?'yamaguchi-two-bombs-v2':'yamaguchi-two-bombs'}/${name}.png`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>;
 let visual:React.ReactNode,labels:React.ReactNode,disclosure='AI reconstruction · not archival footage',flash=0;
 if(frame<72){visual=plate('engineer',false);labels=<><Label y={270} size={43}>Tsutomu Yamaguchi</Label><Label y={330} size={31} color="#d6d1c4">A documented life · Japan, 1945</Label></>;}
 else if(frame<146){visual=<YamaguchiJourney progress={0} question/>;labels=<Label y={270} size={43}>One engineer. Two cities.</Label>;disclosure='Original schematic geography';}
 else if(frame<285){visual=plate('draft-detail');labels=<><Label y={270} size={43}>Tsutomu Yamaguchi</Label><Label y={330} size={31}>Mitsubishi · shipbuilding engineer</Label></>;}
 else if(frame<518){visual=plate(frame<488?'hiroshima':'street-after',frame>=488);labels=<><Label y={270} size={45}>Hiroshima</Label><Label y={333} size={32}>6 August 1945 · 8:15 a.m.</Label></>;flash=interpolate(frame,[479,486,489,503],[0,.94,.72,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});}
 else if(frame<604){visual=plate('aftermath',false);labels=<Label y={270} size={32}>Hiroshima · injured, alive</Label>;}
 else if(frame<825){const p=(frame-604)/220,window=frame>=670&&frame<778;visual=window?<YamaguchiRailWindow frame={frame-670}/>:<YamaguchiJourney progress={p}/>;labels=window?<><Label y={270} size={40}>Hiroshima → Nagasaki</Label><Label y={330} size={38}>{frame<750?'7 August · departure':'8 August · arrival'}</Label><Label y={1208} size={38}>Departed 7 Aug · arrived 8 Aug</Label></>:<Label y={270} size={43}>The journey home</Label>;disclosure=window?'AI reconstruction · illustrative travel':'Original map · city link, not rail route';}
 else if(frame<1014){visual=plate(frame<924?'workplace-wide':'workplace-detail');labels=<><Label y={270} size={45}>Nagasaki · 9 August</Label><Label y={333} size={31}>{frame<924?'Back at work':'His later account: reporting to his manager'}</Label></>;}
 else if(frame<1151){visual=plate(frame<1040?'workplace-detail':'shelter');labels=<><Label y={270} size={45}>Nagasaki</Label><Label y={333} size={32}>9 August 1945 · 11:02 a.m.</Label></>;flash=interpolate(frame,[1014,1029,1033,1042,1067],[0,.94,.86,.45,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});disclosure='AI reconstruction · his recalled shelter';}
 else if(frame<1284){visual=plate('survival-detail');labels=<><Label y={270} size={34}>He survived, with lasting consequences.</Label><Label y={333} size={30}>His wife and infant son survived Nagasaki.</Label></>;}
 else if(frame<1426){visual=plate('ruins',false);labels=<Label y={270} size={35}>Two devastated cities.</Label>;}
 else if(frame<1688){visual=<ExposureAcknowledgment qualification={frame>=1599}/>;labels=<><Label y={270} size={45}>Official recognition · 2009</Label><Label y={337} size={31}>Japan acknowledged both-city exposure.</Label></>;disclosure='Original typography · not a certificate';}
 else{visual=plate('later-witness');labels=<><Label y={270} size={45}>Tsutomu Yamaguchi</Label><Label y={337} size={34}>1916–2010 · aged 93</Label></>;if(frame>=1793)labels=<><Label y={270} size={43}>A witness. An advocate.</Label><Label y={337} size={31}>For the abolition of nuclear weapons.</Label></>;disclosure='AI later-life reconstruction · not a portrait record';}
 return <AbsoluteFill data-yamaguchi-root style={{background:'#172020',fontFamily:'Manrope',color:'#f6f0e4',overflow:'hidden'}}>
 {visual}
 {flash>0&&<AbsoluteFill style={{background:'radial-gradient(ellipse at 80% 25%,#fffdf0,#d8d6c4)',opacity:flash}}/>}
 <div style={{position:'absolute',inset:0,background:'linear-gradient(#060b0bbd,transparent 27%,transparent 59%,#101617df 74%,#101617 93%)'}}/>
 {labels}<Label y={1335} size={32} kind="disclosure" color="#d5d8ce">{disclosure}</Label>
 <div data-qabounds="critical-visual" aria-label={'Authored scene focal envelope; context full bleed'} style={{position:'absolute',left:140,top:420,width:720,height:790,pointerEvents:'none'}}/>
 {cap&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:150,display:'flex',alignItems:'center',justifyContent:'center',fontSize:56,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 2px 18px #000'}}>{cap.lines.join('\n')}</div>}
 {narration.cues.map(q=><Sequence key={q.id} from={Math.round(q.start*30)} durationInFrames={Math.ceil(q.duration*30)}><Audio src={staticFile(q.file)}/></Sequence>)}
 <Audio src={staticFile('audio/yamaguchi-two-bombs/soundscape.wav')} volume={.22}/>
 </AbsoluteFill>;
};
