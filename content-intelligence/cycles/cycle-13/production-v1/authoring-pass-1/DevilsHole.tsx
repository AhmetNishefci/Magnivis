import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {SeicheBasin} from '../components/SeicheBasin';
import {EarthEnergy,SeismicConnection} from '../components/SeismicConnection';
import plan from '../production/plans/devils-hole.json';
import captions from '../captions/plans/devils-hole.json';
import narration from '../production/narration/devils-hole.json';
import sound from '../production/narration/devils-hole-soundscape.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const DevilsHole=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Load Devils Hole typography')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 52px Manrope'),document.fonts.load('400 30px Manrope')]).then(()=>setReady(true)).catch(e=>{throw e;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end)),beat=plan.beats[index]!,cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame),time=(frame-beat.frames.start)/30;
 useEffect(()=>{if(!ready||!root.current)return;if(!inspectQa){continueRender(handle);return;}const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.dataset.critical==='scene'?'Original geographic, ground-water and habitat explanation':e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const scene=root.current.querySelector('[data-critical=scene]');if(scene){const walker=document.createTreeWalker(scene,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(!node.textContent?.trim())continue;let opacity=1;for(let el=node.parentElement;el&&el!==scene;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);if(opacity<.05)continue;const range=document.createRange();range.selectNodeContents(node);const r=range.getBoundingClientRect();bounds.push({kind:'scene-text',text:node.textContent,x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height});}}
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');console.log('DEVILS_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 52px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));continueRender(handle);},[frame,inspectQa,cue,ready,handle]);
 const paired=index<3||index===10,zoom=clamp(time/1.1),shelf=index===8||index===9;
 return <AbsoluteFill ref={root} style={{background:'radial-gradient(ellipse at 40% 42%,#E7D7B5 0%,#CCB792 65%,#B69B75 100%)',fontFamily:'Manrope',color:'#3D3E34',overflow:'hidden'}}>
  <div data-critical="brand" style={{position:'absolute',left:110,top:254,fontSize:26,letterSpacing:5,color:'#6B6655'}}>MAGNIVIS</div>
  <div data-critical="title" style={{position:'absolute',left:110,top:307,fontSize:45,fontWeight:600,lineHeight:1.2}}>Waves in the desert</div>
  <div data-critical="scene" style={{position:'absolute',left:110,top:390,width:770,height:920}}>
   <svg viewBox="0 0 770 920" width="770" height="920">
    {paired?<><svg x="0" y={index===1?75:0} width="770" height="320"><SeismicConnection time={frame/30} event={index===1} ending={index===10}/></svg>
     {index===1&&<text x="35" y="38" fontSize="34" fill="#514B3F">July 29, 2025</text>}
     <text x="30" y={index===1?445:370} fontSize="33" fill="#205F66">Devils Hole · Nevada</text>
     <svg x="140" y={index===1?475:400} width="490" height={index===1?430:485}><SeicheBasin time={frame/30} quiet={index===10}/></svg>
     {index===0&&<text x="30" y="863" fontSize="32" fill="#514B3F">Nearly 4,000 miles apart</text>}
     {index===2&&<text x="30" y="863" fontSize="36" fill="#514B3F">21 minutes later</text>}
     {index===10&&<text x="30" y="870" fontSize="30" fill="#514B3F">Distant energy. Local water.</text>}
    </>:index===4?<svg x="0" y="60" width="770" height="680"><EarthEnergy time={time}/></svg>:<>
     <text x="25" y="50" fontSize={index===6?44:37} fill="#205F66">{index===3?'The water was already here':index===5?'Ground moves. Water rocks.':index===6?'Seismic seiche':index===7?'About 10 inches':index===8?'A tiny habitat':'A minor disturbance'}</text>
     <svg x="0" y="95" width="770" height="650" viewBox={shelf?`${140*zoom} ${260*zoom} ${770-290*zoom} ${650-300*zoom}`:'0 0 770 650'}><SeicheBasin time={index===9?time:frame/30} cutaway shelf={shelf} disturbance={index===9}/></svg>
     {index===5&&<><path d="M80 780H150M80 780L92 770M80 780L92 790M150 780L138 770M150 780L138 790" stroke="#7A6248" strokeWidth="3"/><text x="185" y="790" fontSize="29" fill="#62594A">Ground motion exaggerated</text></>}
     {index===3&&<text x="30" y="806" fontSize="31" fill="#514B3F">No ocean water traveled here</text>}
     {index===6&&<text x="30" y="806" fontSize="31" fill="#514B3F">Enclosed-water slosh ≠ ocean tsunami</text>}
     {index===7&&<text x="30" y="806" fontSize="30" fill="#514B3F">Reported by NPS · motion schematic</text>}
     {index===8&&<text x="30" y="806" fontSize="31" fill="#514B3F">Shallow feeding & spawning shelf</text>}
     {index===9&&<text x="30" y="806" fontSize="30" fill="#514B3F">Some material moved; habitat persists</text>}
    </>}
   </svg>
  </div>
  <div data-disclosure data-critical="disclosure" style={{position:'absolute',left:110,top:1330,fontSize:27,lineHeight:1.25,color:'#62594A'}}>Original animation · schematic reconstruction</div>
  {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/3),clamp((cue.endFrame-frame)/3))}}><div data-caption-text style={{fontSize:52,fontWeight:600,lineHeight:1.25,whiteSpace:'pre',color:'#2C3C38'}}>{cue.lines.join('\n')}</div></div>}
  <Audio src={staticFile(sound.file)} volume={1}/>
  {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={.9}/></Sequence>)}
 </AbsoluteFill>;
};
