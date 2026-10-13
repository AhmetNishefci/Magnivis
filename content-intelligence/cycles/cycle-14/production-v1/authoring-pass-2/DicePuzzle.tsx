import React,{useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,interpolate,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import narration from '../production/narration/dice.json';
import caption from '../captions/plans/dice.json';
import {TactileDie,DIE_FACES,DIE_COLORS,type DieId} from '../components/TactileDie';
const ids:DieId[]=['yellow','blue','green','orange'];
const capName=(id:DieId)=>id[0]!.toUpperCase()+id.slice(1);
const ease=(f:number,a:number,b:number)=>{const t=interpolate(f,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return t*t*(3-2*t);};
const Text:React.FC<{x?:number;y:number;size?:number;children:React.ReactNode;fill?:string}>=({x=490,y,size=40,children,fill='#27373F'})=><text data-critical="label" x={x} y={y} fill={fill} fontSize={size} fontWeight="600" textAnchor="middle">{children}</text>;
const FaceStrip:React.FC<{id:DieId;y:number;winner?:(n:number)=>boolean;reveal:number}>=({id,y,winner,reveal})=><g opacity={reveal} data-critical="faces"><Text y={y-35} size={31}>{capName(id)} · all six faces</Text>{DIE_FACES[id].map((v,i)=><g key={i} transform={`translate(${690+(190+i*120-690)*reveal} ${690+(y-690)*reveal})`}><rect x="-47" y="0" width="94" height="94" rx="18" fill={DIE_COLORS[id]} stroke={winner?(winner(v)?'#305C43':'#865750'):'#fff'} strokeWidth={winner?5:2}/><text y="63" textAnchor="middle" fontSize="49" fontWeight="700" fill="#17242D">{v}</text>{winner&&<text y="130" textAnchor="middle" fontSize="25" fill={winner(v)?'#305C43':'#865750'}>{winner(v)?'wins':'loses'}</text>}</g>)}</g>;
const Dots:React.FC<{x:number;y:number;cols:number;rows:number;stepX:number;stepY:number}>=({x,y,cols,rows,stepX,stepY})=><g>{Array.from({length:rows*cols},(_,i)=><circle key={i} cx={x+(i%cols)*stepX} cy={y+Math.floor(i/cols)*stepY} r="7" fill="#304339" opacity=".55"/>)}</g>;
/** Weighted partitions are6×6 indexed outcomes; widths and heights preserve multiplicity. */
const WeightedProof:React.FC<{kind:'green'|'orange';progress:number}>=({kind,progress})=>{
 const g=kind==='green',x=160,y=875,w=660,h=360,top=g?180:120,split=g?440:330;
 const revealFirst=ease(progress,0,.27),revealSecond=ease(progress,.33,.63),total=ease(progress,.68,.82);
 return <g data-critical="weighted-proof">
 <Text y={850} size={31}>36 equally likely face pairs</Text>
 <rect x={x} y={y} width={w} height={top} rx="15" fill="#ABC4A5" opacity={.32+.68*revealFirst}/>
 <rect x={x} y={y+top+6} width={w-split} height={h-top-6} rx="15" fill="#ABC4A5" opacity={.32+.68*revealSecond}/>
 <rect x={x+w-split+6} y={y+top+6} width={split-6} height={h-top-6} rx="15" fill="#D8C5BA"/>
 <Dots x={x+47} y={y+top*.25} cols={6} rows={g?3:2} stepX={111} stepY={g?35:33}/>
 <Dots x={x+47} y={y+top+35} cols={g?2:3} rows={g?3:4} stepX={g?111:110} stepY={g?25:30}/>
 <g opacity=".35"><Dots x={x+w-split+47} y={y+top+35} cols={g?4:3} rows={g?3:4} stepX={g?104:108} stepY={g?25:30}/></g>
 <Text y={y+top-24} size={28}>{g?'3 fives × 6 blue faces':'2 sixes × 6 green faces'} · {g?'18':'12'} wins</Text>
 <g opacity={revealSecond}><Text x={x+(w-split)/2} y={y+h-64} size={26}>{g?'3 ones × 2 zeros':'4 twos × 3 ones'}</Text><Text x={x+(w-split)/2} y={y+h-18} size={29}>{g?'6':'12'} wins</Text></g>
 <Text x={x+w-split/2} y={y+h-64} size={28}>{g?'1 < 4':'2 < 5'}</Text><Text x={x+w-split/2} y={y+h-18} size={29}>12 losses</Text>
 <g opacity={total}><Text y={1330} size={43}>{g?'18 + 6':'12 + 12'} = 24 / 36 = 2 / 3</Text></g>
 </g>
};
export const DicePuzzle:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('Dice typography')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 50px Manrope'),document.fonts.load('700 114px Manrope')]).then(()=>setReady(true));},[]);
 const f=useCurrentFrame();
 useEffect(()=>{if(!ready||!root.current)return;if(inspectQa){const origin=root.current.getBoundingClientRect();const bounds=Array.from(root.current.querySelectorAll<HTMLElement|SVGGraphicsElement>('[data-critical]')).filter(e=>{let opacity=1;for(let el:Element|null=e;el&&el!==root.current;el=el.parentElement)opacity*=Number(getComputedStyle(el).opacity);return opacity>.05;}).map(e=>{const r=e.getBoundingClientRect();return {kind:e.dataset.critical,text:e.textContent??'',x:r.x-origin.x,y:r.y-origin.y,width:r.width,height:r.height};});const box=root.current.querySelector<HTMLElement>('[data-critical="caption-midpoint"]'),inner=root.current.querySelector<HTMLElement>('[data-caption]');console.log('DICE_LAYOUT_QA '+JSON.stringify({frame:f,fontsLoaded:document.fonts.check('600 50px Manrope'),bounds,caption:box&&inner?{width:inner.getBoundingClientRect().width,height:inner.getBoundingClientRect().height,availableWidth:box.clientWidth,availableHeight:box.clientHeight}:null,disclosure:true}));}continueRender(handle);},[f,ready,inspectQa,handle]);let scene=narration.cues.reduce((last,n,i)=>f>=Math.round(n.start*30)?i:last,0);scene=Math.max(0,scene);const n=narration.cues[scene]!,local=(f-n.start*30)/30,window=((narration.cues[scene+1]?.start??narration.durationFrames/30)-n.start),p=Math.max(0,Math.min(1,local/window));
 const active=caption.cues.find(c=>f>=c.startFrame&&f<c.endFrame);
 const pair:DieId[]=scene===2?['yellow','orange']:scene===3?['blue','yellow']:scene===4?['green','blue']:scene===5?['orange','green']:['yellow','orange'];
 const circle=scene>=8;const intro=scene<=1;const posIntro:Record<DieId,[number,number]>={yellow:[300,695],blue:[690,695],green:[300,1120],orange:[690,1120]};const circlePos:Record<DieId,[number,number]>={yellow:[490,610],blue:[740,875],green:[490,1150],orange:[240,875]};
 const entrance=ease(local,0,.7),proof=ease(local,.65,1.45),showLoss=scene===7&&p>.46;
 return <AbsoluteFill ref={root} style={{fontFamily:'Manrope',background:'#CBD0CD'}}>
 <svg viewBox="0 0 1080 1920" style={{position:'absolute',width:'100%',height:'100%'}}>
 <defs><radialGradient id="table"><stop stopColor="#F0F1EB"/><stop offset=".65" stopColor="#D4D9D4"/><stop offset="1" stopColor="#B3BFBA"/></radialGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="14"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".035"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter><marker id="reply-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#536E60"/></marker></defs>
 <rect width="1080" height="1920" fill="url(#table)" filter="url(#grain)"/>
 <ellipse cx="500" cy="930" rx="610" ry="800" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="2"/>
 {intro&&<><Text y={330} size={scene===0?61:41}>{scene===0?'YOUR CHOICE':'Six equal chances.'}</Text><Text y={410} size={35}>{scene===0?'Higher number wins.':'One roll does not affect the other.'}</Text></>}
 {!intro&&!circle&&<><Text y={330} size={scene===7?47:43}>{scene===7?'BETTER ODDS ≠ CERTAINTY':`${capName(pair[0]!)} against ${capName(pair[1]!)}`}</Text><Text y={405} size={31}>{scene===7?(showLoss?'A possible loss':'The four replies shown: 2 / 3 each'):'Choose again. There is another counter.'}</Text></>}
 {circle&&<><Text y={330} size={46}>A BETTER REPLY. EVERY TIME.</Text><Text y={410} size={30}>Follow the arrows to the favored counter.</Text>{['M 585 620 Q 735 650 743 747','M 743 1005 Q 700 1135 600 1150','M 380 1150 Q 240 1130 240 1008','M 240 745 Q 270 625 375 610'].map((d,i)=><g key={i} opacity={ease(local,i*.20,.65+i*.20)}><path d={d} fill="none" stroke="#536E60" strokeWidth="8" markerEnd="url(#reply-arrow)"/><Text x={[705,700,280,280][i]!} y={[600,1150,1150,600][i]!} size={29}>2 / 3</Text></g>)}<Text y={1350} size={35}>No best die. A better matchup.</Text></>}
 {ids.map((id,i)=>{let x:number,y:number,size:number;if(intro){[x,y]=posIntro[id];size=205;}else if(circle){[x,y]=circlePos[id];size=156;}else{const index=pair.indexOf(id);if(index>=0){x=index===0?295:690;y=scene===7?845:580;size=scene===7?205:170;}else{x=215+(i%2)*555;y=scene===7?1250:1290;size=64;}}const initial=posIntro[id];const tx=intro?x:initial[0]+(x-initial[0])*entrance,ty=intro?y:initial[1]+(y-initial[1])*entrance;return <TactileDie key={id} id={id} x={tx} y={ty} size={intro?size:205+(size-205)*entrance} turn={(intro?.08*Math.sin(f/70+i):.025*Math.sin(f/48+i))} shownFace={showLoss&&id==='orange'?6:showLoss&&id==='yellow'?3:undefined}/>;})}
 {scene===1&&<g opacity={ease(local,1,2)}><Text y={1330} size={28}>Illustration of an ideal fair-dice model</Text></g>}
 {scene===2&&<><FaceStrip id="orange" y={930} winner={v=>3>v} reveal={proof}/><g opacity={ease(local,window*.65,window*.78)}><Text y={1225} size={50}>4 / 6 = 2 / 3</Text><Text y={1330} size={30}>Yellow: six faces, all 3</Text></g></>}
 {scene===3&&<><FaceStrip id="blue" y={930} winner={v=>v>3} reveal={proof}/><g opacity={ease(local,window*.58,window*.74)}><Text y={1225} size={50}>4 / 6 = 2 / 3</Text></g></>}
 {scene===4&&<WeightedProof kind="green" progress={p}/>}
 {scene===5&&<WeightedProof kind="orange" progress={p}/>}
 {(scene===4||scene===5)&&<g opacity={proof}><Text x={295} y={800} size={27}>{scene===4?'1 · 1 · 1 · 5 · 5 · 5':'2 · 2 · 2 · 2 · 6 · 6'}</Text><Text x={690} y={800} size={27}>{scene===4?'4 · 4 · 4 · 4 · 0 · 0':'1 · 1 · 1 · 5 · 5 · 5'}</Text></g>}
 {scene===6&&<g opacity={proof}><FaceStrip id="orange" y={930} winner={v=>3>v} reveal={1}/><Text y={1235} size={45}>Back to yellow · 2 / 3</Text></g>}
 {scene===7&&showLoss&&<><Text y={700} size={45}>3 &lt; 6</Text><Text y={1350} size={30}>One possible outcome · not a measured trial</Text></>}
 </svg>
 {active&&<div data-critical="caption-midpoint" style={{position:'absolute',left:active.bounds.x,top:active.bounds.y,width:active.bounds.width,height:active.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:caption.visualTreatment.fontSize,lineHeight:1.24,fontWeight:600,color:'#23343D'}}><span data-caption="text">{active.lines.map((line,i)=><React.Fragment key={i}>{i>0&&<br/>}{line}</React.Fragment>)}</span></div>}
 {inspectQa&&<div data-critical="scene" style={{position:'absolute',left:140,top:290,width:700,height:1090,pointerEvents:'none'}}/>}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)+1} layout="none"><Audio src={staticFile(c.file)}/></Sequence>)}
 <Audio src={staticFile('audio/dice/tactile.wav')} volume={.18}/>
 </AbsoluteFill>
};
