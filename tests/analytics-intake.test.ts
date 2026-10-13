import {describe, expect, it} from 'vitest';
import {readFileSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {buildAnalyticsIntake, parseAnalyticsCsv, parseNativeNumber, writeAnalyticsIntake} from '../src/operations/analytics-intake';
import {readPerformanceReviewContext} from '../src/content-intelligence/performance-context';
import {createHash} from 'node:crypto';

const batch = 'content-intelligence/operations/analytics-intake-2026-10-11-v1';
const manifest = () => JSON.parse(readFileSync(`${batch}/manifest.json`, 'utf8'));
describe('Native analytics export intake', () => {
  it('preserves large IDs, quoted descriptions, BOM, CRLF, blanks and physical line spans', () => {
    const parsed = parseAnalyticsCsv('\uFEFFid,text,metric\r\n18125134168908079,"one,\r\ntwo ""quoted""",\r\n');
    expect(parsed.rows[0]).toEqual({recordNumber: 2, startLine: 2, endLine: 3, raw: {id: '18125134168908079', text: 'one,\r\ntwo "quoted"', metric: ''}});
    expect(parseNativeNumber('')).toBeNull();
    expect(parseNativeNumber('0', true)).toBe(0);
  });
  it.each(['a,a\n1,2', 'a,b\n1', 'a\n"unterminated', 'a\n"ok"extra', 'a\nno"quote'])('rejects malformed CSV %s', input => {
    expect(() => parseAnalyticsCsv(input)).toThrow();
  });
  it.each(['NaN', '-1', '1,234', '1e3', ' 1', 'Infinity'])('rejects noncanonical native numbers %s', input => {
    expect(() => parseNativeNumber(input)).toThrow();
  });
  it('rejects unsafe counts rather than corrupting native identifiers', () => {
    expect(() => parseNativeNumber('18125134168908079', true)).toThrow();
  });
  it('reconciles independent native views without counting total rows or selected chart twice', () => {
    const result = buildAnalyticsIntake(manifest());
    expect(result.records).toHaveLength(207);
    expect(result.records.filter(r => r.kind === 'post')).toHaveLength(38);
    expect(result.calculations.find(c => c.id === 'youtube-post-views')?.value).toBe(6814);
    expect(result.calculations.find(c => c.id === 'youtube-channel-daily-views')?.value).toBe(6825);
    expect(result.calculations.find(c => c.id === 'youtube-selected-series-daily-views')?.value).toBe(5445);
    expect(result.calculations.find(c => c.id === 'instagram-views')?.value).toBe(3184);
    expect(result.calculations.find(c => c.id === 'facebook-reach')?.value).toBe(2157);
    expect(result.records.filter(r => r.mapping?.status === 'exact-publication')).toHaveLength(3);
    expect(result.nativeMetricSnapshotsCreated).toBe(0);
    expect(result.sources.every(s => s.captureAt === null)).toBe(true);
    expect(result.warnings.join(' ')).toMatch(/Watch time.*differs/);
  });
  it('preserves blanks separately from zero and both Facebook retention families', () => {
    const result = buildAnalyticsIntake(manifest());
    const traffic = result.records.find(r => r.sourceId === 'facebook-videos' && r.recordNumber === 3)!;
    expect(traffic.nativeMetrics.find(m => m.name === 'Percentage of total views at interval 40')?.value).toBeNull();
    expect(traffic.nativeMetrics.find(m => m.name === 'Percentage of total views at interval 0')?.value).toBe(0.94);
    expect(traffic.nativeMetrics.find(m => m.name === 'Percentage of 15-second views at interval 0')?.value).toBe(1);
    expect(traffic.mapping?.status).toBe('candidate-content');
    expect(traffic.mapping?.publicationId).toBeNull();
  });
  it('rejects source tampering, wrong scope and schema drift', () => {
    const m = manifest(); m.sources[0].file.sha256 = '0'.repeat(64);
    expect(() => buildAnalyticsIntake(m)).toThrow(/digest/);
    const scope = manifest(); scope.sources[3].metricWindow = 'selected-date-range';
    expect(() => buildAnalyticsIntake(scope)).toThrow(/window/);
    const schema = manifest(); schema.sources[0].expectedColumns.reverse();
    expect(() => buildAnalyticsIntake(schema)).toThrow(/schema/);
  });
  it('exposes hash-bound contextual lessons without granting strength, causality or a discovery start', () => {
    const path = `${batch}/learning-context.json`;
    const ref = {path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex')};
    const context = readPerformanceReviewContext(ref);
    expect(context.intakeSummary.postRecordCount).toBe(38);
    expect(context.lessons.every(l => l.strength === 'weak' && !l.causalityEstablished && !l.styleCopyAuthorized)).toBe(true);
    expect(context.ownerReview).toBe('pending');
  });
  it('allows identical reruns and refuses to overwrite a changed stored batch', () => {
    const dir = mkdtempSync(join(tmpdir(), 'magnivis-analytics-test-'));
    try {
      const path = join(dir, 'manifest.json'); writeFileSync(path, JSON.stringify(manifest()));
      const first = writeAnalyticsIntake(path);
      expect(writeAnalyticsIntake(path)).toEqual(first);
      writeFileSync(first.path, '{}\n');
      expect(() => writeAnalyticsIntake(path)).toThrow(/overwrite/);
    } finally {rmSync(dir, {recursive: true, force: true});}
  });
});
