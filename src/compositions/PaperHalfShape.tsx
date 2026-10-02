import {useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import {Dimension,InkLabel,PrintedDesign,Sheet,paperInk,paperRed} from '../components/PaperObjects';
import {adjacentLengthScale,idealSheet,nominalPaper,paperRatio} from '../production/paper-geometry';
import plan from '../production/plans/paper.json';
import captions from '../captions/plans/paper.json';
import narration from '../production/narration/paper.json';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const x=clamp(n);return x*x*(3-2*x);};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const sceneTitles=['A4 HAS A HIDDEN RULE','A SQUARE FAILS THE TEST','THE DIAGONAL IS THE KEY','CUT. TURN. SAME RATIO.','THE DESIGN STILL FITS','LENGTH ≠ AREA','THE REAL-WORLD LIMIT','HALF. SAME SHAPE.'];

const CutAndTurn=({progress,edgeLabels=false,payoff=false}:{progress:number;edgeLabels?:boolean;payoff?:boolean})=>{
 const {width:w,height:h}=idealSheet(340);
 const split=smooth((progress-.13)/.20),turn=smooth((progress-.37)/.31);
 const parentOpacity=payoff?.7:.42;
 return <g data-critical="proof">
  <Sheet x={490} y={858} w={w} h={h} outline opacity={turn*parentOpacity}/>
  <Sheet x={490-split*95} y={858-h/4-split*70} w={w} h={h/2} opacity={1-turn}>
   <path d={`M${-w/2+30} ${-h/4+30} h110`} stroke={paperInk} strokeWidth={5} opacity={.28}/>
  </Sheet>
  <Sheet x={490} y={lerp(858+h/4,858,turn)} w={w} h={h/2} rotation={90*turn}>
   <circle cx={70} cy={0} r={25} fill={paperRed} opacity={.8}/>
   <path d="M-130 -55 h110 M-130 -31 h70" stroke={paperInk} strokeWidth={5} opacity={.32}/>
  </Sheet>
  <line x1={320} x2={320+w*smooth(progress/.18)} y1={858} y2={858} stroke={paperRed} strokeWidth={4} opacity={1-split}/>
  {turn>.95&&<g><InkLabel x={490} y={1180} size={42}>Same proportions</InkLabel><InkLabel x={490} y={1240} size={34} color={paperRed}>Half the area</InkLabel></g>}
  {edgeLabels&&<g opacity={smooth((progress-.72)/.12)}>
   <Dimension x1={490-h/4} y1={1028} x2={490+h/4} y2={1028} label="√2 / 2" lx={490} ly={1090} color={paperRed}/>
   <Dimension x1={650} y1={688} x2={650} y2={1028} label="1" lx={700} ly={872}/>
  </g>}
 </g>;
};
const Scene=({index,progress}:{index:number;progress:number})=>{
 if(index===0||index===7)return <CutAndTurn progress={index===7?.4+progress*.6:progress} payoff={index===7}/>;
 if(index===1){const turn=smooth((progress-.33)/.35);return <g data-critical="proof">
  <Sheet x={490} y={850} w={370} h={370} outline opacity={.35}/>
  <Sheet x={490-turn*90} y={757.5-turn*80} w={370} h={185} opacity={1-turn}/>
  <Sheet x={490} y={lerp(942.5,850,turn)} w={370} h={185} rotation={turn*90}/>
  <line x1={305} x2={675} y1={850} y2={850} stroke={paperRed} strokeWidth={4} opacity={1-turn}/>
  <InkLabel x={490} y={1150} color={paperRed}>1 : 1 → 1 : 2</InkLabel>
  <InkLabel x={490} y={1210} size={34}>The proportions change</InkLabel>
 </g>;}
 if(index===2){const unfold=smooth((progress-.2)/.4);const w=330;return <g data-critical="proof">
  <Sheet x={490} y={850} w={w} h={w*lerp(1,paperRatio,unfold)}/>
  <rect x={325} y={850-w*paperRatio/2} width={w} height={w} fill="none" stroke={paperInk} strokeWidth={3} strokeDasharray="10 7"/>
  <line x1={325} y1={850-w*paperRatio/2} x2={655} y2={850-w*paperRatio/2+w} stroke={paperRed} strokeWidth={5}/>
  <InkLabel x={505} y={825} color={paperRed} size={46}>√2</InkLabel>
  <Dimension x1={325} y1={1140} x2={655} y2={1140} label="1" lx={490} ly={1195}/>
  <Dimension x1={690} y1={850-w*paperRatio/2} x2={690} y2={850+w*paperRatio/2} label="√2" lx={755} ly={867} color={paperRed}/>
  <InkLabel x={490} y={1240} size={32}>The diagonal of a unit square</InkLabel>
 </g>;}
 if(index===3)return <g><CutAndTurn progress={progress} edgeLabels/>{progress>.8&&<InkLabel x={490} y={570} size={41}>1 ÷ (√2 / 2) = √2</InkLabel>}</g>;
 if(index===4){const scale=lerp(1,adjacentLengthScale,smooth((progress-.12)/.55));return <g data-critical="proof">
  <Sheet x={490} y={865} w={340} h={340*paperRatio} outline opacity={.42}/>
  <g transform={`translate(490 865) scale(${scale})`}><Sheet x={0} y={0} w={340} h={340*paperRatio}/><PrintedDesign/></g>
  <InkLabel x={490} y={565} size={42}>{progress<.4?'A3':'A3 → A4'}</InkLabel>
  <InkLabel x={490} y={1200} size={38}>No stretching</InkLabel>
 </g>;}
 if(index===5){const size=420*lerp(1,adjacentLengthScale,smooth(progress/.3));return <g data-critical="proof">
  <Sheet x={490} y={850} w={420} h={420*paperRatio} outline opacity={.35}/>
  <line x1={280} x2={700} y1={850} y2={850} stroke={paperRed} strokeWidth={3} strokeDasharray="10 8" opacity={.5}/>
  <Sheet x={490} y={850} w={size} h={size*paperRatio}/>
  <rect x={490-size/2} y={850-size*paperRatio/2} width={size} height={size*paperRatio} fill={paperInk} opacity={.1}/>
  <Dimension x1={490-size/2} y1={580} x2={490+size/2} y2={580} label="length × 0.707…" lx={490} ly={530}/>
  <InkLabel x={490} y={850} size={60}>50%</InkLabel>
  <InkLabel x={490} y={910} size={30}>of the original area</InkLabel>
  <InkLabel x={490} y={1195} size={46} color={paperRed}>area × 0.5</InkLabel>
  <InkLabel x={490} y={1240} size={34}>70.7% length • 50% area</InkLabel>
 </g>;}
 return <g data-critical="proof">
  <Sheet x={490} y={810} w={340} h={340*nominalPaper.a4.height/nominalPaper.a4.width}/>
  <InkLabel x={490} y={760} size={52}>A4</InkLabel><InkLabel x={490} y={831} size={41}>210 × 297 mm</InkLabel>
  <InkLabel x={490} y={910} size={34} color={paperRed}>297 / 210 ≈ 1.4143</InkLabel>
  <InkLabel x={490} y={1160} size={40}>Ideal ratio: √2 ≈ 1.4142</InkLabel>
  <InkLabel x={490} y={1230} size={32}>Close, but not exactly equal</InkLabel>
 </g>;
};

