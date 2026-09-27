import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';
import {
  platformSchema,
  platformSurfaceByPlatform,
  platformSurfaceSchema,
} from './schema';

export const platformProfileIds = {
  youtubeShorts: 'platform-profile.youtube-shorts.2026-09-27',
  tiktokFeed: 'platform-profile.tiktok-feed.2026-09-27',
  instagramReels: 'platform-profile.instagram-reels.2026-09-27',
  facebookReels: 'platform-profile.facebook-reels.2026-09-27',
} as const;

export const platformProfileSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
  platform: platformSchema,
  surface: platformSurfaceSchema,
  reviewedAt: z.iso.date(),
  sourceUrls: z.array(z.url()).min(1),
  validatedEnvelope: z.object({
    aspectRatios: z.array(z.enum(['9:16', '1:1', '16:9'])).min(1),
    durationSeconds: z.object({
      minimum: z.number().nonnegative(),
      maximum: z.number().positive(),
    }).strict(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().positive(),
    container: z.enum(['mp4', 'mov', 'webm']),
    videoCodec: z.enum(['h264', 'h265', 'vp8', 'vp9']),
    audioCodec: z.enum(['aac', 'opus']),
  }).strict(),
  notes: z.array(z.string().min(1)).min(1),
}).strict().superRefine((profile, context) => {
  if (platformSurfaceByPlatform[profile.platform] !== profile.surface) {
    context.addIssue({
      code: 'custom',
      path: ['surface'],
      message: `${profile.surface} is not a valid surface for ${profile.platform}`,
    });
  }
  if (
    profile.validatedEnvelope.durationSeconds.maximum
    < profile.validatedEnvelope.durationSeconds.minimum
  ) {
    context.addIssue({
      code: 'custom',
      path: ['validatedEnvelope', 'durationSeconds'],
      message: 'Platform profile duration range is invalid',
    });
  }
});

export type PlatformProfile = z.infer<typeof platformProfileSchema>;

const commonVerticalEnvelope: PlatformProfile['validatedEnvelope'] = {
  aspectRatios: ['9:16'],
  durationSeconds: {minimum: 3, maximum: 60},
  width: 1080,
  height: 1920,
  fps: 30,
  container: 'mp4',
  videoCodec: 'h264',
  audioCodec: 'aac',
};

const inputs = [
  {
    id: platformProfileIds.youtubeShorts,
    revision: 1,
    platform: 'youtube',
    surface: 'youtube-shorts',
    reviewedAt: '2026-09-27',
    sourceUrls: [
      'https://support.google.com/youtube/answer/15424877?hl=en',
      'https://support.google.com/youtube/answer/12779649?hl=en',
    ],
    validatedEnvelope: commonVerticalEnvelope,
    notes: [
      'The 3–60 second range is Magnivis’s conservative V1 delivery envelope, not YouTube’s complete current duration limit.',
      'YouTube currently classifies square or vertical uploads up to three minutes as Shorts; re-review before revising this profile.',
    ],
  },
  {
    id: platformProfileIds.tiktokFeed,
    revision: 1,
    platform: 'tiktok',
    surface: 'tiktok-feed',
    reviewedAt: '2026-09-27',
    sourceUrls: [
      'https://developers.tiktok.com/docs/en/content-posting-api-media-transfer-guide',
      'https://developers.tiktok.com/docs/en/content-sharing-guidelines',
    ],
    validatedEnvelope: commonVerticalEnvelope,
    notes: [
      'The envelope is a conservative export target; TikTok account/API duration capability must be checked dynamically if publishing is implemented later.',
      'TikTok’s official transfer guide supports MP4/H.264 and 23–60 FPS, which includes this profile.',
    ],
  },
  {
    id: platformProfileIds.instagramReels,
    revision: 1,
    platform: 'instagram',
    surface: 'instagram-reels',
    reviewedAt: '2026-09-27',
    sourceUrls: [
      'https://www.facebook.com/business/ads/facebook-instagram-reels-ads',
    ],
    validatedEnvelope: commonVerticalEnvelope,
    notes: [
      'Meta recommends native 9:16 Reels creative with audio and key messages inside a safe zone.',
      'This is a conservative Magnivis envelope, not an exhaustive statement of every Instagram upload limit.',
    ],
  },
  {
    id: platformProfileIds.facebookReels,
    revision: 1,
    platform: 'facebook',
    surface: 'facebook-reels',
    reviewedAt: '2026-09-27',
    sourceUrls: [
      'https://www.facebook.com/business/ads/facebook-instagram-reels-ads',
      'https://www.facebook.com/help/262748009210134/',
    ],
    validatedEnvelope: commonVerticalEnvelope,
    notes: [
      'Facebook is consolidating video into Reels and supports broader lengths/orientations; this profile intentionally keeps the shared vertical short envelope.',
      'Re-review the surface before implementing any future publishing integration.',
    ],
  },
] satisfies readonly PlatformProfile[];

const profileMap = new Map<string, PlatformProfile>();
for (const input of inputs) {
  const profile = platformProfileSchema.parse(input);
  if (profileMap.has(profile.id)) throw new Error(`Duplicate platform profile ID: ${profile.id}`);
  profileMap.set(profile.id, profile);
}

const sortedProfiles = [...profileMap.values()].sort((left, right) =>
  left.id.localeCompare(right.id));

export const platformProfileRegistry = Object.freeze({
  get: (id: string) => {
    const profile = profileMap.get(id);
    if (!profile) throw new Error(`Unknown platform profile: ${id}`);
    return profile;
  },
  list: () => [...sortedProfiles],
});
