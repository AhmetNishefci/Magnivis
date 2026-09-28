import type {CaptionCue} from './schema';

export type CaptionEmphasis = CaptionCue['emphasis'][number];

export type StyledCaptionSegment = {
  text: string;
  emphasis?: CaptionEmphasis;
};

export const captionSegmentWhitespaceStyle = Object.freeze({
  whiteSpace: 'pre' as const,
});

export const segmentStyledCaptionLine = (
  source: string,
  emphasis: readonly CaptionEmphasis[],
): StyledCaptionSegment[] => {
  const matches = emphasis
    .map((value) => ({value, index: source.indexOf(value.text)}))
    .filter(({index}) => index >= 0)
    .sort((left, right) => left.index - right.index);
  const segments: StyledCaptionSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index < cursor) {
      throw new Error(`Overlapping caption emphasis in: ${source}`);
    }
    if (match.index > cursor) {
      segments.push({text: source.slice(cursor, match.index)});
    }
    segments.push({text: match.value.text, emphasis: match.value});
    cursor = match.index + match.value.text.length;
  }

  if (cursor < source.length) segments.push({text: source.slice(cursor)});
  if (segments.length === 0) segments.push({text: source});

  const reconstructed = segments.map(({text}) => text).join('');
  if (reconstructed !== source) {
    throw new Error('Styled caption segmentation changed source text');
  }
  return segments;
};
