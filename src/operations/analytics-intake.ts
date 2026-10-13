import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {readBoundFile, readBoundRecord, recordReferenceSchema, text} from '../workflow/evidence';
import {metricSnapshotSchema} from './schema';
import {publicationRegistry} from './registry';

const sourceSchema = z.object({
  id: text, platform: z.enum(['youtube', 'instagram', 'facebook']),
  layout: z.enum(['table', 'chart', 'totals', 'posts', 'videos']),
  file: recordReferenceSchema, bytes: z.number().int().positive(), originalFilename: text,
  ownerSuppliedPath: text, captureAt: z.iso.datetime().nullable(), exportedAt: z.iso.datetime().nullable(),
  sourceTimezone: text.nullable(), selectedRange: z.object({startDate: z.iso.date(), endDate: z.iso.date(), basis: text}).strict(),
  metricWindow: z.enum(['selected-date-range', 'lifetime']), windowBasis: text,
  expectedColumns: z.array(text).min(1), expectedRecordCount: z.number().int().positive(),
}).strict();
export const analyticsIntakeManifestSchema = z.object({
  schemaVersion: z.literal(1), id: text, recordedAt: z.iso.datetime(), recordTimeBasis: text,
  ownerReview: z.literal('pending'), sources: z.array(sourceSchema).min(1),
  mappings: recordReferenceSchema, priorReview: recordReferenceSchema, baseline: recordReferenceSchema,
}).strict();
const mappingsSchema = z.object({
  recordKind: z.literal('manual-analytics-mapping-review'), unmatchedPolicy: text, knownConflict: text,
  entries: z.array(z.object({
    sourceId: text, recordNumber: z.number().int().min(2), remoteId: text,
    status: z.enum(['exact-publication', 'legacy-remote-id', 'candidate-content', 'unmatched']),
    publicationId: text.nullable(), videoSpecCandidate: text.nullable(), cycleCandidate: text.nullable(),
    evidence: z.array(recordReferenceSchema).min(1), preparedReleaseCandidate: recordReferenceSchema.nullable(),
    rationale: text, exactUploadedMediaEstablishedByCsv: z.literal(false),
  }).strict()),
}).strict();

/** RFC-style CSV subset used by native exports: quoted multiline fields, CRLF and escaped quotes.
 * Record numbers count CSV records, not physical lines; physical line spans are retained too. */
export const parseAnalyticsCsv = (input: string) => {
  const data = input.replace(/^\uFEFF/, '');
  const rows: {cells: string[]; startLine: number; endLine: number}[] = [];
  let cells: string[] = [], cell = '', quoted = false, closed = false, line = 1, startLine = 1;
  for (let i = 0; i < data.length; i++) {
    const c = data[i]!;
    if (quoted) {
      if (c === '"') {
        if (data[i + 1] === '"') {cell += '"'; i++;} else {quoted = false; closed = true;}
      } else {cell += c; if (c === '\n') line++;}
      continue;
    }
    if (closed && c !== ',' && c !== '\r' && c !== '\n') throw new Error('Invalid CSV text after closing quote');
    if (c === '"') {
      if (cell || closed) throw new Error('Invalid CSV quote');
      quoted = true;
    } else if (c === ',') {cells.push(cell); cell = ''; closed = false;}
    else if (c === '\r' || c === '\n') {
      if (c === '\r' && data[i + 1] === '\n') i++;
      cells.push(cell); rows.push({cells, startLine, endLine: line});
      cells = []; cell = ''; closed = false; line++; startLine = line;
    } else cell += c;
  }
  if (quoted) throw new Error('Unterminated CSV quote');
  if (cell || closed || cells.length) {cells.push(cell); rows.push({cells, startLine, endLine: line});}
  const header = rows.shift()?.cells;
  if (!header?.length || header.some(c => !c) || new Set(header).size !== header.length) throw new Error('Invalid/duplicate CSV header');
  return {header, rows: rows.map((row, i) => {
    if (row.cells.length !== header.length) throw new Error(`CSV record ${i + 2} column count mismatch`);
    return {recordNumber: i + 2, startLine: row.startLine, endLine: row.endLine, raw: Object.fromEntries(header.map((key, j) => [key, row.cells[j]!]))};
  })};
};

