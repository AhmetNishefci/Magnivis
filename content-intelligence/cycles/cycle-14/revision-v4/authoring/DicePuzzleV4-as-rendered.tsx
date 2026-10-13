import React,{useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import narration from '../production/narration/dice-v4.json';
import captions from '../captions/plans/dice-v4.json';
import sound from '../production/narration/dice-v4-soundscape.json';
import {ids,type DieId} from '../production/dice-v4/model';
import {poseAt,smooth} from '../production/dice-v4/choreography';
import {DiceMaterialWorldV4} from '../components/DiceMaterialWorldV4';
import {EvidenceText,MixedProofV4,SixFaceFanV4} from '../components/DiceFaceEvidenceV4';
const name=(id:DieId)=>id[0]!.toUpperCase()+id.slice(1);
export const DicePuzzleV4=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('V4 typography')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 52px Manrope'),document.fonts.load('700 158px Manrope')]).then(()=>setReady(true));},[]);
 const index=narration.cues.reduce((last,c,i)=>frame>=Math.round(c.start*30)?i:last,0),cue=narration.cues[index]!,t=frame/30-cue.start,poses=ids.map(id=>poseAt(index,id,t)),active=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!ready||!root.current)return;if(inspectQa){const origin=root.current.getBoundingClientRect(),bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).filter(e=>{let opacity=1;for(let el:Element|null=e;el&&el!==root.current;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);return opacity>.10;}).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const box=root.current.querySelector<HTMLElement>('[data-critical="caption-midpoint"]'),inner=root.current.querySelector<HTMLElement>('[data-caption-text]');console.log('DICE_V4_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 52px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));}continueRender(handle);},[frame,ready,inspectQa,handle]);
 if(!ready)return <AbsoluteFill style={{background:'#201209'}}/>;
 const view=index===8?smooth(t,0,1.2)*.90:index===4?.55:index===5?.70:index===7?.08:.20+.08*Math.sin(t*.4);
 const mixed=index===4||index===5,loss=index===7&&t>3.1;
 return <AbsoluteFill ref={root} style={{background:'#201209',fontFamily:'Manrope',overflow:'hidden'}}>
 <DiceMaterialWorldV4 poses={poses} time={frame/30} view={view}/>
 <svg viewBox="0 0 1080 1920" style={{position:'absolute',width:'100%',height:'100%'}}>
 <defs><linearGradient id="speech-shade" x2="0" y2="1"><stop stopColor="#160E09" stopOpacity="0"/><stop offset="1" stopColor="#160E09" stopOpacity=".70"/></linearGradient><marker id="counter-arrow-v4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#D7C499"/></marker></defs>
 <rect y="1370" width="1080" height="550" fill="url(#speech-shade)"/>
 {ids.map((id,i)=>{const p=poses[i]!,small=p.size<110;const isMixedActive=mixed&&(index===4?(id==='green'||id==='blue'):(id==='orange'||id==='green'));return <g key={id}>
 {inspectQa&&<rect data-critical="die" x={p.x-p.size*.63} y={p.y-p.size*.66} width={p.size*1.26} height={p.size*1.32} fill="none"/>}
 {!isMixedActive&&<g opacity={index===0?1:smooth(t,.65,1.0)}><EvidenceText x={p.x} y={small?p.y+55:p.y+p.size*.66+45} size={small?28:36}>{name(id)}</EvidenceText></g>}
 </g>;})}
 {index===0&&t<3.1&&<g opacity={1-smooth(t,2.5,3.1)}><EvidenceText x={490} y={340} size={38}>HIGHER NUMBER WINS</EvidenceText></g>}
 {index===1&&<g data-disclosure><text data-critical="disclosure" x="490" y="1360" textAnchor="middle" fontSize="31" fill="#E8D7C1">Ideal dice · equal faces · independent rolls</text></g>}
 {index===2&&<><SixFaceFanV4 id="orange" t={t} opponentValue={3}/>{t>5.8&&<g opacity={smooth(t,5.8,6.5)}><EvidenceText x={490} y={360} size={58}>4 / 6 · 2 / 3</EvidenceText></g>}</>}
 {index===3&&<><SixFaceFanV4 id="blue" t={t} opponentValue={3} reverse/>{t>2.85&&<g opacity={smooth(t,2.85,3.5)}><EvidenceText x={490} y={360} size={58}>4 / 6 · 2 / 3</EvidenceText></g>}</>}
 {mixed&&<g opacity={smooth(t,.50,.95)}><MixedProofV4 kind={index===4?'green':'orange'} t={t}/><EvidenceText x={index===4?310:670} y={420} size={42}>{index===4?'Green':'Orange'}</EvidenceText></g>}
 {index===6&&t>.8&&<g opacity={smooth(t,.8,1.25)}><EvidenceText x={485} y={420} size={56}>Yellow counters orange.</EvidenceText><EvidenceText x={485} y={1040} size={56}>2 / 3</EvidenceText></g>}
 {index===7&&<><EvidenceText x={490} y={405} size={46}>{loss?'3 < 6':'Better odds.'}</EvidenceText>{loss&&<g data-disclosure><text data-critical="disclosure" x="490" y="1340" textAnchor="middle" fontSize="31" fill="#E8D7C1">Illustrated possible loss · not a trial</text></g>}</>}
 {index===8&&<><g opacity={smooth(t,.75,1.2)}><EvidenceText x={490} y={350} size={36}>Choice → favored counter</EvidenceText><EvidenceText x={490} y={820} size={61}>2 / 3</EvidenceText><EvidenceText x={490} y={885} size={30}>for each reply shown</EvidenceText></g>{['M590 585Q730 620 742 715','M742 990Q720 1110 605 1180','M375 1180Q240 1140 238 1000','M238 710Q250 570 372 535'].map((d,i)=><path key={i} d={d} fill="none" stroke="#D7C499" strokeWidth="7" strokeLinecap="round" markerEnd="url(#counter-arrow-v4)" opacity={smooth(t,.8+i*.20,1.4+i*.20)}/> )}</>}
 </svg>
 {active&&<div data-critical="caption-midpoint" style={{position:'absolute',left:active.bounds.x,top:active.bounds.y,width:active.bounds.width,height:active.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:52,lineHeight:1.24,fontWeight:600,color:'#FFF6E5',textShadow:'0 2px 8px #0C0704'}}><span data-caption-text>{active.lines.map((line,i)=><React.Fragment key={i}>{i>0&&<br/>}{line}</React.Fragment>)}</span></div>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)+1} layout="none"><Audio src={staticFile(c.file)}/></Sequence>)}
 <Audio src={staticFile(sound.file)} volume={.35}/>
 </AbsoluteFill>;
};
