import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import sharp from 'sharp';
import {z} from 'zod';
import {stableJson, sha256Json} from '../../content-intelligence/run-schema';
import {millenniumBridgeApprovedContentAsset as asset} from '../../content-assets/assets/millennium-bridge-approved';
import {millenniumBridgeApprovedKnowledgePackage as knowledge} from '../../knowledge/packages/millennium-bridge-approved';
import {millenniumBridgeReviewDirectory, validateMillenniumBridgeApprovalArtifacts} from '../../content-intelligence/reviews/millennium-bridge-approval';
import {safeAreaProfileIds, safeAreaProfileRegistry} from '../../design/safe-areas';
import {bridgeFontPath, outlinedText, type CriticalRegion} from '../millennium-bridge/frames';
import {fileSha256 as hash, validateRasterSource} from '../raster-source';
import {explorationBShots, explorationBThesis, explorationBWitnesses} from './shots';

export const explorationBDirectory = 'design-reviews/millennium-bridge-exploration-b-v1';
export const rejectionPath = 'design-reviews/decisions/millennium-bridge-exploration-a-rejection-v1.json';
const json = (value: unknown) => `${stableJson(value, 2)}\n`;
const identity = z.string().regex(/^[a-f0-9]{64}$/);
const rejectionSchema = z.object({
  id: z.literal('owner-design-decision.millennium-bridge.exploration-a.rejection.v1'),
  reviewer: z.literal('Ahmet Nishefci'), decision: z.literal('reject-art-direction'), decisionEntryAt: z.iso.datetime(),
  reviewedCommit: z.literal('3c3421243d1bf37fbb5769a7e554b659b973fe09'),
  scope: z.literal('Visual execution only; scientific/editorial approvals remain intact.'),
  manifestPath: z.literal('design-reviews/millennium-bridge-candidate-3-reconstruction-v1/manifest.json'), manifestFileSha256: identity,
  frames: z.array(z.object({path: z.string(), sha256: identity}).strict()).length(5),
  contactSheet: z.object({path: z.literal('contact-sheet.png'), sha256: identity, width: z.literal(1080), height: z.literal(1460)}).strict(),
  editorialApprovalBindingPath: z.literal('content-intelligence/reviews/millennium-bridge-reconstruction-v1/editorial-approval-binding.json'), editorialApprovalBindingFileSha256: identity,
  feedback: z.array(z.string().min(1)).length(10), explorationAPreserved: z.literal(true), explorationBApproval: z.literal('pending'),
  fullProductionAuthorized: z.literal(false), platformActivityAuthorized: z.literal(false), publicationAuthorized: z.literal(false),
}).strict();

export const validateExplorationARejection = (input: unknown = JSON.parse(readFileSync(rejectionPath, 'utf8'))) => {
  const rejection = rejectionSchema.parse(input);
  if (hash(readFileSync(rejection.manifestPath)) !== rejection.manifestFileSha256) throw new Error('Rejected A manifest identity changed');
  const manifest = JSON.parse(readFileSync(rejection.manifestPath, 'utf8'));
  const directory = 'design-reviews/millennium-bridge-candidate-3-reconstruction-v1';
  const expected = manifest.frames.map((frame: {png: {path: string; sha256: string}}) => ({path: `${directory}/${frame.png.path}`, sha256: frame.png.sha256}));
  if (sha256Json(expected) !== sha256Json(rejection.frames)) throw new Error('A rejection frame coverage changed');
  for (const frame of rejection.frames) if (hash(readFileSync(frame.path)) !== frame.sha256) throw new Error('Rejected A frame identity changed');
  if (sha256Json(manifest.contactSheet) !== sha256Json(rejection.contactSheet) || hash(readFileSync(`${directory}/contact-sheet.png`)) !== rejection.contactSheet.sha256) throw new Error('Rejected A sheet changed');
  if (hash(readFileSync(rejection.editorialApprovalBindingPath)) !== rejection.editorialApprovalBindingFileSha256) throw new Error('Editorial binding changed');
  return rejection;
};

export const explorationBSafeAreaChecks = (shot: {criticalRegions: readonly CriticalRegion[]}) => [safeAreaProfileIds.youtubeShorts, safeAreaProfileIds.tiktokFeed].map((id) => {
  const profile = safeAreaProfileRegistry.get(id);
  const regions = shot.criticalRegions.map((region) => ({...region, inside: region.x >= profile.insets.left && region.y >= profile.insets.top && region.x + region.width <= profile.canvas.width - profile.insets.right && region.y + region.height <= profile.canvas.height - profile.insets.bottom}));
  return {profileId: id, revision: profile.revision, profileSha256: sha256Json(profile), regions, passed: regions.every(({inside}) => inside)};
});

