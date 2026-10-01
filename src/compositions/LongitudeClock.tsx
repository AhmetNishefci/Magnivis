import {useEffect} from 'react';
import {AbsoluteFill,Sequence,staticFile,useCurrentFrame,delayRender,continueRender} from 'remotion';
import {Audio} from '@remotion/media';
import {TheatreSurface,LongitudeWatch,ShipObject,SunObject,ReadingCard,MeridianGlobe,ObjectLabel,theatreColors as c} from '../components/LongitudeObjects';
import {ObjectTheatreCaptions} from '../components/ObjectTheatreCaptions';
import {loadLongitudeFonts} from '../design/longitude-fonts';
import {inspectLongitudeLayout} from '../production/longitude-layout-qa';
import metadata from '../production/narration/longitude-clock.json';
import rawCaptions from '../captions/plans/longitude-clock.json';
import rawPlan from '../production/plans/longitude-clock.json';
import type {z} from 'zod';
import type {adaptiveCaptionPlanSchema} from '../captions/adaptive-plan';
const captions=rawCaptions as z.infer<typeof adaptiveCaptionPlanSchema>;
const headings=['A clock at sea.','Time, carried.','Find local time.','One comparison.','Time becomes angle.','Two readings.','Thirty degrees east.','A watch that mattered.','More than one method.','Time becomes longitude.'];
const progress=(time:number,start:number,duration=0.7)=>Math.max(0,Math.min(1,(time-start)/duration));
const Footer=({text}:{text:string})=><ObjectLabel x={360} y={707} size={22} color={c.muted}>{text}</ObjectLabel>;
const MiniReference=()=> <g><LongitudeWatch x={602} y={78} r={34}/><ObjectLabel x={490} y={76} size={20}>REFERENCE</ObjectLabel></g>;
const Basis=({y=569}:{y?:number})=><g><ObjectLabel x={360} y={y} size={32}>BOTH MEAN SOLAR TIME</ObjectLabel><ObjectLabel x={360} y={y+48} size={38} color={c.accent}>SAME INSTANT</ObjectLabel></g>;
const BeatObjects=({index,time}:{index:number;time:number})=>{
 switch(index){
  case 0:return <><LongitudeWatch x={230} y={305} r={150}/><ShipObject x={535} y={422} scale={0.9}/><ObjectLabel x={230} y={521} size={25}>A TIMEKEEPER</ObjectLabel><ObjectLabel x={535} y={545} size={25}>AT SEA</ObjectLabel><Footer text="EXPLANATORY MODEL"/></>;
  case 1:return <><LongitudeWatch x={208} y={320} r={126}/><ObjectLabel x={208} y={510}>REFERENCE TIME</ObjectLabel><g transform="translate(175 0)"><MeridianGlobe degrees={0} reveal={0} r={122} cy={310}/></g><path d="M 292 344 Q 355 432 465 335" stroke={c.ink} strokeWidth="2" fill="none"/><ObjectLabel x={360} y={578} size={28}>A KNOWN REFERENCE MERIDIAN</ObjectLabel><Footer text="THE WATCH KEEPS ITS TIME"/></>;
  case 2:return <><MiniReference/><SunObject x={163} y={196}/><path d="M 87 270 L 256 270" stroke={c.sea} strokeWidth="3"/><path d="M 162 200 L 242 270" stroke={c.accent} strokeWidth="2" strokeDasharray="5 6"/><ShipObject x={510} y={220} scale={0.57}/><ObjectLabel x={360} y={332} size={32}>OBSERVED SOLAR TIME</ObjectLabel><g opacity={progress(time,2.3)}><path d="M 360 357 L 360 408 M 348 393 L 360 408 L 372 393" fill="none" stroke={c.accent} strokeWidth="3"/><rect x={155} y={430} width={410} height={70} rx={14} fill="#EAD7C6"/><ObjectLabel x={360} y={475} size={31}>ASTRONOMICAL CORRECTION</ObjectLabel></g><g opacity={progress(time,3.5)}><ObjectLabel x={360} y={567} size={38}>LOCAL MEAN TIME</ObjectLabel><ObjectLabel x={360} y={626} size={27}>REFERENCE WATCH UNCHANGED</ObjectLabel></g><Footer text="CONVERT THE OBSERVATION TO COMPARABLE TIME"/></>;
  case 3:return <><LongitudeWatch x={200} y={265} r={86}/><SunObject x={520} y={264} r={52}/><ObjectLabel x={200} y={411} size={31}>REFERENCE TIME</ObjectLabel><ObjectLabel x={520} y={411} size={31}>LOCAL MEAN TIME</ObjectLabel><path d="M 200 448 L 200 469 L 520 469 L 520 448" stroke={c.ink} strokeWidth="2" fill="none"/><Basis y={554}/><Footer text="ONE MOMENT · TWO COMPARABLE READINGS"/></>;
  case 4:return <><ObjectLabel x={360} y={83} size={40}>1 HOUR ↔ 15°</ObjectLabel><MeridianGlobe degrees={15} reveal={progress(time,2,1.4)} r={195} cy={370}/><ObjectLabel x={360} y={650} size={27}>TIME DIFFERENCE → ANGULAR DIFFERENCE</ObjectLabel><Footer text="MEAN SOLAR TIME"/></>;
  case 5:return <><ReadingCard x={51} y={223} label="REFERENCE" value="12:00"/><ReadingCard x={383} y={223} label="LOCAL" value="14:00"/><Basis y={553}/><Footer text="READ AT THE SAME MOMENT"/></>;
  case 6:return <><ReadingCard x={51} y={43} label="REFERENCE" value="12:00" small/><ReadingCard x={383} y={43} label="LOCAL" value="14:00" small/><ObjectLabel x={360} y={220} size={28}>BOTH MEAN SOLAR TIME · SAME INSTANT</ObjectLabel><MeridianGlobe degrees={30} reveal={progress(time,.55,1.1)} r={155} cy={430} showViewLabel={false}/><rect x={238} y={369} width={245} height={62} rx={14} fill="#F8F3E8"/><ObjectLabel x={360} y={410} size={38}>+2 HOURS</ObjectLabel><g opacity={progress(time,1.45,.4)}><ObjectLabel x={360} y={645} size={57} color={c.accent}>30° EAST</ObjectLabel></g><Footer text="LONGITUDE · NORTH-POLE VIEW"/></>;
  case 7:return <><LongitudeWatch x={360} y={340} r={195} historical/><ObjectLabel x={360} y={600} size={40}>HARRISON H4</ObjectLabel><ObjectLabel x={360} y={645} size={31}>LARGE LONGITUDE WATCH</ObjectLabel><Footer text="ORIGINAL EXPLANATORY RECONSTRUCTION"/></>;
  case 8:return <><LongitudeWatch x={196} y={282} r={94}/><SunObject x={525} y={196} r={40}/><g filter="url(#theatre-shadow)"><rect x={421} y={290} width={210} height={135} rx={9} fill="#FBF8EE"/>{[325,355,385].map(y=><path key={y} d={`M 445 ${y} L 603 ${y}`} stroke="#C4BBAE" strokeWidth="3"/>)}<path d="M 503 311 L 503 407 M 553 311 L 553 407" stroke="#C4BBAE" strokeWidth="2"/></g><ObjectLabel x={196} y={480}>TIMEKEEPING</ObjectLabel><ObjectLabel x={525} y={480}>ASTRONOMY</ObjectLabel><ObjectLabel x={360} y={591} size={34}>BOTH REMAINED USEFUL</ObjectLabel><Footer text="COMPLEMENTARY WAYS TO FIND LONGITUDE"/></>;
  default:return <><LongitudeWatch x={170} y={185} r={73}/><SunObject x={518} y={171} r={37}/><ObjectLabel x={170} y={303} size={27}>REFERENCE TIME</ObjectLabel><ObjectLabel x={518} y={303} size={27}>OBSERVATION</ObjectLabel><path d="M 170 340 L 170 374 L 360 374 M 518 340 L 518 374 L 360 374 M 360 374 L 360 410" fill="none" stroke={c.ink} strokeWidth="3"/><ObjectLabel x={360} y={457} size={33}>COMPARISON + CALCULATION</ObjectLabel><g opacity={progress(time,.8)}><ObjectLabel x={360} y={554} size={59} color={c.accent}>LONGITUDE</ObjectLabel><ObjectLabel x={360} y={609} size={25}>RELATIVE TO THE REFERENCE</ObjectLabel><ObjectLabel x={360} y={654} size={28}>NOT COMPLETE GEOGRAPHIC POSITION</ObjectLabel></g><Footer text="THE CLOCK CARRIES TIME"/></>;
 }
};
export const LongitudeClock=({inspectQa=false}:{inspectQa?:boolean})=>{
 const frame=useCurrentFrame();useEffect(()=>{void loadLongitudeFonts();},[]);
 const index=Math.max(0,rawPlan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end));
 useEffect(()=>{if(!inspectQa)return;const handle=delayRender("Inspect actual Longitude typography");void loadLongitudeFonts().then(()=>requestAnimationFrame(()=>{console.log("LONGITUDE_LAYOUT_QA "+JSON.stringify(inspectLongitudeLayout(frame)));continueRender(handle);}));},[inspectQa,frame]);
 const time=(frame-rawPlan.beats[index]!.frames.start)/30;
 return <AbsoluteFill style={{backgroundColor:c.ivory,fontFamily:'Longitude Source Sans',color:c.ink}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 25% 15%, #FFFCF2 0%, transparent 70%)',opacity:.65}}/>
  <Audio src={staticFile('audio/longitude-clock/soundscape.wav')} volume={0.8}/>
  {metadata.cues.map(cue=><Sequence key={cue.id} from={Math.round(cue.start*30)} durationInFrames={Math.ceil(cue.duration*30)} layout="none"><Audio src={staticFile(cue.file)} volume={0.94}/></Sequence>)}
  <div style={{position:'absolute',left:140,top:281,fontSize:25,letterSpacing:1.2,fontWeight:600}}>MAGNIVIS / LONGITUDE</div>
  <div style={{position:'absolute',left:140,top:359,width:730,fontFamily:'Longitude Source Serif',fontSize:66,lineHeight:1.07,fontWeight:400}}>{headings[index]}</div>
  <div style={{position:'absolute',left:135,top:573,width:720,height:750,transformOrigin:'50% 50%',transform:index===0?`translateY(${(1-progress(time,0,1))*8}px)`:undefined}}><TheatreSurface><BeatObjects index={index} time={time}/></TheatreSurface></div>
  <ObjectTheatreCaptions plan={captions}/>
 </AbsoluteFill>;
};
