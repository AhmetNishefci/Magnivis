import {useCurrentFrame} from 'remotion';
import type {z} from 'zod';
import type {adaptiveCaptionPlanSchema} from '../captions/adaptive-plan';
export const ObjectTheatreCaptions=({plan}:{plan:z.infer<typeof adaptiveCaptionPlanSchema>})=>{
 const frame=useCurrentFrame();const cue=plan.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame);
 if(!cue)return null;
 return <div data-caption-id={cue.id} style={{position:'absolute',left:cue.bounds.x,top:cue.bounds.y,width:cue.bounds.width,height:cue.bounds.height,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:plan.visualTreatment.fontFamily,fontWeight:plan.visualTreatment.fontWeight,fontSize:plan.visualTreatment.fontSize,lineHeight:plan.visualTreatment.lineHeight,color:plan.visualTreatment.foreground,opacity:Math.min(1,(frame-cue.startFrame+1)/3),whiteSpace:'pre-wrap'}}>{cue.lines.join('\n')}</div>;
};