export const PaperHalfShape=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame();const root=useRef<HTMLDivElement>(null);
 const [handle]=useState(()=>delayRender('Load chosen Manrope fonts'));
 const [fontsReady,setFontsReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 54px Manrope'),document.fonts.load('400 32px Manrope')]).then(()=>setFontsReady(true)).catch(error=>{throw error;});},[]);
 const index=Math.max(0,plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end));
 const beat=plan.beats[index]!;const progress=(frame-beat.frames.start)/(beat.frames.end-beat.frames.start);
 const cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!fontsReady||!root.current)return;
 if(!inspectQa){continueRender(handle);return;}
 const elements=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]'));
 const origin=root.current.getBoundingClientRect();
 const bounds=elements.map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]');
 const inner=root.current.querySelector<HTMLElement>('[data-caption-text]');
 console.log('PAPER_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:!!root.current.querySelector('[data-disclosure]')}));
 continueRender(handle);
 },[frame,inspectQa,cue,fontsReady,handle]);
 return <AbsoluteFill ref={root} style={{background:'#F0EEE3',color:paperInk,fontFamily:'Manrope',overflow:'hidden'}}>
  <div style={{position:'absolute',left:120,top:273,width:750,fontSize:28,letterSpacing:3,color:'#5C7168'}} data-critical="label">MAGNIVIS / EVERYDAY GEOMETRY</div>
  <div style={{position:'absolute',left:120,top:354,width:750,fontSize:48,fontWeight:600,lineHeight:1.2}} data-critical="label">{sceneTitles[index]}</div>
  <svg width={1080} height={1920} style={{position:'absolute'}}><Scene index={index} progress={progress}/></svg>
  <div data-critical="disclosure" data-disclosure style={{position:'absolute',left:120,top:1302,width:750,fontSize:30,lineHeight:1.2,color:'#5C7168',textAlign:'center'}}>Ideal geometry • physical sizes are rounded</div>
  {cue&&<div data-caption-box data-critical="caption-midpoint" style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',opacity:Math.min(clamp((frame-cue.startFrame+1)/4),clamp((cue.endFrame-frame)/4))}}>
   <div data-caption-text style={{fontSize:54,fontWeight:600,lineHeight:1.28,whiteSpace:'pre'}}>{cue.lines.join('\n')}</div>
  </div>}
  {narration.cues.map(n=><Sequence key={n.id} from={Math.round(n.start*30)} durationInFrames={Math.ceil(n.duration*30)}><Audio src={staticFile(n.file)} volume={0.87}/></Sequence>)}
 </AbsoluteFill>;
};
