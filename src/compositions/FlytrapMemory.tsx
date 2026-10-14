import React,{useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/600.css';
import narration from '../production/narration/flytrap.json';
import caption from '../captions/plans/flytrap.json';
import {FlytrapLeaf} from '../components/FlytrapLeaf';
import {flytrapState,smooth} from '../production/flytrap/model';
export const FlytrapMemory:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const f=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Flytrap typography')),[ready,setReady]=useState(false);
 useEffect(()=>{document.fonts.load('600 54px Manrope').then(()=>setReady(true));},[]);
 useEffect(()=>{if(!ready||!root.current)return;if(inspectQa){const origin=root.current.getBoundingClientRect();const bounds=Array.from(root.current.querySelectorAll<HTMLElement>('[data-critical]')).filter(e=>{let opacity=1;for(let el:Element|null=e;el&&el!==root.current;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);return opacity>.05;}).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const box=root.current.querySelector<HTMLElement>('[data-critical="caption-midpoint"]'),inner=root.current.querySelector<HTMLElement>('[data-caption]');console.log('FLYTRAP_LAYOUT_QA '+JSON.stringify({frame:f,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:true}));}continueRender(handle);},[f,ready,inspectQa,handle]);
 const scene=narration.cues.reduce((last,n,i)=>f>=Math.round(n.start*30)?i:last,0),n=narration.cues[scene]!,t=(f-Math.round(n.start*30))/30;
 const state=flytrapState(scene,t),active=caption.cues.find(c=>f>=c.startFrame&&f<c.endFrame),signal=state.events.find(e=>t>=e&&t<e+1.25),signalAge=signal===undefined?null:t-signal;
 const trialFade=(scene===5||scene===6)?smooth(t,0,.35):1;
 const scale=scene===1?1.18:scene===6?1.2:scene===7?1.05-.05*smooth(t,0,3):1+.025*Math.sin(f/110);
 const internal=state.tissue>.05;
 return <AbsoluteFill ref={root} style={{fontFamily:'Manrope',background:'#24372b',color:'#fbf6ea'}}>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 32% 30%, #677c46 0%, #354e31 45%, #17291f 85%)'}}/>
 <svg width="1080" height="1920" style={{position:'absolute',filter:'blur(24px)',opacity:.25}}><ellipse cx="-30" cy="900" rx="235" ry="900" transform="rotate(22)" fill="#9fa66f"/><ellipse cx="970" cy="960" rx="100" ry="800" transform="rotate(-20 970 960)" fill="#94a26c"/></svg>
 <div style={{position:'absolute',left:90,top:450,transform:`translate(${Math.sin(f/90)*6}px,${Math.cos(f/115)*7}px) scale(${scale})`,opacity:trialFade,filter:'drop-shadow(18px 35px 20px #13201790)'}}><FlytrapLeaf {...state} time={f/30} probe={scene===1?state.bend>0?.9:0:scene===6?state.bend>0?.9:0:0} signalAge={signalAge}/></div>
 <div data-critical="disclosure" style={{position:'absolute',left:130,top:280,width:730,fontSize:36,lineHeight:1.3,color:'#edeedb'}}>{internal?'Internal calcium response · illustration':scene===6?'Electrical signals · illustrative cues':'Botanical reconstruction'}</div>
 {state.trial&&<div data-critical="label" style={{position:'absolute',left:130,top:350,width:730,fontSize:40}}>{state.trial}</div>}
 {internal&&<div data-critical="disclosure" style={{position:'absolute',left:130,top:1285,width:730,fontSize:34,color:'#e1e8ce'}}>Color represents calcium · time compressed</div>}
 {scene===5&&t>3.65&&<div data-critical="label" style={{position:'absolute',left:130,top:1285,fontSize:40}}>Still open</div>}
 {scene===1&&signalAge!==null&&<div data-critical="disclosure" style={{position:'absolute',left:130,top:1285,width:730,fontSize:36}}>Electrical signal · illustrative cue</div>}
 {scene===6&&signalAge!==null&&<div data-critical="label" style={{position:'absolute',left:130,top:1285,fontSize:40}}>Signal {signal===1.5?'1':'2'} · one continuous movement</div>}
 {active&&<div data-critical="caption-midpoint" style={{position:'absolute',left:active.bounds.x,top:active.bounds.y,width:active.bounds.width,height:active.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:54,lineHeight:1.24,fontWeight:600,textShadow:'0 2px 8px #132017'}}><span data-caption="text">{active.lines.map((line,i)=><React.Fragment key={i}>{i>0&&<br/>}{line}</React.Fragment>)}</span></div>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)+1} layout="none"><Audio src={staticFile(c.file)}/></Sequence>)}
 </AbsoluteFill>;
};
