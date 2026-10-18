import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import narration from '../production/narration/anglerfish-fusion.json';
import captions from '../captions/plans/anglerfish-fusion-v2.json';
import {ease,mix} from '../components/anglerfish/Anatomy';
import {FishWorld,contact,project,type Vec} from '../components/anglerfish/PerspectiveFish';
import {AttachedSection,InheritedInformation} from '../components/anglerfish/AttachedSection';
const Label:React.FC<{y:number;size?:number;kind?:string;color?:string;children:React.ReactNode}>=({y,size=38,kind='critical',color='#e8e5d8',children})=><div data-qabounds={kind} style={{position:'absolute',left:110,top:y,maxWidth:770,fontSize:size,fontWeight:600,lineHeight:1.25,color,textShadow:'0 2px 18px #000'}}>{children}</div>;
export const AnglerfishFusionV2:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Anglerfish fonts')),[ready,setReady]=useState(false);
 useEffect(()=>{document.fonts.load('600 56px Manrope').then(()=>setReady(true));},[]);
 const i=narration.cues.reduce((last,q,j)=>frame>=Math.round(q.start*30)?j:last,0),start=Math.round(narration.cues[i]!.start*30),end=i+1<narration.cues.length?Math.round(narration.cues[i+1]!.start*30):narration.durationFrames,t=(frame-start)/(end-start),cap=captions.cues.find(q=>frame>=q.startFrame&&frame<q.endFrame);
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-angler-root]')!.getBoundingClientRect(),scale=root.width/1080,bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].filter(el=>{for(let p:Element|null=el;p;p=p.parentElement)if(Number(getComputedStyle(p).opacity)===0)return false;return true;}).map(el=>{const r=el.getBoundingClientRect();return {kind:el.getAttribute('data-qabounds')!,text:el.textContent||el.getAttribute('aria-label')||'',x:(r.x-root.x)/scale,y:(r.y-root.y)/scale,width:r.width/scale,height:r.height/scale};});const el=document.querySelector<HTMLElement>('[data-caption]');console.log('ANGLER_V2_LAYOUT_QA '+JSON.stringify({frame,fontsLoaded:document.fonts.check('600 56px Manrope'),bounds,caption:el?{width:el.scrollWidth,height:el.scrollHeight,availableWidth:el.clientWidth,availableHeight:el.clientHeight}:null,stage:i}));}continueRender(handle);},[frame,inspectQa,ready,handle,i]);
 let visual:React.ReactNode,label:React.ReactNode=null,disclosure='Original species-informed illustration';
 const world=(yaw:number,scale:number,x:number,y:number,maleAt:Vec=contact,female=true,opacity=1)=><g transform={`translate(${x} ${y}) scale(${scale})`}><FishWorld frame={frame} yaw={yaw} maleAt={maleAt} female={female} opacity={opacity}/></g>;
 // One world-space contact projected to one screen origin through every macro view.
 const close=(scale:number,yaw:number,opacity=1,section?:React.ReactNode)=>{const anchor=project(contact,yaw,.06);return <g transform={`translate(490 810) scale(${scale}) translate(${-anchor[0]} ${-anchor[1]})`}><FishWorld frame={frame} yaw={yaw} opacity={opacity}/>{section&&<g transform={`translate(${anchor[0]} ${anchor[1]})`}>{section}</g>}</g>;};
 if(i===0){const yaw=mix(.6,.42,ease(t));visual=world(yaw,1.29+t*.08,442,758,[contact[0],contact[1]+44*(1-t),contact[2]+6]);}
 else if(i===1){const u=ease(t),yaw=mix(.12,.3,u),scale=mix(1.8,1.13,ease((t-.35)/.65)),at:Vec=[mix(-150,70,u),mix(240,260,u),mix(260,95,u)];visual=world(yaw,scale,mix(750,447,u),mix(470,750,u),at,true,mix(.38,1,ease(t/.6)));disclosure='Illustrative visual search · shot scale changes';}
 else if(i===2){visual=world(mix(.3,.22,ease(t)),1.18,447,750,[70,mix(260,242,ease(t)),95]);label=<Label y={285} size={38}>Cryptopsaras couesii</Label>;}
 else if(i===3){const contactProgress=ease(t/.4),z=ease((t-.25)/.75),yaw=mix(.22,.1,z),scale=mix(1.18,3.35,z),anchor=project(contact,yaw,.06),x=mix(447,490-anchor[0]*scale,z),y=mix(750,810-anchor[1]*scale,z);visual=world(yaw,scale,x,y,[70,mix(242,200,contactProgress),95]);label=t>.5?<Label y={285} size={39}>Jaws meet skin.</Label>:null;disclosure='Attachment reconstructed · fusion takes time';}
 else if(i===4){const enter=ease(t/.25),yaw=.1+t*.035,section=<AttachedSection frame={frame} join={ease((t-.23)/.43)} vascular={ease((t-.75)/.25)} opacity={enter}/>;visual=close(3.35-t*.8,yaw,1-enter*.77,<g transform="scale(.9)">{section}</g>);label=<Label y={285} size={39}>{t<.74?'Tissue joins over time.':'Then vessels connect.'}</Label>;disclosure='Same attachment site · illustrative section · time compressed';}
 else if(i===5){visual=close(mix(2.55,2.3,ease(t)),.065+t*.06,.23,<g transform="scale(.9)"><AttachedSection frame={frame} join={1} vascular={1} opacity={1}/></g>);label=<Label y={285} size={39}>A lasting nutritional connection.</Label>;disclosure='Schematic vessel routes · not an anatomical map';}
 else if(i===6){const out=ease(t/.5),scale=mix(2.3,1.3,out),yaw=mix(.005,.42,out),anchor=project(contact,yaw,.06),x=mix(490-anchor[0]*scale,445,out),y=mix(810-anchor[1]*scale,748,out);visual=<><g transform={`translate(${x} ${y}) scale(${scale})`}><FishWorld frame={frame} yaw={yaw} opacity={mix(.23,1,out)}/><g transform={`translate(${anchor[0]} ${anchor[1]}) scale(.9)`}><AttachedSection frame={frame} join={1} vascular={1} opacity={1-out}/></g></g></>;label=t>.55?<Label y={285} size={40}>Still an attached male.</Label>:null;disclosure='Two identifiable bodies · continued reproductive role';}
 else if(i===7){visual=<InheritedInformation frame={frame} progress={ease(t)}/>;label=<><Label y={285} size={40}>Inherited immune changes.</Label><Label y={349} size={32} color="#b8c5ae">Key adaptive functions lost across evolution.</Label></>;disclosure='Information metaphor · not a DNA sequence or bite-triggered switch';}
 else if(i===8){visual=world(mix(.42,.24,ease(t)),1.29,442,749);label=<Label y={285} size={39}>Remaining defenses: still being studied.</Label>;disclosure='Precise defense mechanisms remain unresolved';}
 else if(i===9){visual=world(mix(.24,.46,ease(t)),mix(1.29,1.4,ease(t)),442,735);label=<Label y={285} size={39}>Keep a rare encounter.</Label>;disclosure='Reproductive assurance · proposed evolutionary advantage';}
 else{visual=world(mix(.46,.24,ease(t)),mix(1.4,1.48,ease(t)),442,717);label=<Label y={250} size={40}>Two fish. A lasting connection.</Label>;disclosure='Cryptopsaras couesii · original biological illustration';}
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
