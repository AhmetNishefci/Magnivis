import React, {useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,interpolate,staticFile,useCurrentFrame} from 'remotion';
import narration from '../production/narration/chocolate.json';
import captions from '../captions/plans/chocolate.json';
import {ChocolateMaterial,CrystalNetwork,Solids} from '../components/ChocolateMaterial';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const headings=['Same recipe.','Inside the chocolate','Melting disrupts structure','Cooling rebuilds structure','The result can differ','Tempering guides rebuilding','Back to the chocolate','Same recipe. Different structure.'];
const boundaries=[0,154,292,408,632,736,892,1050,1195];
const label=(text:string,x:number,y:number,size=40,weight=500)=> <text x={x} y={y} fontSize={size} fontWeight={weight} fill="#352733">{text}</text>;
export const Chocolate:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame();const [loaded,setLoaded]=useState(false);const [handle]=useState(()=>delayRender('Load licensed humanist font'));
 useEffect(()=>{const face=new FontFace('Chocolate Humanist',`url(${staticFile('fonts/chocolate/AtkinsonHyperlegibleNext.ttf')})`,{weight:'100 900'});face.load().then(f=>{document.fonts.add(f);setLoaded(true);continueRender(handle)}).catch(e=>{throw e});},[handle]);
 const beat=Math.max(0,boundaries.findIndex((b,i)=>frame>=b&&frame<(boundaries[i+1]??1196)));const local=frame-boundaries[beat]!;
 const analytical=beat===1||beat===2||beat===3||beat===5;
 const packing=beat===3&&frame<548;
 const order=beat===2?1-interpolate(local,[25,91],[0,1],clamp):beat===3?interpolate(local,[0,30],[0,1],clamp):beat===5?interpolate(local,[25,115],[.2,1],clamp):1;
 const caption=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{if(!inspectQa||!loaded)return;document.fonts.ready.then(()=>{
 const labels=Array.from(document.querySelectorAll('svg text')).map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent,x:r.x,y:r.y,width:r.width,height:r.height};});
 const cap=document.querySelector('[data-caption-text]')?.getBoundingClientRect();const available=document.querySelector('[data-caption-id]')?.getBoundingClientRect();
 console.log('CHOCOLATE_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('500 56px "Chocolate Humanist"')&&Array.from(document.fonts).some(f=>f.family.replace(/['"]/g,'')==='Chocolate Humanist'&&f.status==='loaded'),fontFaces:Array.from(document.fonts).map(f=>({family:f.family,status:f.status,weight:f.weight})),labels,caption:cap&&available?{width:cap.width,height:cap.height,availableWidth:available.width,availableHeight:available.height}:null,disclosure:analytical?labels.some(l=>l.text==='SIMPLIFIED EXPLANATORY MODEL'):true}));
 });},[frame,inspectQa,analytical,loaded]);
 return <AbsoluteFill style={{background:'#D6D0DF',fontFamily:'Chocolate Humanist',color:'#352733'}}>
 <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position:'absolute'}}>
 <defs><radialGradient id="field"><stop stopColor="#E7E1EC"/><stop offset="1" stopColor="#CCC5D5"/></radialGradient><linearGradient id="fat" x2=".9" y2="1"><stop stopColor="#DDC4A7"/><stop offset="1" stopColor="#B89574"/></linearGradient></defs>
 <rect width="1080" height="1920" fill="url(#field)"/>
 {label('MAGNIVIS',110,265,25,600)}
 {label(headings[beat]!,110,410,beat===7?46:48,600)}
 {beat===0?<>
 {label('One recipe · possible outcomes',110,475,35)}
 <ChocolateMaterial x={150} y={650+Math.sin(frame/25)*7} scale={1.05} shine={.6}/>
 <g opacity={interpolate(frame,[6,28],[0,1],clamp)}>{label('Softer',155,1235,36)}{label('Cleaner snap',570,1235,36)}<path d={`M150 1120 Q300 ${1130+Math.sin(frame/18)*15} 450 1150`} stroke="#67412C" strokeWidth="40" strokeLinecap="round" fill="none"/><path d="M570 1130 l100 -15 m30 -4 140 -21" stroke="#67412C" strokeWidth="40" strokeLinecap="round"/>{label('Illustrative comparison',110,1330,29)}</g>
 </>:null}
 {analytical?<>
 <ChocolateMaterial x={695} y={beat===5?600:470} scale={.29} window shine={.5}/>
 <path d="M800 595 L915 682" stroke="#8B7585" strokeWidth="2" fill="none"/>
 {label(packing?'Crystal arrangement':beat===3?'Larger fat-crystal network':beat===2?'Fat structure breaks down':beat===5?'Guided rebuilding':'Cocoa-butter fat phase',110,660,42,600)}
 <rect x="110" y="705" width="850" height="485" rx="38" fill="url(#fat)" stroke="#AA8E77" strokeWidth="3"/>
 {packing?<g data-scientific-role="simplified-crystal-packing">
 {[0,1].map(group=><g key={group} transform={`translate(${180+group*440} 800)`}>{Array.from({length:20},(_,i)=><rect key={i} x={(i%5)*53} y={Math.floor(i/5)*64} width={20} height={49} rx={10} fill="#F1D8BD" stroke="#92714F" strokeWidth="2" transform={`rotate(${group?25:0} ${(i%5)*53+10} ${Math.floor(i/5)*64+24})`}/>)}{label(group?'Another arrangement':'One arrangement',-20,334,29)}</g>)}
 </g>:<><CrystalNetwork order={order} variant={beat===3}/><Solids/>{beat===2?<g opacity={1-order}>{Array.from({length:12},(_,i)=><path key={i} d={`M${165+(i%4)*210} ${790+Math.floor(i/4)*155} q30 ${Math.sin(frame/20+i)*16} 65 0`} stroke="#E1C4A4" strokeWidth="8" fill="none"/>)}</g>:null}</>}
 {packing?<>{label('Packing within a crystal',110,1260,35)}{label('Not the larger network',110,1308,31)}</>:<>
 <circle cx="128" cy="1260" r="12" fill="#D5B28A" stroke="#8E6C4D" strokeWidth="2"/>{label('Cocoa-butter fat',157,1273,32)}<path d="M535 1246 l25 0 9 22 -16 15 -23 -13Z" fill="#543425"/>{label('Sugar / cocoa solids',578,1273,32)}
 {beat===3?label('Crystal domains + their connections',110,1330,31):null}
 </>}
 {beat===5?<>{label('Controlled temperatures',110,527,34)}{label('+ mixing',600,527,34)}<path d={`M240 575 q140 ${Math.sin(frame/18)*9+20} 220 0`} stroke="#8A6E7A" strokeWidth="3" fill="none"/><path d={`M755 553 a33 23 0 1 1 -1 0`} stroke="#8A6E7A" strokeWidth="3" fill="none"/></>:null}
 {label('SIMPLIFIED EXPLANATORY MODEL',110,1395,30,500)}
 </>:null}
 {beat===4?<><ChocolateMaterial x={150} y={680} scale={1.05} soft={interpolate(local,[0,65],[0,1],clamp)} shine={.25}/>{label('Softer · less snap is possible',110,1210,39)}{label('Illustrative material behavior',110,1320,29)}</>:null}
 {beat===6||beat===7?<>
 <ChocolateMaterial x={150} y={675} scale={1.05} split={beat===6?interpolate(local,[145,149],[0,1],clamp):1} shine={.95}/>
 {label(beat===6?'Snap. Gloss.':'Ingredients stay. Structure can change.',110,1210,beat===6?58:39,600)}
 {label('Illustrative fracture · not a test',110,1330,29)}
 </>:null}
 </svg>
 {caption?<div data-caption-id={caption.id} style={{position:'absolute',left:caption.bounds.x,top:caption.bounds.y,width:caption.bounds.width,height:caption.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',fontSize:56,fontWeight:500,lineHeight:1.18,textAlign:'center'}}><span data-caption-text>{caption.lines.join(' ')}</span></div>:null}
 {narration.cues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} durationInFrames={Math.ceil(c.duration*30)}><Audio src={staticFile(c.file)}/></Sequence>)}
 <Audio src={staticFile('audio/chocolate/tactile.wav')} volume={.65}/>
 {inspectQa?<div data-chocolate-qa style={{display:'none'}}>{JSON.stringify({frame,beat,analytical,packing,captionId:caption?.id,fontFamily:'Chocolate Humanist'})}</div>:null}
 </AbsoluteFill>;
};
