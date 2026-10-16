import React,{useEffect,useRef,useState} from 'react';
import {AbsoluteFill,Img,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/space-grotesk/latin-500.css';
import {VoyagerMemory as PreservedV1} from './VoyagerMemory';
import narration from '../production/narration/voyager.json';
import captions from '../captions/plans/voyager-v2.json';
import {codeGeometry as G,codePosition,referenceBranch,SCIENCE_START_FRAME,smooth} from '../production/voyager-v2/model';
const ink='#050b10',ivory='#f4f0e7',gold='#e8bb73',red='#df725d',blue='#9ed4dc';
const Label:React.FC<{x?:number;y:number;size?:number;color?:string;kind?:string;children:React.ReactNode}>=({x=120,y,size=36,color=ivory,kind='critical',children})=><div data-qa-kind={kind} style={{position:'absolute',left:x,top:y,fontSize:size,color,fontWeight:600,lineHeight:1.25,whiteSpace:'pre'}}>{children}</div>;
const Disclosure:React.FC<{children:React.ReactNode}>=({children})=><Label y={1315} size={36} color="#b5bfc1" kind="disclosure">{children}</Label>;
const Stars:React.FC=()=> <svg width="1080" height="1920" style={{position:'absolute'}}>{Array.from({length:160},(_,i)=><circle key={i} cx={(i*379.3)%1080} cy={(i*191.7)%1920} r={i%9===0?1.7:.8} fill={ivory} opacity={.12+(i%5)*.06}/>)}</svg>;
/** The same abstract marks are disordered at reception and aligned after recovery. No real telemetry. */
const Signal:React.FC<{f:number;readable:boolean;compact?:boolean}>=({f,readable,compact=false})=>{
 const y0=compact?1090:690,step=compact?70:170,rows=compact?2:3;
 return <svg width="1080" height="1920" style={{position:'absolute'}}><g data-qa-kind="critical-visual" data-qa-label={readable?'Orderly illustrative information':'Unreadable illustrative signal'} data-qa-pad="4" opacity={readable?1:smooth(f,0,10)}>{Array.from({length:rows*6},(_,i)=>{
 const col=i%6,row=Math.floor(i/6),x=155+col*112,y=y0+row*step;
 const settled=readable?smooth(f,10+col*5,45+col*5):0;
 const angle=readable?28*(1-settled):((i*37)%65)-32;
 const arrival=readable?1:smooth(f,i*1.5,15+i*1.5),jx=readable?0:-35*(1-arrival),jy=readable?0:((i*13)%25)-12;
 return <g key={i} transform={`translate(${x+jx} ${y+jy}) rotate(${angle})`} opacity={readable?.4+.6*settled:.8*arrival}><path d="M0 0h43m-43 13h26m-26 13h36" stroke={readable?ivory:red} strokeWidth={compact?4:5} fill="none"/><circle cx={57} cy={13} r={4} fill={readable?blue:red}/></g>;
 })}</g></svg>;
};
const Opening:React.FC<{f:number}>=({f})=>{
 const pull=1.08-.08*smooth(f,0,100);
 return <>
 <Label y={300} color={gold}>VOYAGER 1 · APRIL 2024</Label><Label y={355} size={78}>15+ billion miles</Label>
 <div data-qa-kind="critical-visual" data-qa-label="Spacecraft subject viewport" style={{position:'absolute',left:120,top:500,width:760,height:530,overflow:'hidden',maskImage:'radial-gradient(ellipse at 48% 50%,black 42%,transparent 78%)'}}><Img src={staticFile('images/voyager/space.jpg')} style={{position:'absolute',width:1650,left:-400,top:-70,transform:`scale(${pull})`,transformOrigin:'46% 40%'}}/></div>
 <Signal f={f} readable={false} compact/>
 <Label y={1018} size={36} color={blue}>Signal received</Label><Label y={1210} size={48} color={red}>Data unreadable</Label>
 <Disclosure>{'Artist concept · illustrative signal\nCourtesy NASA/JPL-Caltech'}</Disclosure>
 </>;
};
const Chip:React.FC<{x:number;y:number;w?:number;h?:number}>=({x,y,w=210,h=180})=><g data-qa-kind="critical-visual" data-qa-label="Memory chip remains disabled" data-disabled-chip="true" transform={`translate(${x} ${y})`} data-qa-pad="3"><rect width={w} height={h} rx={6} fill="#2e2121" stroke={red} strokeWidth={3}/>{Array.from({length:7},(_,i)=><path key={i} d={`M0 ${18+i*(h-36)/6}h-18M${w} ${18+i*(h-36)/6}h18`} stroke="#89928b" strokeWidth={5}/>)}<path d={`M${w*.3} ${h*.3}l${w*.4} ${h*.4}m0-${h*.4}l-${w*.4} ${h*.4}`} stroke={red} strokeWidth={9}/></g>;
const Diagnosis:React.FC<{f:number}>=({f})=>{
 const failed=smooth(f,28,65),isolate=smooth(f,90,150);
 return <>
 <Label y={300} color="#aeb7b9">Data-packaging computer</Label><Label y={355} size={52}>One memory chip fails</Label>
 <svg width="1080" height="1920" style={{position:'absolute'}}>
 <g opacity={1-.75*isolate}><rect x={128} y={560} width={745} height={650} rx={12} fill="#111b1f" stroke="#4d5c61" strokeWidth={2}/><path d="M165 745H400M685 840H835" stroke="#647a7f" strokeWidth={3}/></g>
 {[0,1,2].map(i=>{const t=smooth(f,5+i*12,45+i*12);return <rect key={i} x={165+240*t} y={733} width={24} height={16} fill={gold} opacity={1-smooth(f,80,100)}/>;})}
 <Chip x={425} y={690} w={250} h={300}/>
 <g opacity={failed}><path d="M725 802l23 40m0-40l23 40m0-40l23 40" stroke={red} strokeWidth={5}/></g>
 </svg>
 <Label x={145} y={1170} size={38} color={red}>{isolate>.5?'Failure isolated to memory':'Data packaging fails'}</Label>
 <Disclosure>{'Simplified memory visualization\nNot actual hardware layout'}</Disclosure>
 </>;
};
const Code:React.FC<{scene:number;f:number;i:number}>=({scene,f,i})=>{
 const {x,y}=codePosition(scene,f,i);
 return <g data-code-section={String(i)} data-qa-kind="critical-visual" data-qa-label={`Code section ${i+1}`} data-qa-pad="1" transform={`translate(${x} ${y})`}><rect width={G.width} height={G.sectionHeight} fill={['#e8c88b','#dfbb78','#edce96'][i]} stroke="#ffdfa3" strokeWidth={1.5}/>{Array.from({length:4},(_,j)=><g key={j}><path d={`M${18+j*51} 22h${20+(i+j)%3*5}M${18+j*51} 39h${13+(i+j)%3*5}`} stroke="#5c492d" strokeWidth={4}/></g>)}</g>;
};
const Memory:React.FC<{scene:number;f:number}>=({scene,f})=>{
 const p=codePosition(scene,f,0),joined=scene<4?1:1-smooth(f,0,20);
 return <>
 <Label y={300} color="#aeb7b9">Software instructions</Label>
 <Label y={355} size={48}>{scene===2?'Move the affected code':scene===3?'One location is too small':'Split the code.\nUpdate the references.'}</Label>
 <svg width="1080" height="1920" style={{position:'absolute'}}>
 <defs><linearGradient id="memory-v2" x2=".9" y2="1"><stop stopColor="#233034"/><stop offset="1" stopColor="#091114"/></linearGradient></defs>
 <rect x={120} y={560} width={760} height={720} rx={12} fill="url(#memory-v2)" stroke="#3a494c" strokeWidth={2}/>
 <g opacity={.15}>{Array.from({length:15},(_,i)=><path key={i} d={`M${140+i*48} 580v${40+i%3*35}h20v${420-i%4*20}`} stroke="#79928b" strokeWidth={1.2} fill="none"/>)}</g>
 {G.destinationYs.map((y,i)=><g key={i} data-qa-kind="critical-visual" data-qa-label={`Available functioning memory ${i+1}`} data-qa-pad="2"><rect x={G.destinationX} y={y} width={G.destinationWidth} height={G.destinationHeight} rx={4} fill="#081216" stroke={blue} strokeWidth={2}/><path d={`M585 ${y+40}h240m-240 25h240`} stroke="#364f56" strokeWidth={2}/></g>)}
 <Chip x={175} y={900}/>
 {[0,1,2].map(i=><Code key={i} scene={scene} f={f} i={i}/>)}
 <rect x={p.x} y={p.y} width={G.width} height={G.joinedHeight} fill="none" stroke="#ffe0a7" strokeWidth={4} opacity={joined}/>
 {scene===3&&<g opacity={smooth(f,20,32)}><path d="M820 760l28 28m0-28l-28 28" stroke={red} strokeWidth={6}/><path d="M855 620v104m-7 0h14" stroke={red} strokeWidth={4}/></g>}
 {scene===4&&[0,1,2].map(i=>{
 const branch=referenceBranch(i),progress=smooth(f,70+i*20,90+i*20);
 return progress>.001?<g key={i} data-reference={String(i)} data-reference-progress={progress} data-qa-kind="critical-visual" data-qa-label={`Updated reference ${i+1}`} data-qa-pad="4"><path d={`M500 600V${branch.start.y}H${branch.end.x}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress} fill="none" stroke={ivory} strokeWidth={5}/><circle cx={branch.end.x} cy={branch.end.y} r={5} fill={blue} opacity={progress>.99?1:0}/></g>:null;
 })}
 {scene===4&&f>=130&&<circle cx={500} cy={672+470*smooth(f,130,175)} r={8} fill={gold}/>}
 </svg>
 <Label x={570} y={510} size={36} color={blue}>Available space</Label>
 <Label x={150} y={1120} size={36} color={red}>CHIP STILL FAILED</Label>
 {scene===4&&f>=130&&<Label x={480} y={1220} size={36} color={blue}>References updated</Label>}
 <Disclosure>{'Simplified memory visualization\nNot actual hardware layout'}</Disclosure>
 </>;
};
const Radio:React.FC<{f:number}>=({f})=>{
 const progress=smooth(f,20,145);
 return <>
 <Label y={300} color={gold}>APRIL 2024 · ONE WAY</Label><Label y={355} size={88}>22½ hours</Label>
 <svg width="1080" height="1920" style={{position:'absolute'}}><defs><radialGradient id="earth-v2"><stop stopColor="#6c999f"/><stop offset=".65" stopColor="#274a60"/><stop offset="1" stopColor="#0a1824"/></radialGradient></defs>
 <g data-qa-kind="critical-visual" data-qa-label="One-way Earth to Voyager schematic" data-qa-pad="3"><path d="M230 1150L790 660" stroke="#68747a" strokeWidth={2}/><circle cx={225} cy={1150} r={95} fill="url(#earth-v2)" stroke="#91acb3" strokeWidth={2}/><g transform="translate(790 660) rotate(-40)"><path d="M-54-35Q0 55 54-35Z" fill="#c9c9bf"/><path d="M0 8v65m-50-105L0 8l50-40" stroke="#ddd8c9" strokeWidth={4}/></g><path d={`M230 1150L${230+560*progress} ${1150-490*progress}`} stroke={gold} strokeWidth={5}/><circle cx={230+560*progress} cy={1150-490*progress} r={10} fill={gold}/></g></svg>
 <Label y={1260}>Earth</Label><Label x={635} y={780}>Voyager 1</Label>
 <Disclosure>{'Signal path schematic\nTime compressed · not to scale'}</Disclosure>
 </>;
};
const Reply:React.FC<{f:number;science:boolean}>=({f,science})=><>
 <Label y={300} color={blue}>{science?'LATER IN 2024':'APRIL 20, 2024'}</Label>
 <Label y={365} size={science?62:68}>{science?'Science follows later':'Engineering data\nreadable again'}</Label>
 <Signal f={f} readable/>
 <Label y={1230} size={38} color={blue}>{science?'May → June 2024':'Health and status received'}</Label>
 <Disclosure>{'Illustrative data, not actual telemetry\nSource: NASA 2024 mission reports'}</Disclosure>
 </>;
export const VoyagerMemoryV2:React.FC<{inspectQa?:boolean}>=({inspectQa=false})=>{
 const frame=useCurrentFrame(),root=useRef<HTMLDivElement>(null),[handle]=useState(()=>delayRender('V2 font and actual bounds inspection')),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([document.fonts.load('600 54px Manrope'),document.fonts.load('500 20px "Space Grotesk"')]).then(()=>setReady(true));},[]);
 const scene=narration.cues.reduce((last,c,i)=>frame>=Math.round(c.start*30)?i:last,0),f=frame-Math.round(narration.cues[scene]!.start*30),cue=captions.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 useEffect(()=>{
 if(!ready||!root.current)return;
 if(inspectQa){
 const origin=root.current.getBoundingClientRect(),scale=origin.width/1080;
 const visible=(el:Element)=>{let opacity=1;for(let p:Element|null=el;p&&p!==root.current;p=p.parentElement)opacity*=Number(getComputedStyle(p).opacity);return opacity>.01;};
 const rect=(el:Element,pad=0)=>{const r=el.getBoundingClientRect();return {x:(r.x-origin.x)/scale-pad,y:(r.y-origin.y)/scale-pad,width:r.width/scale+pad*2,height:r.height/scale+pad*2};};
 const bounds=Array.from(root.current.querySelectorAll<HTMLElement>('[data-qa-kind],[data-qabounds]')).filter(visible).map(el=>({kind:el.dataset.qaKind??el.dataset.qabounds!,text:el.dataset.qaLabel??el.textContent??'',...rect(el,Number(el.dataset.qaPad??0))}));
 const code=Array.from(root.current.querySelectorAll<SVGElement>('[data-code-section]')).map(el=>({id:el.dataset.codeSection!,...rect(el)}));
 const references=Array.from(root.current.querySelectorAll<SVGGElement>('[data-reference]')).map(el=>{const path=el.querySelector('path')!,point=path.getPointAtLength(path.getTotalLength()),m=path.getScreenCTM()!,mapped=new DOMPoint(point.x,point.y).matrixTransform(m);return {id:el.dataset.reference!,progress:Number(el.dataset.referenceProgress),end:{x:(mapped.x-origin.x)/scale,y:(mapped.y-origin.y)/scale}};});
 const box=root.current.querySelector<HTMLElement>('[data-caption-box]'),legacyBox=root.current.querySelector<HTMLElement>('[data-qabounds="caption-midpoint"]');
 let measuredCaption:null|{lines:{text:string|null;width:number;height:number}[];width:number;height:number;legacy?:boolean}=null;
 if(box){const lines=Array.from(root.current.querySelectorAll<HTMLElement>('[data-caption-line]')).map(el=>({text:el.textContent,width:el.getBoundingClientRect().width/scale,height:el.getBoundingClientRect().height/scale}));measuredCaption={lines,width:box.clientWidth,height:box.clientHeight};}
 else if(legacyBox){const range=document.createRange();range.selectNodeContents(legacyBox);const rects=Array.from(range.getClientRects());const unionHeight=rects.length?(Math.max(...rects.map(r=>r.bottom))-Math.min(...rects.map(r=>r.top)))/scale:0;measuredCaption={legacy:true,lines:[{text:legacyBox.textContent,width:Math.max(0,...rects.map(r=>r.width/scale)),height:unionHeight}],width:legacyBox.clientWidth,height:legacyBox.clientHeight};}

 console.log('VOYAGER_V2_QA '+JSON.stringify({frame,scene,fontsLoaded:document.fonts.check('600 54px Manrope'),bounds,code,references,caption:measuredCaption,disabledChip:root.current.querySelector('[data-disabled-chip="true"]')!==null,endingPreserved:scene===7}));
 }
 continueRender(handle);
 },[frame,scene,inspectQa,ready,handle]);
 return <AbsoluteFill ref={root} style={{background:ink,fontFamily:'Manrope',color:ivory,overflow:'hidden'}}>
 {scene===7?<PreservedV1/>:<><Stars/>{scene===0?<Opening f={f}/>:scene===1?<Diagnosis f={f}/>:scene<=4?<Memory scene={scene} f={f}/>:scene===5?<Radio f={f}/>:<Reply f={f} science={frame>=SCIENCE_START_FRAME}/>}
 <div style={{position:'absolute',left:120,top:270,opacity:.5,fontSize:20,letterSpacing:5,fontFamily:'Space Grotesk'}}>MAGNIVIS</div>
 {cue&&<div data-caption-box data-qa-kind="caption-midpoint" style={{position:'absolute',left:110,top:1450,width:770,height:142,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontSize:54,fontWeight:600,lineHeight:1.24,textAlign:'center',textShadow:'0 3px 18px #000,0 2px 3px #000'}}>{cue.lines.map((line,i)=><span key={i} data-caption-line style={{whiteSpace:'pre',width:'max-content'}}>{line}</span>)}</div>}
 </>}
 </AbsoluteFill>;
};
