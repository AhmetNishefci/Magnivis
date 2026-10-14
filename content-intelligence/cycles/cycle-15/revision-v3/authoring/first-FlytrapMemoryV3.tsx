import React,{useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Img,OffthreadVideo,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/600.css';
import narration from '../production/narration/flytrap.json';
import caption from '../captions/plans/flytrap-v3.json';
import {v3State,chemistryEligible} from '../production/flytrap-v3/choreography';
import {FlytrapCalciumTraceV3} from '../components/FlytrapCalciumTraceV3';
import {smooth} from '../production/flytrap/model';
const imageFor=(macro:boolean)=>staticFile(`images/flytrap-v3/${macro?'hair-macro':'open-trap'}.png`);
export const FlytrapMemoryV3:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Flytrap V3 typography')),[ready,setReady]=useState(false);
 useEffect(()=>{document.fonts.load('600 54px Manrope').then(()=>setReady(true));},[]);
 useEffect(()=>{if(!ready||!root.current)return;if(inspectQa){const origin=root.current.getBoundingClientRect();const bounds=Array.from(root.current.querySelectorAll<HTMLElement>('[data-critical]')).filter(e=>{let opacity=1;for(let el:Element|null=e;el&&el!==root.current;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);return opacity>.05;}).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const box=root.current.querySelector<HTMLElement>('[data-critical="caption-midpoint"]'),inner=root.current.querySelector<HTMLElement>('[data-caption]');console.log('FLYTRAP_V3_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:true}));}continueRender(handle);},[frame,ready,inspectQa,handle]);
 const scene=narration.cues.reduce((last,n,i)=>frame>=Math.round(n.start*30)?i:last,0),cue=narration.cues[scene]!,t=(frame-Math.round(cue.start*30))/30,s=v3State(scene,t),active=caption.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame),isMacro=s.shot==='macro'||s.shot==='bridge';
 const doc=s.shot==='first'||s.shot==='recent'||s.shot==='single'||s.shot==='closure';
 const video=s.shot==='first'?'video/flytrap-v2/first-stimulus.mp4':s.shot==='recent'?'video/flytrap-v3/recent-stimulus.mp4':s.shot==='single'?'video/flytrap-v3/one-movement.mp4':'video/flytrap-v3/closure.mp4';
 const videoStart=Math.round(cue.start*30)+(s.shot==='closure'?Math.round(5.65*30):0);
 const isClosure=s.shot==='closure',width=s.shot==='single'?700:770,height=isClosure?646.8:s.shot==='single'?777.8:962.5;
 const documentaryCredit=isClosure?'Poppinga et al. (2016)':'Burri et al. (2020)',doi=isClosure?'10.3762/bjnano.7.59':'10.1371/journal.pbio.3000740';
 return <AbsoluteFill ref={root} style={{fontFamily:'Manrope',background:'#14201a',color:'#fbf6ea'}}>
 <Img src={imageFor(false)} style={{width:'100%',height:'100%',objectFit:'cover',filter:doc?'blur(35px) brightness(.32)':'none'}}/>
 {!doc&&s.shot!=='context'&&<div style={{position:'absolute',inset:0,transform:`translate(${s.shiftX}px,${s.shiftY}px) scale(${s.scale})`,transformOrigin:'48% 49%'}}>
 <Img src={imageFor(isMacro)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 {chemistryEligible(s.shot)&&<FlytrapCalciumTraceV3 calcium={s.calcium} residue={s.residue} macro={isMacro} signal={s.signal}/>}
 {s.shot==='bridge'&&<><FlytrapCalciumTraceV3 calcium={0} residue={0} macro signal={0}/><div style={{position:'absolute',left:110,top:430,width:770,height:962.5,opacity:1-s.transition}}><Img src={staticFile('images/flytrap-v3/source-hair-bridge.png')} style={{width:'100%',height:'100%'}}/></div></>}
 </div>}
 {s.shot==='context'&&<Img src={staticFile('images/flytrap-v2/lucy-bradley-cc0.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'54% center',transform:`scale(${1.02+.04*smooth(t,0,6)})`}}/>}
 {doc&&<Sequence from={videoStart} durationInFrames={Math.round((scene===4?3.5:scene===6?6.266667:scene===1?7.066667:1.4)*30)} layout="none"><div data-critical="documentary-macro" style={{position:'absolute',left:110,top:isClosure?560:430,width,height,overflow:'hidden'}}><OffthreadVideo src={staticFile(video)} muted style={{width,height}}/></div></Sequence>}
 <AbsoluteFill style={{background:'linear-gradient(180deg,#102016cc 0%,#10201611 30%,transparent 56%,#102016ee 83%)'}}/>
 <div data-critical="disclosure" style={{position:'absolute',left:120,top:260,width:740,fontSize:36,lineHeight:1.25,textShadow:'0 2px 9px #102318'}}>{doc?<><div>Research footage · {documentaryCredit}</div><div style={{fontSize:34}}>doi.org/{doi}</div><div style={{fontSize:34}}>{isClosure?'CC BY 2.0 · cropped / source 5× slow':s.shot==='first'?'CC BY 4.0 · cropped / slowed / held ending':'CC BY 4.0 · cropped / source timing'}</div></>:s.shot==='context'?'Plant photograph · Lucy Bradley / CC0':s.shot==='bridge'?'Source → botanical illustration':s.calcium>.01?'Illustration · calcium response':'Botanical illustration'}</div>
 {s.trial&&<div data-critical="label" style={{position:'absolute',left:120,top:390,width:740,fontSize:38,lineHeight:1.2}}>{s.trial}</div>}
 {s.stateLabel&&<div data-critical="label" style={{position:'absolute',left:120,top:1270,width:740,fontSize:38,lineHeight:1.25}}>{s.stateLabel}</div>}
 {!doc&&s.calcium>.01&&<div data-critical="disclosure" style={{position:'absolute',left:120,top:1350,width:740,fontSize:34}}>Schematic marks · compressed timing</div>}
 {scene===6&&s.signal>0&&<div data-critical="label" style={{position:'absolute',left:120,top:1360,width:740,fontSize:36}}>Signal {s.signal===1?'1':'2'} · same movement</div>}
 {active&&<div data-critical="caption-midpoint" style={{position:'absolute',left:active.bounds.x,top:active.bounds.y,width:active.bounds.width,height:active.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:54,lineHeight:1.24,fontWeight:600,textShadow:'0 2px 9px #102318'}}><span data-caption="text">{active.lines.map((line,i)=><React.Fragment key={i}>{i>0&&<br/>}{line}</React.Fragment>)}</span></div>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)+1} layout="none"><Audio src={staticFile(c.file)}/></Sequence>)}
 </AbsoluteFill>;
};
