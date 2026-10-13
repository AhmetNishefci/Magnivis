import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, join, relative} from 'node:path';
import {buildAnalyticsIntake, writeAnalyticsIntake} from '../src/operations/analytics-intake';
import {readPerformanceReviewContext} from '../src/content-intelligence/performance-context';

const [command, manifestPath] = process.argv.slice(2);
if (!manifestPath || !['write', 'verify', 'context'].includes(command!)) throw new Error('Usage: pnpm exec tsx scripts/analytics.ts <write|verify|context> <manifest.json>');
if (command === 'write') console.log(JSON.stringify(writeAnalyticsIntake(manifestPath), null, 2));
else if (command === 'verify') {
  const result = buildAnalyticsIntake(JSON.parse(readFileSync(manifestPath, 'utf8')));
  const stored = JSON.parse(readFileSync(join(dirname(manifestPath), 'parsed.json'), 'utf8'));
  if (JSON.stringify(result) !== JSON.stringify(stored)) throw new Error('Parsed analytics differ from original evidence');
  console.log(JSON.stringify({passed: true, sources: result.sources.length, sourceRecords: result.records.length, postRecords: result.records.filter(r => r.kind === 'post').length, nativeMetricSnapshotsCreated: 0, warnings: result.warnings}, null, 2));
} else {
  const path = join(dirname(manifestPath), 'learning-context.json');
  const ref = {path: relative(process.cwd(), path), sha256: createHash('sha256').update(readFileSync(path)).digest('hex')};
  console.log(JSON.stringify(readPerformanceReviewContext(ref), null, 2));
}
