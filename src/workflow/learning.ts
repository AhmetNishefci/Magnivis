import {z} from 'zod';
import {metricSnapshotSchema, type PublicationRecord} from '../operations/schema';
import {recordReferenceSchema, readBoundRecord, text} from './evidence';
export const learningSignalSchema=z.object({
  schemaVersion:z.literal(3),publicationId:text,platform:z.enum(['youtube','tiktok','instagram','facebook']),
  snapshots:z.array(recordReferenceSchema).min(1),interpretation:text,
  status:z.enum(['hypothesis','supported-observation']),strength:z.enum(['weak','strong']),
  maturity:z.enum(['early','mature','unknown']),limitations:z.array(text).min(1),
  applicability:text,causalityEstablished:z.literal(false),styleCopyAuthorized:z.literal(false),
}).strict();
export const validateLearningSignal=(input:unknown,publication:PublicationRecord,root=process.cwd())=>{
  const signal=learningSignalSchema.parse(input);
  if(signal.publicationId!==publication.id||signal.platform!==publication.platform)throw new Error('Learning signal publication/platform mismatch');
  signal.snapshots.forEach(ref=>{const m=metricSnapshotSchema.parse(readBoundRecord(ref,root));if(m.publicationId!==publication.id)throw new Error('Metric evidence belongs to another publication');});
  if(signal.strength==='strong'&&(signal.maturity!=='mature'||signal.status!=='supported-observation'))throw new Error('Early/unknown/hypothetical analytics cannot become strong discovery signals');
  return signal;
};
