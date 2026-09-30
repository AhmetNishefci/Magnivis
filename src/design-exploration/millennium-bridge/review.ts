import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {millenniumBridgeApprovedContentAsset as asset} from '../../content-assets/assets/millennium-bridge-approved';
import {millenniumBridgeReviewDirectory, validateMillenniumBridgeApprovalArtifacts} from '../../content-intelligence/reviews/millennium-bridge-approval';
import {stableJson, sha256Json} from '../../content-intelligence/run-schema';
import {safeAreaProfileIds, safeAreaProfileRegistry} from '../../design/safe-areas';
import {millenniumBridgeApprovedKnowledgePackage as knowledgePackage} from '../../knowledge/packages/millennium-bridge-approved';
import {bridgeDesignFrames, bridgeDesignSize, bridgeDesignThesis, bridgeDisclosure, bridgeFontPath, bridgeFrameBeatIds, outlinedText, renderBridgeDesignSvg, type BridgeDesignFrame} from './frames';

export const bridgeDesignReviewDirectory = 'design-reviews/millennium-bridge-candidate-3-reconstruction-v1';
const hash = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
const json = (value: unknown) => `${stableJson(value, 2)}\n`;
const png = (svg: string) => sharp(Buffer.from(svg)).png({compressionLevel: 9, adaptiveFiltering: false, palette: false}).toBuffer();

export const bridgeFrameSafeAreaChecks = (frame: BridgeDesignFrame) => [safeAreaProfileIds.youtubeShorts, safeAreaProfileIds.tiktokFeed].map((id) => {
  const profile = safeAreaProfileRegistry.get(id);
  const results = frame.criticalRegions.map((region) => ({
    ...region,
    inside: region.x >= profile.insets.left && region.y >= profile.insets.top
      && region.x + region.width <= profile.canvas.width - profile.insets.right
      && region.y + region.height <= profile.canvas.height - profile.insets.bottom,
  }));
  return {profileId: profile.id, revision: profile.revision, profileSha256: sha256Json(profile), passed: results.every(({inside}) => inside), regions: results};
});

export const validateBridgeDesignInputs = () => {
  const approval = validateMillenniumBridgeApprovalArtifacts(resolve(millenniumBridgeReviewDirectory));
  if (sha256Json(approval.knowledgePackage) !== sha256Json(knowledgePackage) || sha256Json(approval.contentAsset) !== sha256Json(asset)) throw new Error('Registered editorial snapshots differ from owner-approved source');
  const coveredBeats = new Set<string>();
  for (const frame of bridgeDesignFrames) {
    bridgeFrameBeatIds(frame).forEach((id) => coveredBeats.add(id));
    for (const id of frame.claimIds) {
      if (knowledgePackage.claims.find((claim) => claim.id === id)?.verificationStatus !== 'verified') throw new Error(`Design frame uses non-verified claim: ${id}`);
    }
    if (!bridgeFrameSafeAreaChecks(frame).every(({passed}) => passed)) throw new Error(`Unsafe declared critical region: ${frame.id}`);
  }
  if (coveredBeats.size !== asset.narrativeStructure.length) throw new Error('Design exploration must cover all six approved beats');
  return approval;
};

