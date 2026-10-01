import {z} from 'zod';
export const digestSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const relativePathSchema = z.string().min(1).refine((path) => !path.startsWith('/') && !path.includes('\\') && path.split('/').every((part) => /^[a-zA-Z0-9_.-]+$/.test(part) && part !== '.' && part !== '..'), 'Unsafe relative path');
export const provenanceSchema = z.enum(['ORIGINAL_PRODUCTION', 'HISTORICAL_EXACT', 'RECOVERY_EXACT_REPRODUCTION', 'RECOVERY_EQUIVALENT_REGENERATION', 'DERIVED_RECOVERY_ARTIFACT', 'RECONSTRUCTED_FROM_EVIDENCE', 'DISPOSABLE']);
export const artifactIdentitySchema = z.object({sha256: digestSchema, bytes: z.number().int().nonnegative().nullable(), mimeType: z.string().min(1)}).strict();
export const artifactLocationSchema = z.object({provider: z.string().regex(/^[a-z0-9-]+$/), key: relativePathSchema, durability: z.enum(['local-only', 'independent-archive', 'git-tracked'])}).strict();
export const artifactManifestSchema = z.object({
 schemaVersion: z.literal(1), artifactId: z.string().regex(/^[a-z0-9_.-]+$/), contentId: z.string().min(1), artifactType: z.enum(['video-master','platform-derivative','qa-evidence','delivery-file','narration-audio','soundscape-audio','cover-image']), revision: z.number().int().positive(),
 identity: artifactIdentitySchema, createdAt: z.iso.datetime().nullable(), creationUnknownReason: z.string().nullable(), recordedAt: z.iso.datetime(), sourceCommit: z.string().regex(/^[a-f0-9]{40}$/),
 productionPlanId: z.string().nullable(), captionPlanId: z.string().nullable(), platformVariantId: z.string().nullable(), approvalDecisionId: z.string().nullable(), approvalScope: z.enum(['historical-visual','operational-replacement','owner-visual','none']),
 publication: z.enum(['recorded-published-bytes','unknown','not-authorized']),
 localPath: relativePathSchema, locations: z.array(artifactLocationSchema), provenance: provenanceSchema,
 retention: z.enum(['DURABLE_REQUIRED','DURABLE_WHEN_APPROVED','REGENERABLE','TEMPORARY','HISTORICAL_EXPECTATION_ONLY']),
 historicalSha256: digestSchema.nullable(), historicalStatus: z.enum(['new-production','original','exact-reproduction','recovery-replacement','derived-recovery']),
 replacesArtifactId: z.string().nullable(), parentArtifactIds: z.array(z.string()), exactBytesMatter: z.boolean(),
 reproducibility: z.object({status: z.enum(['hash-only','exact-proven','equivalent-tested','derived','unknown']), recipe: z.array(z.string()).nullable(), evidence: z.array(z.string()).min(1)}).strict(),
}).strict().superRefine((m,c) => {
 const fail = (message: string) => c.addIssue({code:'custom',message});
 if (m.provenance === 'ORIGINAL_PRODUCTION' && (m.historicalStatus !== 'new-production' || m.historicalSha256 || m.replacesArtifactId)) fail('Original production cannot claim historical recovery identity');
 if (m.createdAt === null && !m.creationUnknownReason) fail('Unknown creation time needs a reason');
 if (m.provenance === 'RECOVERY_EXACT_REPRODUCTION' && (m.historicalSha256 !== m.identity.sha256 || m.reproducibility.status !== 'exact-proven')) fail('Exact reproduction requires matching historical identity');
 if (m.provenance === 'RECOVERY_EQUIVALENT_REGENERATION' && m.approvalScope === 'historical-visual') fail('Equivalent bytes cannot inherit historical visual approval');
 if (m.approvalScope !== 'none' && !m.approvalDecisionId) fail('Approval needs explicit decision');
 if (m.retention === 'HISTORICAL_EXPECTATION_ONLY' && (m.locations.length || m.reproducibility.status !== 'hash-only')) fail('Historical expectation cannot claim stored bytes');
 if (m.retention === 'DURABLE_REQUIRED' && !m.locations.some(l=>l.provider === 'git' || l.durability === 'independent-archive')) fail('Required artifact needs durable location');
 if (m.replacesArtifactId === m.artifactId) fail('Replacement must have a separate identity');
});
export type ArtifactManifest = z.infer<typeof artifactManifestSchema>;
export type ArtifactIdentity = z.infer<typeof artifactIdentitySchema>;
export type ArtifactLocation = z.infer<typeof artifactLocationSchema>;
export type ArtifactProvenance = z.infer<typeof provenanceSchema>;
export type ArtifactReproducibility = ArtifactManifest['reproducibility'];
export const parseManifests = (input: unknown) => {
 const manifests = z.array(artifactManifestSchema).parse(input);
 if (new Set(manifests.map(m=>m.artifactId)).size !== manifests.length) throw new Error('Duplicate artifact IDs');
 for (const m of manifests) if (m.replacesArtifactId && !manifests.some(parent => parent.artifactId === m.replacesArtifactId)) throw new Error('Missing historical replacement identity');
 return manifests;
};
