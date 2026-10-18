import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import narration from '../production/narration/anglerfish-fusion.json';
import captions from '../captions/plans/anglerfish-fusion.json';
import {Female,Male,FusionSection,ease,mix} from '../components/anglerfish/Anatomy';
const Label:React.FC<{y:number;size?:number;kind?:string;color?:string;children:React.ReactNode}>=({y,size=38,kind='critical',color='#e8e5d8',children})=><div data-qabounds={kind} style={{position:'absolute',left:110,top:y,maxWidth:770,fontSize:size,fontWeight:600,lineHeight:1.25,color,textShadow:'0 2px 18px #000'}}>{children}</div>;
export const AnglerfishFusion:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Anglerfish fonts')),[ready,setReady]=useState(false);
 useEffect(()=>{document.fonts.load('600 56px Manrope').then(()=>setReady(true));},[]);
 const i=narration.cues.reduce((last,q,j)=>frame>=Math.round(q.start*30)?j:last,0),start=Math.round(narration.cues[i]!.start*30),end=i+1<narration.cues.length?Math.round(narration.cues[i+1]!.start*30):narration.durationFrames,t=(frame-start)/(end-start),cap=captions.cues.find(q=>frame>=q.startFrame&&frame<q.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-angler-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].filter(el=>{for(let p:Element|null=el;p;p=p.parentElement)if(Number(getComputedStyle(p).opacity)===0)return false;return true;}).map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const el=document.querySelector<HTMLElement>('[data-caption]');console.log('ANGLER_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 56px Manrope'),bounds,caption:el?{width:el.scrollWidth,height:el.scrollHeight,availableWidth:el.clientWidth,availableHeight:el.clientHeight}:null,stage:i}));}continueRender(handle);},[frame,inspectQa,ready,handle,i]);
 let visual:React.ReactNode,label:React.ReactNode=null,disclosure='Original species-informed animation';
 const pair=(scale:number,x:number,y:number,approach=0)=><g transform={`translate(${x} ${y}) scale(${scale}) rotate(${Math.sin(frame*.008)*1.6})`}><Female id={'pair'+i} frame={frame} male approach={approach}/></g>;
 if(i===0){visual=pair(1.04+t*.035,440,795-t*12,55*(1-t*.2));}
 else if(i===1){visual=<><g opacity={ease((t-.38)/.55)*.26} transform={`translate(${mix(1280,870,ease(t))} 660) scale(1.2)`}><Female id="distant" frame={frame}/></g><g data-qabounds="critical-visual" aria-label="Searching male, large forward eye" transform={`translate(${mix(365,500,ease(t))} ${780-Math.sin(t*Math.PI)*55}) rotate(65) scale(1.18)`}><Male id="search" frame={frame}/></g></>;disclosure='Search route illustrative · visual search inferred';}
 else if(i===2){visual=pair(1.02+t*.025,440,790,90);label=<><Label y={285} size={43}>The triplewart seadevil</Label><Label y={349} size={34} color="#b6b8a1">Cryptopsaras couesii</Label></>;}
 else if(i===3){const approach=100*(1-ease(t/.35)),zoom=ease(t/.7),scale=mix(1.04,2.05,zoom),x=mix(440,326,zoom),y=mix(790,435,zoom);visual=pair(scale,x,y,approach);label=t>.45?<Label y={285} size={39}>The grip becomes permanent.</Label>:null;disclosure='Attachment sequence reconstructed · time compressed';}
 else if(i===4){const enter=ease(t/.18);visual=<><g opacity={1-enter}>{pair(2.05,326,435,0)}</g><g opacity={enter}><FusionSection frame={frame} tissue={ease((t-.14)/.35)} vessels={ease((t-.62)/.3)} zoom={1+t*.04}/></g></>;label=<Label y={285} size={40}>{t<.63?'First, tissue joins.':'Then, circulation connects.'}</Label>;disclosure='Illustrative section · fusion time compressed';}
 else if(i===5){visual=<FusionSection frame={frame} tissue={1} vessels={1} zoom={1.04-t*.08}/>;label=<><Label y={285} size={40}>A route for nutrients.</Label><Label y={350} size={34} color="#c1b096">Sperm production remains the male’s role.</Label></>;disclosure='Vessel paths qualitative · sperm not carried in blood';}
 else if(i===6){const out=ease(t/.35);visual=<><g opacity={1-out}><FusionSection frame={frame} tissue={1} vessels={1} zoom={.96}/></g><g opacity={out}>{pair(mix(2.05,1.12,out),mix(326,440,out),mix(435,755,out),0)}</g></>;label=t>.45?<Label y={285} size={41}>Still an attached male.</Label>:null;disclosure='Original anatomy · no disappearance into one organ';}
 else if(i===7){visual=<FusionSection frame={frame} tissue={1} vessels={1} zoom={.94+t*.08}/>;label=<><Label y={285} size={41}>An unusual immune system.</Label><Label y={351} size={34} color="#c1b096">Gene losses evolved across generations.</Label></>;disclosure='Illustrative tissue · no moment-of-bite immune switch';}
 else if(i===8){visual=pair(mix(1.8,1.12,ease(t)),mix(350,440,ease(t)),mix(500,755,ease(t)),0);label=<Label y={285} size={39}>Tolerance. Defense. Open questions.</Label>;disclosure='Remaining defenses are an active research question';}
 else if(i===9){visual=pair(mix(1.12,.94,ease(t)),440,mix(755,790,ease(t)),0);label=<><Label y={285} size={40}>Keep a rare encounter.</Label><Label y={351} size={34} color="#c1b096">A proposed evolutionary advantage</Label></>;disclosure='Reproductive assurance · supported by a 2026 model';}
 else{visual=pair(mix(.94,1.03,ease(t)),440,790-t*18,0);label=<Label y={285} size={43}>Two fish. A lasting connection.</Label>;disclosure='Cryptopsaras couesii · original biological illustration';}
 return <AbsoluteFill data-angler-root style={{background:'#02080d',fontFamily:'Manrope',color:'#f1eee3',overflow:'hidden'}}>
 <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
 <defs><radialGradient id="abyss" cx=".41" cy=".39" r=".67"><stop stopColor="#152b2f"/><stop offset=".5" stopColor="#07151e"/><stop offset="1" stopColor="#01060b"/></radialGradient><radialGradient id="warm-volume"><stop stopColor="#a58558" stopOpacity=".055"/><stop offset="1" stopColor="#a58558" stopOpacity="0"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="url(#abyss)"/><ellipse cx="340" cy="820" rx="650" ry="550" fill="url(#warm-volume)"/>
 {Array.from({length:14},(_,j)=><circle key={j} cx={(j*213+Math.sin(frame*.005+j)*16)%1080} cy={(j*179+frame*(.08+j%3*.03))%1800} r={.6+j%3*.35} fill="#a7b6ae" opacity={.045+j%4*.018}/>)}
 {visual}
 </svg>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(#01070b33,transparent 28%,transparent 65%,#01080de6 77%,#01080d 92%)',pointerEvents:'none'}}/>
 {label}<Label y={1335} size={28} kind="disclosure" color="#aebcb3">{disclosure}</Label>
 {cap&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:150,display:'flex',alignItems:'center',justifyContent:'center',fontSize:56,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 2px 18px #000'}}>{cap.lines.join('\n')}</div>}
 {narration.cues.map(q=><Sequence key={q.id} from={Math.round(q.start*30)} durationInFrames={Math.ceil(q.duration*30)}><Audio src={staticFile(q.file)}/></Sequence>)}
 <Audio src={staticFile('audio/anglerfish-fusion/soundscape.wav')} volume={.22}/>
 </AbsoluteFill>;
};
