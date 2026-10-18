import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import narration from '../production/narration/anglerfish-fusion.json';
import captions from '../captions/plans/anglerfish-fusion-v3.json';
import {ease,mix} from '../components/anglerfish/Anatomy';
import {OrganicPair,OrganicMale,OrganicFemale} from '../components/anglerfish/OrganicFish';
import {InheritedInformation} from '../components/anglerfish/AttachedSection';
import {OrganicAttachmentSection as AttachedSection} from '../components/anglerfish/OrganicAttachmentSection';
const Label:React.FC<{y:number;size?:number;kind?:string;color?:string;children:React.ReactNode}>=({y,size=38,kind='critical',color='#e8e5d8',children})=><div data-qabounds={kind} style={{position:'absolute',left:110,top:y,maxWidth:770,fontSize:size,fontWeight:600,lineHeight:1.25,color,textShadow:'0 2px 18px #000'}}>{children}</div>;
export const AnglerfishFusionV3:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Anglerfish fonts')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 56px Manrope'),...['female-selected','male-original'].map(name=>new Promise<void>((resolve,reject)=>{const im=new Image();im.onload=()=>resolve();im.onerror=()=>reject(new Error('Artwork unavailable'));im.src=staticFile('visuals/anglerfish-fusion-v3/'+name+'.png');}))]).then(()=>setReady(true));},[]);
 const i=narration.cues.reduce((last,q,j)=>frame>=Math.round(q.start*30)?j:last,0),start=Math.round(narration.cues[i]!.start*30),end=i+1<narration.cues.length?Math.round(narration.cues[i+1]!.start*30):narration.durationFrames,t=(frame-start)/(end-start),cap=captions.cues.find(q=>frame>=q.startFrame&&frame<q.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-angler-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].filter(el=>{for(let p:Element|null=el;p;p=p.parentElement)if(Number(getComputedStyle(p).opacity)===0)return false;return true;}).map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const el=document.querySelector<HTMLElement>('[data-caption]');console.log('ANGLER_V3_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 56px Manrope'),bounds,caption:el?{width:el.scrollWidth,height:el.scrollHeight,availableWidth:el.clientWidth,availableHeight:el.clientHeight}:null,stage:i}));}continueRender(handle);},[frame,inspectQa,ready,handle,i]);
 let visual:React.ReactNode,label:React.ReactNode=null,disclosure='Original generated biological reconstruction';
 const pair=(scale:number,x:number,y:number,rotation=0,gap=0,grip=1,opacity=1)=><g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}><OrganicPair frame={frame} gap={gap} grip={grip} opacity={opacity}/></g>;
 const macro=(scale:number,rotation:number,sectionOpacity:number,join:number,vascular:number)=> <g transform={`translate(447 780) rotate(${rotation}) scale(${scale})`}><OrganicPair frame={frame} opacity={1-sectionOpacity*.48}/><g transform="scale(.8)"><AttachedSection frame={frame} join={join} vascular={vascular} opacity={sectionOpacity}/></g></g>;
 if(i===0){visual=pair(mix(1.03,1.12,ease(t)),365,1005,mix(-5,-2,ease(t)),mix(30,19,ease(t)),0);}
 else if(i===1){const u=ease(t),reveal=ease((t-.25)/.75);visual=<><g opacity={mix(.1,1,reveal)}><g transform={`translate(${mix(520,360,reveal)} ${mix(950,1000,reveal)}) rotate(${mix(-9,0,reveal)}) scale(${mix(1.8,.94,reveal)})`}><OrganicFemale frame={frame}/></g></g><OrganicMale frame={frame} x={mix(320,360,u)} y={mix(680,1150,u)} rotation={mix(-8,75,u)} size={mix(3.5,1.5,u)} grip={0}/></>;disclosure='Original reconstruction · encounter and shot scale illustrated';}
 else if(i===2){visual=pair(.94,360,1000,0,mix(150,80,ease(t)),0);label=<Label y={285} size={38}>Cryptopsaras couesii</Label>;}
 else if(i===3){const approach=ease(t/.4),zoom=ease((t-.25)/.75),scale=mix(.94,2.4,zoom),x=mix(360,447,zoom),y=mix(1000,780,zoom);visual=pair(scale,x,y,0,mix(80,0,approach),approach);label=t>.5?<Label y={285} size={39}>Jaws meet skin.</Label>:null;disclosure='Attachment reconstructed · fusion takes time';}
 else if(i===4){const enter=ease(t/.25);visual=macro(mix(2.4,2.15,ease(t)),0,enter,ease((t-.23)/.43),ease((t-.75)/.25));label=<Label y={285} size={39}>{t<.74?'Tissue joins over time.':'Then vessels connect.'}</Label>;disclosure='Same attachment site · illustrative section · time compressed';}
 else if(i===5){visual=macro(mix(2.15,1.95,ease(t)),0,1,1,1);label=<Label y={285} size={39}>A lasting nutritional connection.</Label>;disclosure='Schematic vessel routes · not an anatomical map';}
 else if(i===6){const out=ease(t/.6);visual=<g transform={`translate(${mix(447,365,out)} ${mix(780,1030,out)}) scale(${mix(1.95,.96,out)})`}><OrganicPair frame={frame} opacity={mix(.52,1,out)}/><g transform="scale(.8)"><AttachedSection frame={frame} join={1} vascular={1} opacity={1-out}/></g></g>;label=t>.65?<Label y={285} size={40}>Still an attached male.</Label>:null;disclosure='Two identifiable bodies · continued reproductive role';}
 else if(i===7){visual=<InheritedInformation frame={frame} progress={ease(t)}/>;label=<><Label y={285} size={40}>Inherited immune changes.</Label><Label y={349} size={32} color="#b8c5ae">Key adaptive functions lost across evolution.</Label></>;disclosure='Information metaphor · not a DNA sequence or bite-triggered switch';}
 else if(i===8){visual=pair(.96,365,1030,mix(0,-4,ease(t)));label=<Label y={285} size={39}>Remaining defenses: still being studied.</Label>;disclosure='Precise defense mechanisms remain unresolved';}
 else if(i===9){visual=pair(mix(.96,1.0,ease(t)),mix(365,360,ease(t)),mix(1030,1010,ease(t)),mix(-4,-10,ease(t)));label=<Label y={285} size={39}>Keep a rare encounter.</Label>;disclosure='Reproductive assurance · proposed evolutionary advantage';}
 else{visual=pair(mix(1.0,1.7,ease(t)),mix(360,580,ease(t)),mix(1010,990,ease(t)),mix(-10,-24,ease(t)));label=null;disclosure='Cryptopsaras couesii · original generated reconstruction';}
 return <AbsoluteFill data-angler-root style={{background:'#02080d',fontFamily:'Manrope',color:'#f1eee3',overflow:'hidden'}}>
 <svg width={1080} height={1920} style={{position:'absolute',inset:0}}>
 <defs><radialGradient id="abyss" cx={String(.35+Math.sin(frame*.002)*.08)} cy=".37" r=".67"><stop stopColor="#183537"/><stop offset=".5" stopColor="#07151e"/><stop offset="1" stopColor="#01060b"/></radialGradient><radialGradient id="warm-volume"><stop stopColor="#a58558" stopOpacity=".055"/><stop offset="1" stopColor="#a58558" stopOpacity="0"/></radialGradient></defs>
 <rect width="1080" height="1920" fill="url(#abyss)"/><ellipse cx="340" cy="820" rx="650" ry="550" fill="url(#warm-volume)"/>
 {Array.from({length:8},(_,j)=><circle key={j} cx={(j*213+Math.sin(frame*.005+j)*16)%1080} cy={(j*179+frame*(.08+j%3*.03))%1800} r={.6+j%3*.35} fill="#a7b6ae" opacity={.045+j%4*.018}/>)}
 {visual}
 </svg>
 <div style={{position:'absolute',inset:0,background:'linear-gradient(#01070b33,transparent 28%,transparent 65%,#01080de6 77%,#01080d 92%)',pointerEvents:'none'}}/>
 {label}<Label y={1335} size={28} kind="disclosure" color="#aebcb3">{disclosure}</Label>
 {cap&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:150,display:'flex',alignItems:'center',justifyContent:'center',fontSize:56,fontWeight:600,lineHeight:1.24,textAlign:'center',whiteSpace:'pre-line',textShadow:'0 2px 18px #000'}}>{cap.lines.join('\n')}</div>}
 {narration.cues.map(q=><Sequence key={q.id} from={Math.round(q.start*30)} durationInFrames={Math.ceil(q.duration*30)}><Audio src={staticFile(q.file)}/></Sequence>)}
 <Audio src={staticFile('audio/anglerfish-fusion/soundscape.wav')} volume={.22}/>
 </AbsoluteFill>;
};
