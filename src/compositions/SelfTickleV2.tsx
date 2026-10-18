import React,{useEffect,useState} from 'react';
import {AbsoluteFill,continueRender,delayRender,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import narration from '../production/narration/self-tickle.json';
import captions from '../captions/plans/self-tickle-v2.json';
import {Materials,RibEncounter,ContactStudy,DelayExperiment,FeatherContact,smooth,palette} from '../components/self-tickle/TactileFilm';

const Label:React.FC<{children:React.ReactNode;y?:number;size?:number;color?:string;kind?:string;width?:number}>=({children,y=298,size=54,color=palette.ivory,kind='critical',width=760})=> <div data-qabounds={kind} style={{position:'absolute',left:112,top:y,width,fontSize:size,lineHeight:1.22,color,fontWeight:600,whiteSpace:'pre-line'}}>{children}</div>;
export const SelfTickleV2:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('V2 fonts')),[ready,setReady]=useState(false);
 useEffect(()=>{document.fonts.load('600 54px Manrope').then(()=>setReady(true));},[]);
 const i=narration.cues.reduce((last,c,j)=>frame>=Math.round(c.start*30)?j:last,0),start=Math.round(narration.cues[i]!.start*30),f=frame-start;
 const cap=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame),study=i>=1&&i<=4,robot=i===5;
 const background=study?'radial-gradient(ellipse at 55% 39%,#f6f2df 0%,#b2c8bc 62%,#617d77 100%)':robot?'radial-gradient(ellipse at 42% 39%,#e3e6d7 0%,#7b9490 66%,#2a4749 100%)':'radial-gradient(ellipse at 54% 40%,#6c3943 0%,#2c202e 56%,#101c25 100%)';
 const ink=study||robot?palette.ink:palette.ivory;
 useEffect(()=>{if(!ready)return;if(inspectQa){const root=document.querySelector('[data-film-root]')!.getBoundingClientRect(),scale=root.width/1080;const bounds=[...document.querySelectorAll<Element>('[data-qabounds]')].filter(el=>{let node:Element|null=el;while(node&&node!==document.documentElement){if(Number(getComputedStyle(node).opacity)===0)return false;node=node.parentElement;}return true;}).map(el=>{const r=el.getBoundingClientRect(),s=el instanceof SVGGraphicsElement?el:null,m=s?.getScreenCTM(),stroke=s?Math.max(0,...[s,...s.querySelectorAll<SVGGraphicsElement>('*')].map(n=>getComputedStyle(n).stroke==='none'?0:parseFloat(getComputedStyle(n).strokeWidth)||0)):0,pad=m?stroke*.5*Math.hypot(m.a,m.c)/scale:0;return {kind:el.getAttribute('data-qabounds'),text:el.getAttribute('aria-label')||el.textContent||'',x:(r.x-root.x)/scale-pad,y:(r.y-root.y)/scale-pad,width:r.width/scale+pad*2,height:r.height/scale+pad*2};});const contactGeometry=[...document.querySelectorAll<SVGGraphicsElement>('[data-contact-root]')].map(node=>{const points=(selector:string)=>[...node.querySelectorAll<SVGGeometryElement>(selector)].flatMap(path=>{const matrix=path.getScreenCTM()!;return Array.from({length:181},(_,j)=>{const pt=path.getPointAtLength(path.getTotalLength()*j/180);return new DOMPoint(pt.x,pt.y).matrixTransform(matrix);});});const surface=points('[data-contact-surface]'),tips=points('[data-contact-tip]');let minimum=Infinity;for(const a of surface)for(const b of tips)minimum=Math.min(minimum,Math.hypot(a.x-b.x,a.y-b.y)/scale);return {id:node.getAttribute('data-contact-root'),level:Number(node.getAttribute('data-contact-level')),nearestSurfaceDistance:minimum};});const robot=document.querySelector('[data-robot-control]');const marker=document.querySelector('[data-control-marker]')?.getBoundingClientRect(),controlHandle=document.querySelector('[data-control-handle]')?.getBoundingClientRect();const controlMarkerOffset=marker&&controlHandle?Math.abs((marker.x+marker.width/2-controlHandle.x-controlHandle.width/2)/scale):null;const el=document.querySelector<HTMLElement>('[data-caption]');console.log('TICKLE_V2_LAYOUT_QA '+JSON.stringify({frame,controlMarkerOffset,contactGeometry,robotProgress:robot?{control:Number(robot.getAttribute('data-robot-control')),follower:Number(robot.getAttribute('data-robot-follower'))}:null,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,caption:el?{width:el.scrollWidth,height:el.scrollHeight,availableWidth:el.clientWidth,availableHeight:el.clientHeight}:null,mechanism:{beat:i,forecast:i===2?f>=10:i===9?f>=12:false,actualContact:i===2?f>=71:i===9?f>=86:false,robotDelayed:i===5&&f>=58}}));}continueRender(handle);},[frame,ready,inspectQa,handle,i,f]);
 const art=()=>{
  if(i===0)return <RibEncounter frame={f<56?f+9:f-56} self={f>=56} id="hook"/>;
  if(i===1)return <ContactStudy frame={f+32} weak={f>54} id="skin"/>;
  if(i===2)return <ContactStudy frame={f} prediction weak attenuation={0} id="prediction"/>;
  if(i===3)return <g transform={`translate(600 994) scale(${1+.18*smooth(f/90)}) translate(-600 -994)`}><ContactStudy frame={f+85} prediction weak staticContact attenuation={f/72} id="attenuation"/></g>;
  if(i===4)return <><defs><clipPath id="matched-upper"><rect x={84} y={425} width={806} height={475}/></clipPath><clipPath id="matched-lower"><rect x={84} y={900} width={806} height={390}/></clipPath></defs><g clipPath="url(#matched-upper)"><g transform="translate(0 -70) scale(1 .74)"><ContactStudy frame={(f%100)+12} weak cropForearm id="matched-self"/></g></g><g clipPath="url(#matched-lower)"><g transform="translate(0 400) scale(1 .74)"><ContactStudy frame={(f%100)+12} cropForearm id="matched-external"/></g></g></>;
  if(i===5)return <DelayExperiment frame={f}/>;
  if(i===6)return f<58?<FeatherContact frame={f+12} id="two-kinds"/>:<RibEncounter frame={f-48} self={false} id="laughter"/>;
  if(i===7){if(f<91)return <FeatherContact frame={f+15} id="self-light"/>;return <g transform={`translate(${Math.sin((f-91)*.018)*15} 0)`}><ContactStudy frame={f+40} weak={Math.floor((f-91)/45)%2===0} staticContact id="individual-variation"/></g>;}
  return <RibEncounter frame={i===8?f+46:f} self forecast ending={i===9} id={i===8?'clue':'payoff'}/>;
 };
 const titles=[f<56?'Their touch.':'Your touch.','Same skin. Same contact.',f<35?'You move.':f<71?'Before contact.':'Then contact.','Weaker. Still felt.','Matched contact.',f<58?'Immediate.':'Now add a delay.',f<58?'A light tickle.':'A different kind of tickle.',f<91?'A light tickle can be self-made.':'People differ.','An important clue.','Now you can see it coming.'];
 const disclosure=i===2||i===3?'Prediction metaphor · not neural recordings':i===4?'Light-touch comparison · not laughter':i===5?'Simplified robot · timing expanded':i===6?'Light-touch evidence does not settle laughter':i===7?'Illustrative variation · no fixed categories':i===8?'Laughter-inducing tickling remains unresolved':'Original animation · responses illustrative';
 return <AbsoluteFill data-film-root style={{background,fontFamily:'Manrope',overflow:'hidden'}}>
  <svg width={1080} height={1920} style={{position:'absolute',inset:0}}><Materials/>{art()}</svg>
  <Label color={ink}>{titles[i]}</Label>
  {i===4&&<><Label y={535} size={42} color="#276e64">Self</Label><Label y={1040} size={40} color="#914e34">External</Label></>}
  {i===5&&<><Label y={470} size={42} width={300} color="#205e56">Control</Label><div data-qabounds="critical" style={{position:'absolute',left:585,top:470,fontSize:42,color:ink}}>Touch</div><Label y={1210} size={36} color={ink}>Initial result. Repetition changes it.</Label></>}
  {i===9&&<Label y={415} size={42} color={palette.teal}>{f<86?'Anticipated.':'Touched. Still felt.'}</Label>}
  <div style={{position:'absolute',inset:0,background:'linear-gradient(transparent 63%,#142127 73%)',pointerEvents:'none'}}/>
  <Label y={1320} size={33} color="#e2e4d9" kind="disclosure">{disclosure}</Label>
  {cap&&<div data-qabounds="caption-midpoint" data-caption style={{position:'absolute',left:110,top:1450,width:770,height:142,display:'flex',alignItems:'center',justifyContent:'center',fontSize:54,fontWeight:600,lineHeight:1.24,textAlign:'center',color:palette.ivory,whiteSpace:'pre-line'}}>{cap.lines.join('\n')}</div>}
 </AbsoluteFill>;
};