export const parseNativeNumber = (raw: string, integer = false): number | null => {
  if (raw === '') return null;
  if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new Error(`Invalid nonnegative native number: ${raw}`);
  const value = Number(raw);
  if (!Number.isFinite(value) || (integer && !Number.isSafeInteger(value))) throw new Error('Invalid/unsafe native count');
  return value;
};
const avdSeconds = (raw: string) => {
  if (!/^\d+:\d{2}:\d{2}$/.test(raw)) throw new Error('Invalid average view duration');
  const [h, m, s] = raw.split(':').map(Number) as [number, number, number];
  if (m >= 60 || s >= 60) throw new Error('Invalid clock component');
  return h * 3600 + m * 60 + s;
};
const nonMetrics = new Set(['Content', 'Video title', 'Video publish time', 'Date', 'Post ID', 'Account ID', 'Account username', 'Account name', 'Description', 'Publish time', 'Permalink', 'Post type', 'Data comment', 'Video asset ID', 'Universal video ID', 'Page ID', 'Page name', 'Title', 'Custom labels']);
const numericDefinition = (name: string, platform: string) => {
  if (name.startsWith('Percentage of ')) return {unit: 'ratio' as const, definition: 'Native retention cell stored on observed 0–1 scale. Interval coordinate and viewing denominator are unverified; not a seconds-indexed curve or whole-video completion rate.'};
  if (name === 'Average view duration') return {unit: 'seconds' as const, definition: 'YouTube native AVD, converted from h:mm:ss; Shorts measure among engaged views and corresponding watch time, not raw Views.'};
  if (name.includes('Seconds viewed') || name === 'Duration (sec)' || name === 'Duration') return {unit: 'seconds' as const, definition: `Native ${name}; exact averaging denominator unavailable for Facebook averages. Duration is platform-reported, not proof of uploaded canonical bytes.`};
  if (name === 'Watch time (hours)') return {unit: 'hours' as const, definition: 'Native YouTube watch hours in selected export scope; not reconstructed from raw Views and AVD.'};
  if (name === 'Thumbnail click-through rate (%)') return {unit: 'percent' as const, definition: 'Native thumbnail impressions click-through percentage, not Shorts-feed stayed-to-watch or swipe-away rate.'};
  if (name === 'Estimated earnings (USD)') return {unit: 'currency' as const, definition: 'Native estimated USD earnings; no monetization inference beyond supplied cells.'};
  const counts = ['Thumbnail impressions', 'Views', 'Reach', 'Likes', 'Shares', 'Follows', 'Comments', 'Saves', '3-second video views', '1-minute video views', '3-Second viewers', '1-minute viewers', 'Reactions, Comments and Shares', 'Reactions', '1-minute video views from Recommendations', '1-minute video views from Followers'];
  if (!counts.includes(name)) throw new Error(`Unrecognized native metric column: ${name}`);
  return {unit: 'count' as const, definition: name === 'Views' && platform === 'youtube' ? 'YouTube Shorts starts/replays; no minimum watch-time requirement. Not engaged or unique views.' : name === 'Reach' ? 'Native per-post estimated reached audience; sums across posts are not unique channel reach.' : `Native ${platform} ${name} count. Export/UI attribution, uniqueness and qualifying details are not independently established; do not equate across platforms.`};
};
const dateFromMeta = (raw: string) => {
  if (!/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(raw)) throw new Error('Invalid Meta publish time');
  const [date, time] = raw.split(' ') as [string, string];
  const [m, d, y] = date.split('/') as [string, string, string];
  if (!z.iso.date().safeParse(`${y}-${m}-${d}`).success || Number(time.slice(0, 2)) > 23 || Number(time.slice(3)) > 59) throw new Error('Invalid Meta calendar/time');
  return `${y}-${m}-${d}`;
};
const dateFromYouTube = (raw: string) => {
  const match = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})$/.exec(raw);
  if (!match) throw new Error('Invalid YouTube publication date');
  const month = String(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[1]!) + 1).padStart(2, '0');
  return z.iso.date().parse(`${match[3]}-${month}-${match[2]!.padStart(2, '0')}`);
};

