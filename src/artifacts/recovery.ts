import {z} from 'zod';
import {digestSchema, type ArtifactManifest} from './schema';
export const recoveryDecisionSchema = z.object({
 decisionId:z.literal('recovery-decision.wood-frog.operational.v1'), reviewer:z.literal('Ahmet Nishefci'), recordedAt:z.iso.datetime(), decisionSource:z.string().min(1), decision:z.literal('accept-operational-replacement'),
 historicalArtifactId:z.literal('wood-frog.historical-master'), historicalSha256:digestSchema,
 replacementArtifactId:z.literal('wood-frog.recovered-master'), replacementSha256:digestSchema,
 historicalApprovalTransferred:z.literal(false),platformApprovalGranted:z.literal(false),publicationAuthorized:z.literal(false),
}).strict();
export const validateRecoveryDecision = (input:unknown, manifests:readonly ArtifactManifest[]) => {
 const d=recoveryDecisionSchema.parse(input);
 const historical=manifests.find(m=>m.artifactId===d.historicalArtifactId);
 const replacement=manifests.find(m=>m.artifactId===d.replacementArtifactId);
 if(!historical || !replacement || historical.identity.sha256!==d.historicalSha256 || replacement.identity.sha256!==d.replacementSha256 || replacement.replacesArtifactId!==historical.artifactId || replacement.approvalDecisionId!==d.decisionId || replacement.approvalScope!=='operational-replacement' || replacement.provenance!=='RECOVERY_EQUIVALENT_REGENERATION' || historical.identity.sha256===replacement.identity.sha256) throw new Error('Recovery decision does not bind separate historical and replacement identities');
 return {decision:d,historical,replacement};
};
