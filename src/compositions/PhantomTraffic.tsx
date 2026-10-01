import {Audio} from '@remotion/media';
import {AbsoluteFill,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {RoadTrafficScene,ExperimentTrafficScene} from '../components/TrafficWorld';
import {MagnivisCaptionRenderer} from '../components/MagnivisCaptionRenderer';
import {phantomTraffic} from '../content/videos/phantom-traffic';
import {phantomTrafficCaptionPlan} from '../captions/plans/phantom-traffic';
import {phantomTrafficProductionPlan as plan} from '../production/plans/phantom-traffic';
import {typography} from '../design/tokens';

export const PhantomTraffic=()=>{
 const frame=useCurrentFrame();
 const index=plan.beats.findIndex(b=>frame>=b.frames.start&&frame<b.frames.end);
 const beat=plan.beats[Math.max(0,index)]!;
 const local=(frame-beat.frames.start)/30;
 const roadTime=4+(frame-plan.beats[3]!.frames.start)/30;
 return <AbsoluteFill style={{backgroundColor:'#071019'}}>
  <Audio src={staticFile(phantomTraffic.audio.file)} volume={0.22}/>
  {phantomTraffic.audio.narrationCues.map(c=><Sequence key={c.id} from={Math.round(c.start*30)} layout="none"><Audio src={staticFile(c.file)} volume={0.86}/></Sequence>)}
  {index===1 ? <ExperimentTrafficScene time={local}/> : <RoadTrafficScene time={index===0 ? local : index===2 ? local : roadTime} opening={index===0} mechanism={index===2} membership={index===3} wide={index>=4}/>}
  <div style={{position:'absolute',left:150,top:270,color:'#8ea3ab',fontFamily:typography.body,fontSize:19,fontWeight:700,letterSpacing:'0.17em'}}>MAGNIVIS</div>
  <div style={{position:'absolute',left:150,top:308,color:'#c5d4d7',fontFamily:typography.body,fontSize:21,fontWeight:650,letterSpacing:'0.055em'}}>{index===1?'EXPERIMENT RECONSTRUCTION':'SIMPLIFIED EXPLANATORY MODEL'}</div>
  {index===5 && <div style={{position:'absolute',left:640,top:650,width:185,color:'#b7c8c8',fontFamily:typography.body,fontSize:24,lineHeight:1.4}}>The road<br/>ahead is clear.</div>}
  <MagnivisCaptionRenderer plan={phantomTrafficCaptionPlan}/>
 </AbsoluteFill>;
};
