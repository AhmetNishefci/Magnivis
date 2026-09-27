import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

export const safeAreaProfileIds = {
  verticalShortMaster: 'safe-area.vertical-short-master.v1',
  youtubeShorts: 'safe-area.youtube-shorts.v1',
  tiktokFeedV1: 'safe-area.tiktok-feed.v1',
  tiktokFeed: 'safe-area.tiktok-feed.v2',
  instagramReels: 'safe-area.instagram-reels.v1',
  facebookReels: 'safe-area.facebook-reels.v1',
} as const;

export const safeAreaProfileSchema = z.object({
  id: stableKnowledgeIdSchema,
  revision: z.number().int().positive(),
  kind: z.enum(['master', 'platform']),
  canvas: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).strict(),
  insets: z.object({
    top: z.number().int().nonnegative(),
    right: z.number().int().nonnegative(),
    bottom: z.number().int().nonnegative(),
    left: z.number().int().nonnegative(),
  }).strict(),
  reviewedAt: z.iso.date(),
  notes: z.string().min(1),
}).strict().superRefine((profile, context) => {
  if (profile.insets.left + profile.insets.right >= profile.canvas.width) {
    context.addIssue({
      code: 'custom',
      path: ['insets'],
      message: 'Horizontal safe-area insets must leave usable canvas space',
    });
  }
  if (profile.insets.top + profile.insets.bottom >= profile.canvas.height) {
    context.addIssue({
      code: 'custom',
      path: ['insets'],
      message: 'Vertical safe-area insets must leave usable canvas space',
    });
  }
});

export type SafeAreaProfile = z.infer<typeof safeAreaProfileSchema>;

const profiles = [
  {
    id: safeAreaProfileIds.verticalShortMaster,
    revision: 1,
    kind: 'master',
    canvas: {width: 1080, height: 1920},
    insets: {top: 150, right: 190, bottom: 310, left: 84},
    reviewedAt: '2026-09-27',
    notes: 'Shared 9:16 master profile that preserves the reviewed YouTube layout. A TikTok iPhone preview proved that surface needs a stricter top inset and its own render.',
  },
  {
    id: safeAreaProfileIds.youtubeShorts,
    revision: 1,
    kind: 'platform',
    canvas: {width: 1080, height: 1920},
    insets: {top: 150, right: 190, bottom: 310, left: 84},
    reviewedAt: '2026-09-27',
    notes: 'Internal conservative YouTube Shorts UI profile. Client-controlled captions can still move outside the requested caption position.',
  },
  {
    id: safeAreaProfileIds.tiktokFeedV1,
    revision: 1,
    kind: 'platform',
    canvas: {width: 1080, height: 1920},
    insets: {top: 140, right: 190, bottom: 300, left: 72},
    reviewedAt: '2026-09-27',
    notes: 'Superseded historical profile. It failed the first real-device TikTok iPhone preview because the top-left information block conflicted with native navigation UI. Do not use it for future delivery.',
  },
  {
    id: safeAreaProfileIds.tiktokFeed,
    revision: 2,
    kind: 'platform',
    canvas: {width: 1080, height: 1920},
    insets: {top: 240, right: 190, bottom: 310, left: 84},
    reviewedAt: '2026-09-27',
    notes: 'Approved TikTok V2 profile. It changes only the top inset, moving the complete information region 90 px below the reviewed YouTube master position after an iPhone feed preview exposed a collision with top navigation. Left, right, and bottom geometry remain identical to the master. The resulting render passed private real-device QA on an iPhone 17 Pro Max on 2026-09-27.',
  },
  {
    id: safeAreaProfileIds.instagramReels,
    revision: 1,
    kind: 'platform',
    canvas: {width: 1080, height: 1920},
    insets: {top: 130, right: 170, bottom: 280, left: 72},
    reviewedAt: '2026-09-27',
    notes: 'Internal conservative Instagram Reels UI profile; cover cropping requires separate preview review.',
  },
  {
    id: safeAreaProfileIds.facebookReels,
    revision: 1,
    kind: 'platform',
    canvas: {width: 1080, height: 1920},
    insets: {top: 120, right: 160, bottom: 270, left: 72},
    reviewedAt: '2026-09-27',
    notes: 'Internal conservative Facebook Reels UI profile; placement UI can vary across devices and surfaces.',
  },
] satisfies readonly SafeAreaProfile[];

const profileMap = new Map<string, SafeAreaProfile>();
for (const input of profiles) {
  const profile = safeAreaProfileSchema.parse(input);
  if (profileMap.has(profile.id)) throw new Error(`Duplicate safe-area profile ID: ${profile.id}`);
  profileMap.set(profile.id, profile);
}

const sortedProfiles = [...profileMap.values()].sort((left, right) =>
  left.id.localeCompare(right.id));

export const safeAreaProfileRegistry = Object.freeze({
  get: (id: string) => {
    const profile = profileMap.get(id);
    if (!profile) throw new Error(`Unknown safe-area profile: ${id}`);
    return profile;
  },
  list: () => [...sortedProfiles],
});

export const safeAreaContains = (
  outer: SafeAreaProfile,
  inner: SafeAreaProfile,
) => outer.canvas.width === inner.canvas.width
  && outer.canvas.height === inner.canvas.height
  && outer.insets.top <= inner.insets.top
  && outer.insets.right <= inner.insets.right
  && outer.insets.bottom <= inner.insets.bottom
  && outer.insets.left <= inner.insets.left;
