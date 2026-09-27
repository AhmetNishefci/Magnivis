import {platformAccountSchema} from './schema';

export const youtubePrimaryAccount = platformAccountSchema.parse({
  id: 'account.youtube.primary',
  revision: 1,
  platform: 'youtube',
  displayName: 'Magnivis',
  status: 'active',
  recordedAt: '2026-09-27',
  notes: [
    'Four public Shorts are recorded in the repository.',
    'The exact platform-specific handle is intentionally omitted until the owner confirms it; historical branding used @Magnivis generically.',
  ],
});

export const instagramPrimaryAccount = platformAccountSchema.parse({
  id: 'account.instagram.magnivis-media',
  revision: 1,
  platform: 'instagram',
  displayName: 'Magnivis',
  handle: '@magnivis.media',
  bio: 'Understand something fascinating every day. 🌍🧠✨',
  status: 'configured',
  recordedAt: '2026-09-27',
  notes: [
    'Account configuration is managed outside this repository.',
    'The Speed of Light Instagram Reels variant still requires a private/real-platform preview before approval.',
  ],
});

export const platformAccounts = [
  instagramPrimaryAccount,
  youtubePrimaryAccount,
] as const;
