import {z} from 'zod';

export const sourceSchema = z.object({
  id: z.string().min(1),
  organization: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  retrieved: z.iso.date(),
});

export const factSchema = z.object({
  id: z.string().min(1),
  claim: z.string().min(1),
  value: z.number().positive(),
  unit: z.enum(['km', 'm', 'mm', 'm/s', 's', 'minutes', 'light-years', 'g', 'kg', 'usd', 'count', 'solar-radii']),
  basis: z.enum(['measured', 'defined', 'estimated', 'derived']),
  sourceIds: z.array(z.string().min(1)).min(1),
  display: z.string().min(1),
  notes: z.string().min(1),
});

export const sceneSchema = z.object({
  id: z.string().min(1),
  start: z.number().nonnegative(),
  end: z.number().positive(),
  purpose: z.string().min(1),
}).refine((scene) => scene.end > scene.start, 'Scene end must follow its start');

export const captionCueSchema = z.object({
  start: z.number().nonnegative(),
  end: z.number().positive(),
  lines: z.array(z.string().min(1)).min(1).max(2),
}).refine((cue) => cue.end > cue.start, 'Caption end must follow its start');

export const videoSpecSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  compositionId: z.string().min(1),
  workingTitle: z.string().min(1),
  titleCandidates: z.array(z.string().min(1)).min(1),
  descriptionCandidates: z.array(z.string().min(1)).min(1),
  hook: z.string().min(1),
  pillar: z.enum(['universe', 'earth', 'engineering', 'numbers', 'technology']),
  status: z.enum([
    'idea',
    'research',
    'approved',
    'production',
    'rendered',
    'reviewed',
    'uploaded-private',
    'published',
  ]),
  publication: z.object({
    platform: z.literal('youtube'),
    videoId: z.string().min(1),
    publicUrl: z.url(),
    publishedDate: z.iso.date(),
  }).optional(),
  language: z.string().min(2),
  captions: z.array(z.object({
    language: z.string().min(2),
    label: z.string().min(1),
    file: z.string().min(1),
    burnInCues: z.array(captionCueSchema).optional(),
  })),
  format: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().int().positive(),
    durationSeconds: z.number().positive(),
  }),
  scenes: z.array(sceneSchema).min(1),
  factIds: z.array(z.string().min(1)).min(1),
  audio: z.object({
    file: z.string().min(1),
    layers: z.array(z.enum(['music', 'ambient', 'transition', 'impact', 'narration', 'silence'])),
    narration: z.boolean(),
    narrationCues: z.array(z.object({
      id: z.string().min(1),
      file: z.string().min(1),
      start: z.number().nonnegative(),
      transcript: z.string().min(1),
    })),
  }),
});

export type SourceRecord = z.infer<typeof sourceSchema>;
export type FactRecord = z.infer<typeof factSchema>;
export type VideoSpec = z.infer<typeof videoSpecSchema>;
