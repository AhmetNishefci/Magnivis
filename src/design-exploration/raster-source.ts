import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {z} from 'zod';

const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
export const rasterSourceSchema = z.object({
  id: z.string().startsWith('asset.'), path: z.string().regex(/^sources\/[0-9]{2}-[a-z-]+-original\.png$/),
  sha256, width: z.number().int().positive(), height: z.number().int().positive(),
  origin: z.literal('built-in-imagegen'), generatedInternally: z.literal(true), procedural: z.literal(false),
  externalReferenceImages: z.array(z.string()).length(0), copiedProtectedArtwork: z.string().min(1),
  licenseStatus: z.string().min(1), usageStatus: z.literal('owner-authorized-design-exploration; final production selection pending'),
  termsReferences: z.array(z.url()).min(1), termsRetrieved: z.iso.date(),
  generation: z.object({
    tool: z.literal('image_gen.imagegen'), mode: z.literal('built-in'),
    prompt: z.string().min(1), promptSha256: sha256,
    toolArtifactBasename: z.string().regex(/^exec-[a-f0-9-]+\.png$/), observedAfterGenerationAt: z.iso.datetime(),
    model: z.null(), seed: z.null(), providerResponseId: z.null(), usage: z.null(), metadataLimitation: z.string().min(1),
  }).strict(),
  regeneration: z.string().min(1), scientificUse: z.string().min(1),
}).strict();
export type RasterSource = z.infer<typeof rasterSourceSchema>;
export const fileSha256 = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');

export const validateRasterSource = async (directory: string, input: unknown) => {
  const source = rasterSourceSchema.parse(input);
  if (fileSha256(source.generation.prompt) !== source.generation.promptSha256) throw new Error(`Prompt identity mismatch: ${source.id}`);
  const bytes = readFileSync(resolve(directory, source.path));
  if (fileSha256(bytes) !== source.sha256) throw new Error(`Raster source identity mismatch: ${source.id}`);
  const metadata = await sharp(bytes).metadata();
  if (metadata.format !== 'png' || metadata.width !== source.width || metadata.height !== source.height) throw new Error(`Raster source dimensions mismatch: ${source.id}`);
  return {source, bytes};
};
