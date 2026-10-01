import {createHash} from 'node:crypto';
import closure from '../system-audits/adaptive-creative-direction-v1/cycle-1-closure-checkpoint.json';

// This checkpoint recognizes only the exact owner-authorized closure bytes.
// Neither additional records nor edits to the historical prefix are exempt.
export const validateAdaptiveHistoricalBytes = (
  file: {path: string; sha256: string},
  bytes: Buffer,
) => {
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash === file.sha256) return 'original-baseline' as const;
  if (file.path === closure.path && file.sha256 === closure.originalBaselineSha256 && hash === closure.sha256) {
    const records = JSON.parse(bytes.toString('utf8'));
    const prefixHash = createHash('sha256')
      .update(JSON.stringify(records.slice(0, closure.preservedPrefixRecords))).digest('hex');
    if (records.length === closure.currentRecords && prefixHash === closure.preservedPrefixSha256) {
      return 'exact-cycle-1-closure' as const;
    }
  }
  throw new Error(`Historical byte regression: ${file.path}`);
};