export const generateBridgeDesignArtifacts = async () => {
  const approval = validateBridgeDesignInputs();
  const files: Record<string, Buffer> = {};
  const frames = [];
  for (const frame of bridgeDesignFrames) {
    const svg = renderBridgeDesignSvg(frame);
    const image = await png(svg);
    const metadata = await sharp(image).metadata();
    if (metadata.width !== 1080 || metadata.height !== 1920) throw new Error(`Invalid design frame dimensions: ${frame.id}`);
    files[`${frame.id}.svg`] = Buffer.from(svg);
    files[`${frame.id}.png`] = image;
    frames.push({
      id: frame.id, title: frame.title, explanation: frame.explanation,
      narrativeBeatIds: bridgeFrameBeatIds(frame), claimIds: frame.claimIds,
      source: {path: `${frame.id}.svg`, sha256: hash(svg)},
      png: {path: `${frame.id}.png`, sha256: hash(image), ...bridgeDesignSize},
      disclosure: bridgeDisclosure, safeAreaChecks: bridgeFrameSafeAreaChecks(frame),
    });
  }
  const sheetSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1460" viewBox="0 0 1080 1460"><rect width="1080" height="1460" fill="#07111f"/>${outlinedText('CANDIDATE 3 / RECONSTRUCTED DESIGN REVIEW', 24, 35, 22)}${outlinedText('New replacement frames. Owner design approval pending.', 24, 64, 18, '#a8bac5')}${bridgeDesignFrames.map((frame, index) => {
    const x = index % 3 * 360; const y = 84 + Math.floor(index / 3) * 688;
    return `<image x="${x}" y="${y}" width="360" height="640" href="data:image/png;base64,${files[`${frame.id}.png`]!.toString('base64')}"/>${outlinedText(`${index + 1} / ${frame.camera.toUpperCase()}`, x + 16, y + 668, 19)}`;
  }).join('')}</svg>`;
  const sheet = await png(sheetSvg);
  files['contact-sheet.png'] = sheet;
  files['source-representation.json'] = Buffer.from(json({
    kind: 'original-vector-design-exploration', revision: 1, thesis: bridgeDesignThesis,
    dimensions: bridgeDesignSize, frames: bridgeDesignFrames,
    rendererSourcePaths: ['src/design-exploration/millennium-bridge/frames.ts', 'src/design-exploration/millennium-bridge/review.ts'],
    noTimingOrProductionPlan: true, noCaptionPlan: true,
  }));
  const manifest = {
    id: 'design-review.millennium-bridge.candidate-3.reconstruction.v1', revision: 1,
    status: 'ready-for-owner-design-review', thesis: bridgeDesignThesis,
    provenance: {
      artifactKind: 'newly-generated-reconstructed-replacements', recoveredOriginalBytes: false, identicalToLostFrames: false,
      historicalDirectionSource: 'Owner Milestone 2 reconstruction instruction; historical five-frame direction only.',
      originalDesignCommitHistoricalReference: 'f4e42118da26a5dad4168a20429ef40dc90c7572',
      decisionEntryAt: approval.decision.reviewedAt,
      approvedKnowledgePackage: {id: knowledgePackage.id, revision: knowledgePackage.revision, sha256: sha256Json(knowledgePackage)},
      approvedContentAsset: {id: asset.id, revision: asset.revision, sha256: sha256Json(asset)},
      editorialOwnerDecision: {id: approval.decision.id, sha256: sha256Json(approval.decision)},
      designFramesApproved: false, fullProductionAuthorized: false, platformActivityAuthorized: false, publicationAuthorized: false,
    },
    generation: {
      method: 'Original deterministic SVG geometry and bundled Manrope glyph outlines, rasterized with Sharp; no AI image service or external imagery.',
      sharp: sharp.versions.sharp, vips: sharp.versions.vips, rsvg: sharp.versions.rsvg,
      fontkit: '2.0.4', font: {package: '@fontsource/manrope@5.3.0', file: 'manrope-latin-500-normal.woff2', sha256: hash(readFileSync(bridgeFontPath)), license: 'OFL-1.1'},
      reproducibility: 'No random seeds, clock input, system font lookup or network. Exact PNG verification uses the pinned rasterizer stack; other renderer versions/platforms must verify rather than assume byte identity.',
    },
    frames,
    contactSheet: {path: 'contact-sheet.png', sha256: hash(sheet), width: 1080, height: 1460},
    sanity: {
      dimensionsAndHashes: 'passed', editorialSourceIntegrity: 'passed', allSixNarrativeBeatsCovered: true,
      checksScope: 'Declared critical-content rectangles only, with local SVG/PNG visual inspection required. Contextual deck/rails/environment may bleed outside safe regions.',
      youtubeProfile: 'Surviving YouTube Shorts V1; no V2 exists at this baseline.',
      metaSurfaceGeometryReconstructed: false, realDeviceOrPlatformQA: false,
    },
    intentionallyExcluded: ['Candidate 1/2 media', 'stick figures', 'dominant force arrows/labels', 'copied scientific figures', 'unanimous marching', 'final narration/audio', 'final captions/timing', 'full video', 'Meta surface models', 'PlatformVariants/DeliveryPackages'],
    scientificConstraints: ['Model illustration, not measured opening-day trajectories or exact bridge installation geometry.', 'Foot placement and force feedback do not require crowd-wide synchrony at onset.', 'Later coherence may change motion; historical mechanism mixture remains uncertain.', 'Damping suppresses response without guaranteeing zero future motion.', 'Injury assertions remain excluded.'],
  };
  files['manifest.json'] = Buffer.from(json(manifest));
  files['review.md'] = Buffer.from([
    '# Millennium Bridge Candidate 3 — reconstructed design direction', '',
    bridgeDesignThesis, '',
    'These five 1080×1920 frames are newly generated reconstructed replacements, not recovered original PNGs. Editorial approval is recorded separately. Owner design approval is pending; full Candidate 3 production remains unauthorized.', '',
    '![Contact sheet](contact-sheet.png)', '',
    ...frames.flatMap((frame) => [`## ${frame.title}`, '', `![${frame.title}](${frame.png.path})`, '', frame.explanation, '', `PNG SHA-256: \`${frame.png.sha256}\`. Source SVG: [${frame.source.path}](${frame.source.path}).`, '']),
    '## Local QA and limits', '',
    'The separately recorded [local visual inspection](local-qa.json) binds its actual inspection time to the five PNG hashes and contact sheet. Its checksum is local-qa.sha256; generation never manufactures a new visual inspection.', '',
    'Each frame has the same readable two-line Manrope disclosure near the upper-left interior: SIMPLIFIED EXPLANATORY MODEL / MOTION EXAGGERATED. It is separate from captions; no sample narration captions or final CaptionPlan exist.', '',
    'Declared critical rectangles fit surviving YouTube Shorts V1 and TikTok V2. There is no surviving YouTube V2 profile. Environmental geometry can bleed to canvas edges. These are local sanity checks, not real-device evidence or platform approval. Meta surface geometry is not reconstructed.', '',
    'SVG and PNG dimensions, new hashes, approved editorial source/decision bindings, six-beat coverage and deterministic regeneration are validated. Pinned Sharp/libvips/librsvg versions and bundled font identity are in manifest.json. A future renderer/environment must verify hashes rather than assume byte identity.', '',
    'Original procedural/vector artwork only; no footage, copied figures, textures or identifiable faces. Integrated damper hardware is an explanatory abstraction, not an engineering installation drawing. Warm contact/dissipation accents and edge-position witnesses are uncalibrated explanatory marks, not measured force or energy data.', '',
    'Candidate 1 and Candidate 2 are historical rejected versions; their exact original source/bytes were not recovered and no replacement media is made. Reconstruction resumes from the owner-preferred Candidate 3 thesis.', '',
    '## Next owner gate', '',
    'Ahmet reviews these exact five PNG hashes for human physicality, bridge depth, contact/response causality, varied crowd phases, coherence uncertainty, damping payoff, disclosure legibility and cohesive art direction. Approve or request revisions. No full video is rendered until explicit approval of these reconstructed frames and subsequent production authorization.', '',
  ].join('\n'));
  files['hashes.json'] = Buffer.from(json({algorithm: 'SHA-256', identity: 'new replacement artifact bytes', files: Object.entries(files).map(([path, bytes]) => ({path, sha256: hash(bytes), bytes: bytes.length}))}));
  return {files, manifest};
};

export const writeBridgeDesignReview = async (directory: string) => {
  const {files, manifest} = await generateBridgeDesignArtifacts();
  mkdirSync(directory, {recursive: true});
  for (const [filename, bytes] of Object.entries(files)) writeFileSync(resolve(directory, filename), bytes);
  return manifest;
};

export const validateBridgeDesignReview = async (directory: string) => {
  const {files, manifest} = await generateBridgeDesignArtifacts();
  for (const [filename, bytes] of Object.entries(files)) {
    if (!readFileSync(resolve(directory, filename)).equals(bytes)) throw new Error(`Stale or modified design-review artifact: ${filename}`);
  }
  return manifest;
};