export const buildAnalyticsIntake = (input: unknown, root = process.cwd()) => {
  const manifest = analyticsIntakeManifestSchema.parse(input);
  const mappings = mappingsSchema.parse(readBoundRecord(manifest.mappings, root));
  readBoundFile(manifest.priorReview, root); readBoundFile(manifest.baseline, root);
  if (new Set(manifest.sources.map(s => s.id)).size !== manifest.sources.length) throw new Error('Duplicate source ID');
  const expectedSources = ['facebook-videos', 'instagram-posts', 'youtube-chart', 'youtube-table', 'youtube-totals'];
  if (JSON.stringify(manifest.sources.map(s => s.id).sort()) !== JSON.stringify(expectedSources)) throw new Error('This bounded importer requires the five reviewed export layouts');
  if (new Set(manifest.sources.map(s => s.file.path)).size !== manifest.sources.length) throw new Error('Duplicate source file');
  const records = manifest.sources.flatMap(source => {
    if (source.platform !== ({table: 'youtube', chart: 'youtube', totals: 'youtube', posts: 'instagram', videos: 'facebook'} as const)[source.layout]) throw new Error('Platform/layout mismatch');
    if (source.metricWindow !== (source.platform === 'youtube' ? 'selected-date-range' : 'lifetime')) throw new Error('Wrong metric window');
    if (source.selectedRange.endDate < source.selectedRange.startDate) throw new Error('Invalid selected date range');
    const bytes = readBoundFile(source.file, root);
    if (bytes.length !== source.bytes) throw new Error('Source byte count mismatch');
    const parsed = parseAnalyticsCsv(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
    if (JSON.stringify(parsed.header) !== JSON.stringify(source.expectedColumns) || parsed.rows.length !== source.expectedRecordCount) throw new Error('Source schema/record count drift');
    const identities = new Set<string>();
    return parsed.rows.map(row => {
      const r = row.raw;
      const kind = source.layout === 'chart' || source.layout === 'totals' ? 'daily' : r.Content === 'Total' ? 'aggregate' : 'post';
      const identity = source.platform === 'youtube' ? (r.Content?.trim() ?? null) : (r['Post ID'] ?? r['Video asset ID'])!;
      if (kind === 'post' && !identity) throw new Error('Missing native post identity');
      const unique = `${identity ?? 'channel'}:${kind === 'daily' ? r.Date : ''}`;
      if (identities.has(unique)) throw new Error('Duplicate native identity/date'); identities.add(unique);
      if (source.platform !== 'youtube' && r.Date !== 'Lifetime') throw new Error('Meta row window is not Lifetime');
      if (kind === 'daily' && (!z.iso.date().safeParse(r.Date).success || r.Date! < source.selectedRange.startDate || r.Date! > source.selectedRange.endDate)) throw new Error('Daily date outside selected range');
      const nativeMetrics = Object.entries(r).filter(([name]) => !nonMetrics.has(name)).map(([name, rawValue]) => {
        const definition = numericDefinition(name, source.platform);
        const value = name === 'Average view duration' ? avdSeconds(rawValue) : parseNativeNumber(rawValue, definition.unit === 'count');
        if (definition.unit === 'ratio' && value !== null && value > 1) throw new Error('Retention ratio exceeds observed scale');
        return {name, rawValue, value, ...definition};
      });
      const metrics = metricSnapshotSchema.shape.metrics.parse(nativeMetrics.filter(m => m.value !== null).map(m => ({
        key: m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), nativeName: m.name, value: m.value, unit: m.unit, definition: m.definition,
      })));
      const mapping = kind === 'post' ? mappings.entries.find(m => m.sourceId === source.id && m.recordNumber === row.recordNumber) : null;
      if (kind === 'post' && (!mapping || mapping.remoteId !== identity)) throw new Error('Missing/detached post mapping');
      if (mapping) {
        mapping.evidence.forEach(ref => readBoundFile(ref, root));
        if (mapping.preparedReleaseCandidate) readBoundFile(mapping.preparedReleaseCandidate, root);
        if ((mapping.status === 'exact-publication') !== Boolean(mapping.publicationId)) throw new Error('Candidate cannot assert a publication');
        if (mapping.publicationId) {
          const publication = publicationRegistry.get(mapping.publicationId);
          const shortcode = r.Permalink?.replace(/\/$/, '').split('/').at(-1);
          if (publication.platform !== source.platform || publication.remote?.postId !== (source.platform === 'instagram' ? shortcode : identity)) throw new Error('Exact publication mapping mismatch');
        }
      }
      const publicationDateWithoutTimezone = source.platform === 'youtube' ? (r['Video publish time'] ? dateFromYouTube(r['Video publish time']) : null) : dateFromMeta(r['Publish time']!);
      return {sourceId: source.id, source: source.file, platform: source.platform, kind, ...row, identity, publicationDateWithoutTimezone, captureAt: source.captureAt, metricWindow: source.metricWindow, metrics, nativeMetrics, mapping};
    });
  });
  if (mappings.entries.length !== records.filter(r => r.kind === 'post').length || new Set(mappings.entries.map(m => `${m.sourceId}:${m.recordNumber}`)).size !== mappings.entries.length) throw new Error('Extra/duplicate mapping');
  const value = (record: typeof records[number], name: string) => record.nativeMetrics.find(m => m.name === name)?.value ?? null;
  const calculations: {id: string; formula: string; inputs: {sourceId: string; recordNumber: number; field: string; value: number}[]; value: number; unit: string; limits: string}[] = [];
  const sum = (id: string, sourceId: string, field: string, unit: string) => {
    const inputs = records.filter(r => r.sourceId === sourceId && r.kind !== 'aggregate' && value(r, field) !== null).map(r => ({sourceId, recordNumber: r.recordNumber, field, value: value(r, field)!}));
    const result = inputs.reduce((n, i) => n + i.value, 0);
    calculations.push({id, formula: 'sum(inputs.value)', inputs, value: result, unit, limits: 'Same source/scope only; aggregate rows excluded. Reach is not unique channel reach. No cross-platform normalization.'});
    return result;
  };
  const yt = sum('youtube-post-views', 'youtube-table', 'Views', 'count');
  const daily = sum('youtube-channel-daily-views', 'youtube-totals', 'Views', 'count');
  const chart = sum('youtube-selected-series-daily-views', 'youtube-chart', 'Views', 'count');
  sum('youtube-post-watch-hours', 'youtube-table', 'Watch time (hours)', 'hours');
  for (const metric of ['Views', 'Reach', 'Likes', 'Shares', 'Follows', 'Comments', 'Saves']) sum(`instagram-${metric.toLowerCase()}`, 'instagram-posts', metric, 'count');
  for (const metric of ['Reach', '3-second video views', '1-minute video views', '3-Second viewers', 'Seconds viewed', 'Reactions', 'Comments', 'Shares']) sum(`facebook-${metric.toLowerCase().replaceAll(' ', '-')}`, 'facebook-videos', metric, metric === 'Seconds viewed' ? 'seconds' : 'count');
  for (const record of records.filter(r => r.kind === 'post')) {
    const field = record.platform === 'youtube' ? 'Average view duration' : 'Average Seconds viewed';
    const a = value(record, field), d = value(record, record.platform === 'youtube' ? 'Duration' : 'Duration (sec)');
    if (a !== null && d !== null && d > 0) calculations.push({id: `${record.sourceId}.${record.recordNumber}.duration-ratio`, formula: 'inputs[0].value / inputs[1].value * 100', inputs: [{sourceId: record.sourceId, recordNumber: record.recordNumber, field, value: a}, {sourceId: record.sourceId, recordNumber: record.recordNumber, field: record.platform === 'youtube' ? 'Duration' : 'Duration (sec)', value: d}], value: a / d * 100, unit: 'percent', limits: 'Descriptive native average/duration ratio, NOT completion or whole-audience retention. Native denominators differ.'});
  }
  const aggregate = records.find(r => r.sourceId === 'youtube-table' && r.kind === 'aggregate');
  const warnings = [
    'Collection/export times and source timezones unknown; no strict MetricSnapshot or validated LearningSignal is created.',
    'Meta Lifetime rows are not fixed-window metrics. Filename range selects content; capture time remains unknown.',
    'Prepared release candidates do not establish exact uploaded variant/media or retrospective authority.',
    'Facebook interval units/denominators unverified; raw ratio cells retained without seconds-indexed interpretation.',
    'TikTok screenshots absent; no TikTok CSV/native observations in this intake.',
  ];
  if (aggregate && value(aggregate, 'Watch time (hours)') !== calculations.find(c => c.id === 'youtube-post-watch-hours')?.value) warnings.push('YouTube total Watch time (hours) differs from sum of per-video rows; preserve both, do not repair.');
  if (aggregate && (value(aggregate, 'Views') !== yt || daily !== yt)) warnings.push('YouTube per-post Views differ from native aggregate/daily total; preserve the discrepancy without imputing missing views.');
  if (chart !== yt) warnings.push('YouTube Chart contains selected series only; do not add Chart and Totals or infer missing per-video daily series.');
  return {recordKind: 'validated-native-export-intake', schemaVersion: 1, intakeId: manifest.id, sources: manifest.sources, records, calculations, warnings, nativeMetricSnapshotsCreated: 0, typedLearningSignalsCreated: 0};
};

/** Append-only output: identical reruns are idempotent; changed bytes require a new batch. */
export const writeAnalyticsIntake = (manifestPath: string, root = process.cwd()) => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const result = buildAnalyticsIntake(manifest, root);
  const output = join(dirname(manifestPath), 'parsed.json');
  const bytes = JSON.stringify(result, null, 2) + '\n';
  if (existsSync(output)) {
    if (readFileSync(output, 'utf8') !== bytes) throw new Error('Refusing to overwrite analytics evidence; create a new batch');
  } else writeFileSync(output, bytes, {flag: 'wx'});
  return {path: output, sha256: createHash('sha256').update(bytes).digest('hex'), records: result.records.length};
};
