import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {stableJson} from '../../content-intelligence/run-schema';
import {bridgeDesignFrames} from './frames';

const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
const inspectionSchema = z.object({
  kind: z.literal('local-ai-assisted-design-frame-inspection'),
  inspectedBy: z.literal('Codex'), inspectedAt: z.iso.datetime(),
  method: z.literal('Viewed all five full-resolution PNGs and contact sheet with local image inspection tools.'),
  artifacts: z.array(z.object({path: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/)}).strict()).length(6),
  findings: z.array(z.string().min(1)).min(1),
  ownerDesignApproval: z.literal(false), realDeviceEvidence: z.literal(false), fullProductionAuthorized: z.literal(false),
}).strict();

export const writeBridgeDesignInspection = (directory: string, inspectedAt: string, findings: string[]) => {
  const paths = [...bridgeDesignFrames.map(({id}) => `${id}.png`), 'contact-sheet.png'];
  const inspection = inspectionSchema.parse({
    kind: 'local-ai-assisted-design-frame-inspection', inspectedBy: 'Codex', inspectedAt,
    method: 'Viewed all five full-resolution PNGs and contact sheet with local image inspection tools.',
    artifacts: paths.map((path) => ({path, sha256: hash(readFileSync(resolve(directory, path)))})),
    findings, ownerDesignApproval: false, realDeviceEvidence: false, fullProductionAuthorized: false,
  });
  const bytes = Buffer.from(`${stableJson(inspection, 2)}\n`);
  writeFileSync(resolve(directory, 'local-qa.json'), bytes);
  writeFileSync(resolve(directory, 'local-qa.sha256'), `${hash(bytes)}  local-qa.json\n`);
};

export const validateBridgeDesignInspection = (directory: string) => {
  const bytes = readFileSync(resolve(directory, 'local-qa.json'));
  const inspection = inspectionSchema.parse(JSON.parse(bytes.toString('utf8')));
  if (readFileSync(resolve(directory, 'local-qa.sha256'), 'utf8') !== `${hash(bytes)}  local-qa.json\n`) throw new Error('Local inspection record hash changed');
  const expectedPaths = [...bridgeDesignFrames.map(({id}) => `${id}.png`), 'contact-sheet.png'];
  if (new Set(inspection.artifacts.map(({path}) => path)).size !== 6 || !expectedPaths.every((path) => inspection.artifacts.some((artifact) => artifact.path === path))) throw new Error('Inspection does not cover all five frames and contact sheet');
  for (const artifact of inspection.artifacts) {
    if (hash(readFileSync(resolve(directory, artifact.path))) !== artifact.sha256) throw new Error(`Visual inspection is stale: ${artifact.path}`);
  }
  return inspection;
};
