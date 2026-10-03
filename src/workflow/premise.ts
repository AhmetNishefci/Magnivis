import {z} from 'zod';
import {text,recordReferenceSchema,readBoundRecord} from './evidence';
import type {TopicSelection} from './topic-selection';
/** Preliminary inspected feasibility, never final claim verification or a script approval. */
export const premiseAssessmentSchema=z.object({
 status:z.enum(['established','disputed','unresolved','hypothetical','reconstructed']),
 truthfulFraming:text,caveats:z.array(text),materialRisks:z.array(text),
 inspections:z.array(z.object({sourceId:text,url:z.url(),inspectedEvidence:recordReferenceSchema,locator:text,assessment:text,sourceQualityRationale:text,covers:z.array(z.enum(['premise','payoff'])).min(1)}).strict()).min(1),
}).strict();
export const premiseAlignmentSchema=z.object({selectionSha256:z.string().regex(/^[a-f0-9]{64}$/),preservesPublishingOpportunity:z.boolean(),rationale:text}).strict();
export const validatePremiseSelection=(selection:TopicSelection,root=process.cwd())=>{
 if(selection.outcome!=='selected'||!selection.premiseAssessment)throw new Error('Premise review requires autonomous selection and preliminary inspected evidence');
 const selected=selection.candidates.find(c=>c.id===selection.selectedId)!;
 const assessment=premiseAssessmentSchema.parse(selection.premiseAssessment);
 const coverage=new Set<string>();
 for(const i of assessment.inspections){
  if(!selected.evidence.some(e=>e.path===i.inspectedEvidence.path&&e.sha256===i.inspectedEvidence.sha256))throw new Error('Premise inspection must be retained in selected candidate evidence');
  const body=z.object({sourceId:text,url:z.url(),retrievedAt:z.iso.datetime(),accessStatus:z.enum(['inspected','partially-inspected']),inspectedText:text,acquisition:z.enum(['http-body','pdf-inspection','manual-source-inspection'])}).passthrough().parse(readBoundRecord(i.inspectedEvidence,root));
  if(body.sourceId!==i.sourceId||body.url!==i.url)throw new Error('Premise source identity mismatch');
  i.covers.forEach(c=>coverage.add(c));
 }
 if(!coverage.has('premise')||!coverage.has('payoff'))throw new Error('Preliminary inspected evidence must assess both premise and expected payoff');
 return {plannedVideo:selected.curiosityReview!.honestPremise,coldViewerPull:selected.curiosityReview!.coldAudienceReason,expectedPayoff:selected.explanatoryPayoff,truthEvidenceStatus:{status:assessment.status,framing:assessment.truthfulFraming,caveats:assessment.caveats},intendedStory:selected.curiosityReview!.storyRoute,whySelected:selection.rationale,materialRisks:assessment.materialRisks};
};
