import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Img,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import plan from '../production/plans/devils-hole-v2.json';
import captions from '../captions/plans/devils-hole-v2.json';
import narration from '../production/narration/devils-hole.json';
import sound from '../production/narration/devils-hole-soundscape.json';
import mix from '../production/narration/devils-hole-v2-mix.json';
import {DevilsHoleLocalityV2} from '../components/DevilsHoleLocalityV2';
import {DevilsHoleGlobeV2,globePoint} from '../components/DevilsHoleGlobeV2';
import {projectDevilsHole} from '../production/visuals/devils-hole-projection';
import {DevilsHoleWaterV2,PupfishV2} from '../components/DevilsHoleWaterV2';
const clamp=(n:number)=>Math.max(0,Math.min(1,n)),ease=(n:number)=>{const p=clamp(n);return p*p*(3-2*p);};
const Label=({children,x=110,y=320,size=36}:{children:React.ReactNode;x?:number;y?:number;size?:number})=><div data-critical="scene-text" style={{position:'absolute',left:x,top:y,fontSize:size,lineHeight:1.25,color:'#F3EEE2',textShadow:'0 2px 8px #00131C',fontWeight:400}}>{children}</div>;
export const DevilsHoleV2=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load Devils Hole V2 film')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 52px Manrope'),document.fonts.load('400 36px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame),time=(frame-beat.frames.start)/30,globalTime=frame/30;
 const observed=index===9&&time>=3.2,ending=index===10,longitude=index===1?205-42*ease(time/6):200+Math.sin(time*.14)*5;
 const origin=globePoint(160.2395,52.4948,longitude,40),nevada=globePoint(-116.3,36.4,longitude,40);
 const habitat=index===8||index===9;
 const zoom=habitat?1.75+.25*ease(time/1.2):index===3?1.2:index===7?1.45:index===6?1.45+.10*ease(time/5):index===5?1.35+.15*ease(time/6):1;
 const fish1=projectDevilsHole([-.65,-.12,.5],globalTime,zoom),fish2=projectDevilsHole([.5,-.3,.5],globalTime,zoom),ref1=projectDevilsHole([-1.28,0.,.64],globalTime,zoom),ref2=projectDevilsHole([1.28,0.,.64],globalTime,zoom);
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.dataset.critical==='scene'?'Local water / original spatial explanation':e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');console.log('DEVILS_V2_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 52px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);},[frame,inspectQa,cue,ready,handle]);
 return <AbsoluteFill ref={root} style={{background:'#02151E',fontFamily:'Manrope',color:'#F3EEE2',overflow:'hidden'}}>
  {(index===0||index===2||index===3||index===7||ending)?<><DevilsHoleLocalityV2 time={globalTime} zoom={ending?1.07-.07*ease(time/4):index===0?1+.055*ease(time/5):index===3?1.15+.1*ease(time/3):1.12}/>{ending&&<div style={{position:'absolute',inset:0,opacity:.45*(1-ease(time/2.4)),mixBlendMode:'screen'}}><DevilsHoleGlobeV2 time={globalTime} energy={.7}/></div>}</>:
   (index===1||index===4)?<DevilsHoleGlobeV2 time={index===4?time:globalTime} longitude={longitude} energy={index===4?1:0}/>:
   observed?<><Img src={staticFile('images/devils-hole-v2/nps-2025-07-30-shelf.png')} style={{width:1080,height:1920,objectFit:'cover',objectPosition:'47% 50%',opacity:.85}}/><div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#061C26 0%,transparent 40%,transparent 70%,#061C26 100%)'}}/></>:
   <DevilsHoleWaterV2 time={globalTime} forcing={index===5} zoom={zoom} habitat={habitat} sideOn={index===6}/>
  }
  <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(1,13,20,.97) 0%,rgba(1,13,20,.8) 16%,transparent 33%,transparent 72%,rgba(1,13,20,.5) 100%)'}}/>
  <div data-critical="scene" style={{position:'absolute',left:110,top:460,width:770,height:790,pointerEvents:'none'}}/>
  {index===0&&<><Label size={46}>Devils Hole · Nevada</Label><Label y={385} size={30}>Kamchatka earthquake · nearly 4,000 miles away</Label><svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d="M174 441C190 545 275 580 407 713" stroke="#D7A667" strokeWidth="2" strokeDasharray="4 7" fill="none"/><circle cx="174" cy="441" r={8+Math.sin(globalTime*3)*2} fill="#E4AD6B"/></svg></>}
  {index===1&&<><Label size={45}>Off Kamchatka</Label><Label y={1180} size={32}>July 29, 2025{time>2.4?' · M 8.8':''}</Label><svg width="1080" height="1920" style={{position:'absolute',inset:0}}><circle cx={origin.x} cy={origin.y} r="11" fill="#E4AE70"/><circle cx={origin.x} cy={origin.y} r={20+(time*12)%30} fill="none" stroke="#E4AE70" strokeWidth="2" opacity=".6"/></svg></>}
  {index===2&&<><Label size={42}>Devils Hole · Nevada</Label><Label y={1180} size={36}>21 minutes later</Label></>}
  {index===3&&<Label size={42}>The water was already here</Label>}
  {index===4&&<><Label size={46}>Seismic energy</Label><Label y={385} size={32}>Through Earth · not ocean water</Label><svg width="1080" height="1920" style={{position:'absolute',inset:0}}><circle cx={origin.x} cy={origin.y} r="10" fill="#E4AE70"/><circle cx={nevada.x} cy={nevada.y} r="9" fill="#80D2D2"/>{time>1.9&&<circle cx={nevada.x} cy={nevada.y} r={16+(time*9)%18} fill="none" stroke="#80D2D2" strokeWidth="2"/>}</svg></>}
  {index===5&&<><Label size={42}>Moving rock → rocking water</Label><Label y={1210} size={29}>Ground motion exaggerated · qualitative</Label><svg width="1080" height="1920" style={{position:'absolute',inset:0}}><path d={`M148 520V980M${ref1.x} ${ref1.y}L${ref2.x} ${ref2.y}`} stroke="#F1D8B7" strokeWidth="2" opacity=".35" strokeDasharray="7 8"/><path d={`M${149+Math.sin(globalTime*2.15)*9} 760V990`} stroke="#E4AE70" strokeWidth="5"/></svg><Label x={210} y={520} size={28}>Ground</Label><Label x={535} y={715} size={32}>Local water</Label></>}
  {index===6&&<><Label size={48}>Seismic seiche</Label><Label y={1180} size={33}>A local slosh ≠ an ocean tsunami</Label></>}
  {index===7&&<><Label size={50}>About 10 inches</Label><Label y={385} size={30}>NPS-reported waves</Label></>}
  {habitat&&!observed&&<><Label size={42}>{index===8?'A shallow feeding shelf':'A minor disturbance'}</Label><PupfishV2 x={fish1.x-52} y={fish1.y-29} time={globalTime}/><PupfishV2 x={fish2.x-52} y={fish2.y-29} time={globalTime+1} flip/>{index===9&&[0,1,2,3].map(i=>{const p=clamp((time-i*.16)/2.8),point=projectDevilsHole([-.36+p*(.45+i*.045),-.36-p*(.28+i*.04),.56],globalTime,zoom);return <div key={i} style={{position:'absolute',left:point.x,top:point.y,width:5,height:4,borderRadius:'50%',background:'#BFC394',opacity:1-p*.6}}/>;})}<Label y={1180} size={30}>{index===8?'Food and spawning depend on this shelf':'Some material moves; the shelf remains'}</Label></>}
  {observed&&<><Label size={38}>Actual NPS monitoring still</Label><Label y={380} size={32}>July 30, 2025 · the following day</Label></>}
  {ending&&<><Label size={42}>Distant energy. Local water.</Label><div data-critical="brand" style={{position:'absolute',left:110,top:1225,fontSize:24,letterSpacing:4,opacity:.65}}>MAGNIVIS</div></>}
  <div data-critical="disclosure" data-disclosure style={{position:'absolute',left:110,top:1305,fontSize:26,lineHeight:1.25,color:'#DBD8CF',textShadow:'0 1px 5px #00121D'}}>{observed?<>{'NPS · No claim to original U.S. Government works'}</>:index===0||index===2||index===3||index===7||ending?'Illustrative reconstruction · not event footage':habitat?'Original habitat illustration · not to scale':index===4?'Original animation · seismic travel time compressed':'Original animation · motion/paths schematic'}</div>
  {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/3),clamp((cue.endFrame-frame)/3))}}><div data-caption-text style={{fontSize:52,fontWeight:600,lineHeight:1.25,whiteSpace:'pre',color:'#F6F2E8',textShadow:'0 2px 9px #00131D'}}>{cue.lines.join('\n')}</div></div>}
  <Audio src={staticFile(sound.file)} volume={mix.soundGain}/>
  {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={mix.narrationGain}/></Sequence>)}
 </AbsoluteFill>;
};
