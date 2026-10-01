import {z} from 'zod';
import {readFileSync} from 'node:fs';
import {publicationAuthorizationSchema} from './phantom-traffic-publication';
import {digestSchema, relativePathSchema} from '../artifacts/schema';
import {longitudeFileHash} from '../production/longitude-integrity';
import {validateLongitudeLockedMaster} from '../production/longitude-master-integrity';

const reference = z.object({path: relativePathSchema, sha256: digestSchema}).strict();
const {correctsPriorDecision: unusedCorrection, ...baseShape} = publicationAuthorizationSchema.shape;
void unusedCorrection;
export const longitudePublicationAuthorizationSchema = z.object({...baseShape,
  masterArtifactId: z.literal('longitude-clock.locked-master.v2'),
  masterApproval: reference, preparedVariants: reference, acceptedRisks: z.array(z.string().min(1)).min(7),
}).strict().superRefine((decision, context) => {
  if (new Set(decision.platforms).size !== 4) context.addIssue({code: 'custom', message: 'Authorization must explicitly cover four distinct platforms'});
});
export const longitudePublicationAuthorization = longitudePublicationAuthorizationSchema.parse(JSON.parse(readFileSync('content-intelligence/reviews/longitude-clock-publication-v1/owner-decision.json', 'utf8')));
export const validateLongitudePublicationAuthorization = () => {
  const decision = longitudePublicationAuthorization;
  const master = validateLongitudeLockedMaster();
  if (decision.master.path !== master.artifact.path || decision.master.sha256 !== master.artifact.sha256) throw new Error('Authorization targets a different locked master');
  for (const ref of [decision.master, decision.selectedInstagramCover, decision.masterApproval, decision.preparedPackageIndex, decision.preparedVariants, decision.copy]) if (longitudeFileHash(ref.path) !== ref.sha256) throw new Error('Release authorization binding drift: '+ref.path);
  return decision;
};
