import React,{useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Img,OffthreadVideo,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/600.css';
import narration from '../production/narration/flytrap.json';
import caption from '../captions/plans/flytrap-v2.json';
import {FlytrapBotanicalWorldV2} from '../components/FlytrapBotanicalWorldV2';
import {v2State} from '../production/flytrap-v2/choreography';
import {smooth} from '../production/flytrap/model';
export const FlytrapMemoryV2:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const f=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Flytrap V2 typography')),[ready,setReady]=useState(false);
 useEffect(()=>{document.fonts.load('600 54px Manrope').then(()=>setReady(true));},[]);
 useEffect(()=>{if(!ready||!root.current)return;if(inspectQa){const origin=root.current.getBoundingClientRect();const bounds=Array.from(root.current.querySelectorAll<HTMLElement>('[data-critical]')).filter(e=>{let opacity=1;for(let el:Element|null=e;el&&el!==root.current;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);return opacity>.05;}).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const box=root.current.querySelector<HTMLElement>('[data-critical="caption-midpoint"]'),inner=root.current.querySelector<HTMLElement>('[data-caption]');console.log('FLYTRAP_V2_LAYOUT_QA '+JSON.stringify({frame:f,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:true}));}continueRender(handle);},[f,ready,inspectQa,handle]);
 const scene=narration.cues.reduce((last,n,i)=>f>=Math.round(n.start*30)?i:last,0),n=narration.cues[scene]!,t=(f-Math.round(n.start*30))/30,state=v2State(scene,t),active=caption.cues.find(c=>f>=c.startFrame&&f<c.endFrame),signal=state.events.find(e=>t>=e&&t<e+.9),signalAge=signal===undefined?null:t-signal;
 const photo=scene===0?1-smooth(t,.85,1.6):scene===7?smooth(t,2.65,3.65):0;
 return <AbsoluteFill ref={root} style={{fontFamily:'Manrope',background:'#172b20',color:'#fbf6ea'}}>
 <Img src={staticFile('images/flytrap-v2/lucy-bradley-cc0.jpg')} style={{position:'absolute',width:2500,height:1406,left:-720,top:-180,filter:'blur(65px) brightness(.33) saturate(.85)',transform:'scale(1.6)'}}/>
 <AbsoluteFill style={{background:'linear-gradient(155deg, #98b87c33 0%, transparent 45%, #10231888 85%)'}}/>
 <div style={{position:'absolute',inset:0,opacity:scene===1?0:1-photo}}><FlytrapBotanicalWorldV2 {...state} inspectQa={inspectQa} probe={scene===1&&state.bend>.005||scene===6&&state.bend>.005} signalAge={signalAge}/></div>
 {scene===1&&<Sequence from={Math.round(n.start*30)} durationInFrames={Math.round((narration.cues[2]!.start-n.start)*30)} layout="none"><div data-critical="documentary-macro" style={{position:'absolute',left:110,top:430,width:770,height:962.5,overflow:'hidden'}}><OffthreadVideo src={staticFile('video/flytrap-v2/first-stimulus.mp4')} muted style={{width:770,height:962.5}}/></div></Sequence>}
 {photo>0&&<div style={{position:'absolute',inset:0,opacity:photo}}><Img src={staticFile('images/flytrap-v2/lucy-bradley-cc0.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'54% center',transform:`scale(${scene===7?1.1-.06*smooth(t,3,6):1.03})`}}/><AbsoluteFill style={{background:'linear-gradient(180deg,#10231855 0%,transparent 38%,#102318ee 80%)'}}/></div>}
 <div data-critical="disclosure" style={{position:'absolute',left:120,top:265,width:740,fontSize:36,lineHeight:1.3,textShadow:'0 2px 9px #102318'}}>{scene===1?<><div>Research footage · Burri et al. (2020)</div><div style={{fontSize:34}}>doi.org/10.1371/journal.pbio.3000740</div><div style={{fontSize:34}}>CC BY 4.0 · cropped / slowed / held ending</div></>:photo>.5?'Plant photograph · Lucy Bradley / CC0':state.overlay>.05?'Illustration · calcium inside leaf cells':'Botanical reconstruction'}</div>
 {state.trial&&<div data-critical="label" style={{position:'absolute',left:120,top:335,width:740,fontSize:40}}>{state.trial}</div>}
 {state.overlay>.05&&<div data-critical="disclosure" style={{position:'absolute',left:120,top:1290,width:740,fontSize:36,lineHeight:1.3}}>Illustrative calcium · time compressed</div>}
 {scene===5&&t>3.7&&<div data-critical="label" style={{position:'absolute',left:120,top:1290,width:740,fontSize:40}}>Still open</div>}
 {scene===6&&signalAge!==null&&<div data-critical="disclosure" style={{position:'absolute',left:120,top:1290,width:740,fontSize:36}}>{scene===6?`Signal ${signal===1.4?'1':'2'} · one movement`:'Electrical signal · illustrative cue'}</div>}
 {active&&<div data-critical="caption-midpoint" style={{position:'absolute',left:active.bounds.x,top:active.bounds.y,width:active.bounds.width,height:active.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:54,lineHeight:1.24,fontWeight:600,textShadow:'0 2px 9px #102318'}}><span data-caption="text">{active.lines.map((line,i)=><React.Fragment key={i}>{i>0&&<br/>}{line}</React.Fragment>)}</span></div>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)+1} layout="none"><Audio src={staticFile(c.file)}/></Sequence>)}
 </AbsoluteFill>;
};
