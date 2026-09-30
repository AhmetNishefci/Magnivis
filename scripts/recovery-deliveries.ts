import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {selectDeliveryVariants} from './delivery-cli';
import {generateDeliveryPackage, validateDeliveryPackage} from './delivery-packages';
import {createRecoveryDeliveryContext} from './recovery-delivery-support';

const videoId = process.argv[2];
if (!['wood-frog', 'speed-of-light'].includes(videoId ?? '')) {
  throw new Error('Recovery deliveries support only wood-frog and speed-of-light.');
}
const originals = selectDeliveryVariants([videoId!]);
const {variants, dependencies} = createRecoveryDeliveryContext(originals);
const attemptDirectory = process.argv[3] ?? 'deliveries';
if (!['deliveries', 'deliveries-complete'].includes(attemptDirectory)) {
  throw new Error('Unknown recovery delivery attempt directory.');
}
for (const variant of variants) {
  const production = dependencies.productionResolver(variant);
  if (!existsSync(production.sourceVideoPath)) {
    throw new Error(`Missing staging media: ${production.sourceVideoPath}`);
  }
}
const outputRoot = resolve('recovery-work', videoId!, attemptDirectory);
if (existsSync(outputRoot)) throw new Error(`Preserve existing staging packages: ${outputRoot}`);
mkdirSync(outputRoot, {recursive: true});
writeFileSync(resolve(outputRoot, 'RECOVERY.md'), 'RECOVERY-GENERATED DELIVERY PACKAGE\n\nLocal technical reconstruction. No upload or publication authorized. Historical package identity and historical review decisions are not recovered. Packages use isolated recovery variant IDs; current canonical registries are unchanged.\n');
const generatedAt = new Date().toISOString();
const records = variants.map((variant) => {
  const original = originals.find((candidate) => `${candidate.id}.recovery-phase-1` === variant.id)!;
  const {directory, manifest} = generateDeliveryPackage({
    variantId: variant.id,
    outputRoot: resolve(outputRoot, 'packages'),
    generatedAt,
    dependencies,
  });
  validateDeliveryPackage(directory, dependencies);
  const manifestPath = resolve(directory, 'manifest.json');
  return {
    label: 'RECOVERY-GENERATED DELIVERY PACKAGE',
    directory,
    generatedAt,
    originalPlatformVariant: original,
    recoveryPlatformVariant: variant,
    manifestSha256: createHash('sha256').update(readFileSync(manifestPath)).digest('hex'),
    historicalPackageSha256: null,
    exactHistoricalPackageMatch: null,
    historicalSourceMaster: original.sourceMaster ?? null,
    lockedSourceChainRetained: Boolean(variant.sourceMaster),
    historicalApprovalTransferred: false,
    state: manifest.state,
    publicationAuthorized: manifest.review.publicationAuthorized,
    artifacts: manifest.artifacts,
    validation: 'passed',
  };
});
writeFileSync(resolve(outputRoot, 'recovery-provenance.json'), `${JSON.stringify(records, null, 2)}\n`);
console.log(JSON.stringify(records.map(({directory, state, lockedSourceChainRetained, validation}) => ({directory, state, lockedSourceChainRetained, validation})), null, 2));
