import {createHash} from 'node:crypto';
import {z} from 'zod';
import {stableKnowledgeIdSchema} from '../knowledge/schema';

export const sourceRetrievalRequestSchema = z.object({
  sourceId: stableKnowledgeIdSchema.refine((id) => id.startsWith('source.')),
  url: z.url(),
}).strict();

export const retrievedSourceDocumentSchema = z.object({
  sourceId: stableKnowledgeIdSchema,
  url: z.url(),
  retrievedAt: z.iso.datetime(),
  statusCode: z.number().int().min(200).max(299),
  contentType: z.string().min(1),
  title: z.string().min(1).optional(),
  contentSha256: z.string().regex(/^[a-f0-9]{64}$/),
  normalizedText: z.string().min(1),
  truncated: z.boolean(),
}).strict();

export type SourceRetrievalRequest = z.infer<typeof sourceRetrievalRequestSchema>;
export type RetrievedSourceDocument = z.infer<typeof retrievedSourceDocumentSchema>;

export interface SourceRetriever {
  retrieve(request: SourceRetrievalRequest): Promise<RetrievedSourceDocument>;
}

const normalizeHtml = (html: string) => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/\s+/g, ' ')
  .trim();

const htmlTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? normalizeHtml(match[1]) : undefined;
};

export class HttpSourceRetriever implements SourceRetriever {
  constructor(
    private readonly fetchImplementation: typeof fetch = fetch,
    private readonly now: () => Date = () => new Date(),
    private readonly maximumCharacters = 250_000,
  ) {}

  async retrieve(input: SourceRetrievalRequest): Promise<RetrievedSourceDocument> {
    const request = sourceRetrievalRequestSchema.parse(input);
    const url = new URL(request.url);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`Unsupported source protocol: ${url.protocol}`);
    }
    const response = await this.fetchImplementation(url, {
      headers: {'user-agent': 'MagnivisResearch/1.0'},
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Source retrieval failed with HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      throw new Error(`Unsupported source content type: ${contentType}`);
    }
    const raw = await response.text();
    const truncated = raw.length > this.maximumCharacters;
    const bounded = raw.slice(0, this.maximumCharacters);
    const normalizedText = contentType.includes('text/html')
      ? normalizeHtml(bounded)
      : bounded.replace(/\s+/g, ' ').trim();
    return retrievedSourceDocumentSchema.parse({
      sourceId: request.sourceId,
      url: request.url,
      retrievedAt: this.now().toISOString(),
      statusCode: response.status,
      contentType,
      ...(contentType.includes('text/html') && htmlTitle(bounded)
        ? {title: htmlTitle(bounded)}
        : {}),
      contentSha256: createHash('sha256').update(raw).digest('hex'),
      normalizedText,
      truncated,
    });
  }
}