export const validateExplorationBEditorial = () => {
  const approval = validateMillenniumBridgeApprovalArtifacts(resolve(millenniumBridgeReviewDirectory));
  if (sha256Json(knowledge) !== sha256Json(approval.knowledgePackage) || sha256Json(asset) !== sha256Json(approval.contentAsset)) throw new Error('Approved editorial identity changed');
  const beats = new Set(explorationBShots.flatMap((shot) => shot.beatSuffixes.map((suffix) => `${asset.id}.beat.${suffix}`)));
  if (beats.size !== 6 || !asset.narrativeStructure.every((beat) => beats.has(beat.id))) throw new Error('Incomplete six-beat binding');
  for (const shot of explorationBShots) {
    if (!shot.claimIds.every((id) => knowledge.claims.some((claim) => claim.id === id && claim.verificationStatus === 'verified'))) throw new Error('Unverified design claim');
    if (!explorationBSafeAreaChecks(shot).every(({passed}) => passed)) throw new Error('Unsafe declared critical rectangle');
  }
  validateExplorationARejection();
  return approval;
};

export const explorationBOverlay = (id: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${explorationBWitnesses(id)}<rect x="94" y="1480" width="500" height="110" rx="6" fill="#061521" opacity=".78"/>${outlinedText('SIMPLIFIED EXPLANATORY MODEL', 108, 1525, 25, '#edf1f1')}${outlinedText('MOTION EXAGGERATED', 108, 1560, 25, '#edf1f1')}</svg>`;

export const generateExplorationB = async (directory = resolve(explorationBDirectory)) => {
  const approval = validateExplorationBEditorial();
  const sourceInputs: unknown[] = JSON.parse(readFileSync(resolve(directory, 'source-assets.json'), 'utf8'));
  if (sourceInputs.length !== 5) throw new Error('Expected five original raster sources');
  const sources = await Promise.all(sourceInputs.map((input) => validateRasterSource(directory, input)));
  if (new Set(sources.map(({source}) => source.id)).size !== 5) throw new Error('Duplicate raster source');
  const files: Record<string, Buffer> = {};
  const frames = [];
  for (const [index, shot] of explorationBShots.entries()) {
    const source = sources.find(({source}) => source.id === shot.assetId);
    if (!source) throw new Error(`Missing shot asset: ${shot.assetId}`);
    const promptPath = `prompt-${String(index + 1).padStart(2, '0')}.txt`;
    if (readFileSync(resolve(directory, promptPath), 'utf8').trimEnd() !== source.source.generation.prompt) throw new Error('Prompt file differs from recorded tool prompt');
    const overlay = explorationBOverlay(shot.id);
    const png = await sharp(source.bytes).resize(1080, 1920, {fit: 'cover', position: 'centre', kernel: 'lanczos3'}).composite([{input: Buffer.from(overlay)}]).png({compressionLevel: 9, adaptiveFiltering: false, palette: false}).toBuffer();
    const metadata = await sharp(png).metadata();
    if (metadata.width !== 1080 || metadata.height !== 1920) throw new Error('Invalid keyframe dimensions');
    files[`${shot.id}.overlay.svg`] = Buffer.from(overlay);
    files[`${shot.id}.png`] = png;
    frames.push({...shot, narrativeBeatIds: shot.beatSuffixes.map((suffix) => `${asset.id}.beat.${suffix}`), source: source.source, promptPath,
      overlay: {path: `${shot.id}.overlay.svg`, sha256: hash(overlay)}, png: {path: `${shot.id}.png`, sha256: hash(png), width: 1080, height: 1920}, safeAreaChecks: explorationBSafeAreaChecks(shot)});
  }
  const sheetSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1460"><rect width="1080" height="1460" fill="#07111f"/>${outlinedText('EXPLORATION B / CINEMATIC DESIGN REVIEW', 24, 35, 22)}${outlinedText('Synthetic concepts. New bytes. Owner visual approval pending.', 24, 64, 17, '#a8bac5')}${frames.map((frame, index) => {
    const x = index % 3 * 360; const y = 84 + Math.floor(index / 3) * 688;
    return `<image x="${x}" y="${y}" width="360" height="640" href="data:image/png;base64,${files[frame.png.path]!.toString('base64')}"/>${outlinedText(`${index + 1} / ${['BALANCE', 'CONTACT', 'CROWD', 'LOCAL PHASE', 'DAMPING'][index]}`, x + 16, y + 667, 20)}`;
  }).join('')}</svg>`;
  const sheet = await sharp(Buffer.from(sheetSvg)).png({compressionLevel: 9, adaptiveFiltering: false, palette: false}).toBuffer();
  files['contact-sheet.png'] = sheet;
  files['composition.json'] = Buffer.from(json({kind: 'hybrid-still-design-exploration', revision: 1, shots: explorationBShots, thesis: explorationBThesis, canvas: {width: 1080, height: 1920}, noTimeline: true, noProductionPlan: true, noCaptionPlan: true, sourcePaths: ['src/design-exploration/raster-source.ts', 'src/design-exploration/millennium-bridge-b/shots.ts', 'src/design-exploration/millennium-bridge-b/review.ts'], resize: {fit: 'cover', position: 'centre', kernel: 'lanczos3'}, disclosure: ['SIMPLIFIED EXPLANATORY MODEL', 'MOTION EXAGGERATED']}));
  const supportingPaths = ['source-assets.json', 'pipeline-assessment.md', 'comparison-with-a.md', ...frames.map(({promptPath}) => promptPath), ...sources.map(({source}) => source.path)];
  const manifest = {
    id: 'design-review.millennium-bridge.exploration-b.v1', revision: 1, status: 'ready-for-owner-design-review', thesis: explorationBThesis,
    startingCommit: '3c3421243d1bf37fbb5769a7e554b659b973fe09',
    approvedEditorial: {knowledgePackage: {id: knowledge.id, revision: knowledge.revision, sha256: sha256Json(knowledge)}, contentAsset: {id: asset.id, revision: asset.revision, sha256: sha256Json(asset)}, decision: {id: approval.decision.id, sha256: sha256Json(approval.decision)}},
    explorationARejection: {path: rejectionPath, fileSha256: hash(readFileSync(rejectionPath))},
    provenance: {recoveredOriginalBytes: false, identicalToLostFrames: false, generatedOriginalAssets: true, externalReferenceImages: false, modelOutputIsScientificEvidence: false, nondeterministicSourceGeneration: true, deterministicCompositionFromFrozenBytes: true, ownerDesignApproval: false, fullProductionAuthorized: false, publicationAuthorized: false, platformActivityAuthorized: false},
    generation: {sharp: sharp.versions.sharp, vips: sharp.versions.vips, rsvg: sharp.versions.rsvg, fontkit: '2.0.4', font: {package: '@fontsource/manrope@5.3.0', sha256: hash(readFileSync(bridgeFontPath)), license: 'OFL-1.1'}, sourceDimensions: {width: 941, height: 1672}, outputDimensions: {width: 1080, height: 1920}, normalization: 'Approximately 15% Lanczos3 upscale with negligible centre cover crop; source images are not native 1080 or recovered historical assets.', reproducibility: 'Source generation cannot be replayed byte-identically. Reuse committed source bytes. Downstream generation has no network, clocks, randomness or system fonts; verify exact bytes on pinned stack, do not assume identity across rasterizer/platform versions.'},
    frames, contactSheet: {path: 'contact-sheet.png', sha256: hash(sheet), width: 1080, height: 1460},
    supportingFiles: supportingPaths.map((path) => ({path, sha256: hash(readFileSync(resolve(directory, path)))})),
    scientificConstraints: ['Synthetic illustrative world, not opening-day photography or measured bridge trajectories.', 'Generated bridge and damper geometry are illustrative, not exact retrofit installation documentation.', 'Temporal witnesses are uncalibrated and do not establish forces, phase fractions or historical mechanism mixture.', 'Crowd-wide synchronization is not a necessary initiating condition; later coordination may affect response.', 'Damping reduces response; neither zero future motion nor injury status is asserted.'],
    qa: {criticalRectangles: 'passed against surviving YouTube Shorts V1 and TikTok V2 only; not pixel segmentation or real-device QA', metaGeometryReconstructed: false, realDeviceEvidence: false, localVisualInspection: 'local-qa.json; recorded independently after viewing outputs', animationReadiness: 'not proven; static sources require future controlled layers, pose/gait and structural-motion prototype before full production'},
  };
  files['manifest.json'] = Buffer.from(json(manifest));
  files['review.md'] = Buffer.from([
    '# Millennium Bridge — Design Exploration B', '', explorationBThesis, '',
    'These are newly generated synthetic design concepts, not recovered frames or documentary photographs. Research, all 18 scoped claims and the exact approved narration remain unchanged. Exploration A is preserved and separately rejected for art direction. B is pending owner visual review. No full production or platform activity is authorized.', '',
    '![Five-shot contact sheet](contact-sheet.png)', '',
    ...frames.flatMap((frame) => [`## ${frame.title}`, '', `![${frame.title}](${frame.png.path})`, '', `${frame.improvement} Shot: ${frame.shotScale}.`, '', `Future motion intent: ${frame.cameraPlan} Transition: ${frame.transitionPlan}`, '', `SHA-256: \`${frame.png.sha256}\`. Source: [${frame.source.path}](${frame.source.path}); overlay: [${frame.overlay.path}](${frame.overlay.path}).`, '']),
    '## Assess the direction', '',
    '1. Does the opening stop the scroll?', '2. Does the pedestrian feel human rather than mannequin-like?', '3. Is the corrective reaction physically readable?', '4. Does the bridge feel like a place?', '5. Is foot placement intuitive?', '6. Does the crowd escalate scale?', '7. Is the overhead coherence scene distinct?', '8. Is the damping payoff immediately understandable?', '9. Is shot variety sufficient?', '10. Does the direction feel like Magnivis?', '11. Can the proposed motion pipeline sustain this quality?', '12. Are sources reproducible and provenance-safe?', '',
    '## Pipeline, provenance and limits', '',
    'Read [pipeline assessment](pipeline-assessment.md), [comparison with A](comparison-with-a.md), [source metadata and exact prompts](source-assets.json), [manifest](manifest.json) and [local inspection](local-qa.json). All five PNGs are 1080×1920 deterministic compositions of hash-frozen 941×1672 generated sources. Re-prompting creates new identities; it cannot reproduce the current sources. Model/seed/usage IDs were not exposed by the built-in tool and remain null. Provider-output terms apply; no CC0 or uniqueness claim is made.', '',
    'The two-line model disclosure is consistent, readable and separate from captions. For animation, disclose at mechanism onset and reintroduce for the hardware abstraction, with duration/readability tested in the future prototype. No final CaptionPlan exists. Sparse edge/trajectory witnesses are uncalibrated artistic cues, not plots or copied scientific figures.', '',
    'Declared critical rectangles fit YouTube Shorts V1 and TikTok V2. Context may bleed; this check does not automatically identify every important pixel. Meta geometry is not guessed. The later Meta milestone requires actual owner screenshots/evidence after master approval: dedicated Instagram grid cover; separate Facebook Reel/feed testing.', '',
    'Static stills demonstrate art direction, not animation readiness. Generated geometry and shot-to-shot human/hardware consistency are illustrative. A future layered environment, controlled body/foot poses and deck/damper motion prototype must establish causality and continuity; simple zooms over these images are insufficient. The fixed photograph-like frames alone cannot prove sway or energy dissipation, so future motion must carry those causal changes.', '',
    '## Next human gate', '',
    'Ahmet must approve or reject these exact five B PNG hashes. Approval of still art direction is not authorization for a full video, Meta reconstruction, variants, delivery or publication.', '',
  ].join('\n'));
  files['hashes.json'] = Buffer.from(json({algorithm: 'SHA-256', identity: 'new Exploration B replacement bytes', files: [...Object.entries(files).map(([path, bytes]) => ({path, sha256: hash(bytes), bytes: bytes.length})), ...supportingPaths.map((path) => {const bytes = readFileSync(resolve(directory, path)); return {path, sha256: hash(bytes), bytes: bytes.length};})]}));
  return {files, manifest};
};

export const writeExplorationB = async (directory = resolve(explorationBDirectory)) => {
  const result = await generateExplorationB(directory);
  mkdirSync(directory, {recursive: true});
  for (const [path, bytes] of Object.entries(result.files)) writeFileSync(resolve(directory, path), bytes);
  return result.manifest;
};
export const validateExplorationB = async (directory = resolve(explorationBDirectory)) => {
  const {files, manifest} = await generateExplorationB(directory);
  for (const [path, bytes] of Object.entries(files)) if (!readFileSync(resolve(directory, path)).equals(bytes)) throw new Error(`Stale Exploration B artifact: ${path}`);
  return manifest;
};
