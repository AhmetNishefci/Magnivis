import type {CaptionPlan} from './schema';

export type NarrationCaptionInput = {
  id: string;
  start: number;
  duration?: number | undefined;
  transcript: string;
};

export type DerivedCaption = {
  id: string;
  start: number;
  end: number;
  text: string;
};

const wordCount = (text: string) => text.trim().split(/\s+/).length;

export const splitCaptionPhrases = (text: string, maximumCharacters = 52) => {
  const words = text.trim().split(/\s+/);
  const phrases: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const naturalBreak = /[,:;.!?]$/.test(word) && candidate.length >= 24;
    if (current && candidate.length > maximumCharacters) {
      phrases.push(current);
      current = word;
    } else {
      current = candidate;
      if (naturalBreak) {
        phrases.push(current);
        current = '';
      }
    }
  }
  if (current) phrases.push(current);
  const last = phrases.at(-1);
  if (last && phrases.length > 1 && wordCount(last) <= 2) {
    const previous = phrases.at(-2);
    if (!previous) throw new Error('Caption phrase merge failed');
    phrases.splice(-2, 2, `${previous} ${last}`);
  }
  if (phrases.join(' ') !== text.trim()) {
    throw new Error('Caption phrase grouping changed approved narration text');
  }
  return phrases;
};

export const deriveCaptionsFromNarration = (
  cues: readonly NarrationCaptionInput[],
  videoDurationSeconds: number,
) => cues.flatMap((cue, cueIndex) => {
  const nextStart = cues[cueIndex + 1]?.start;
  const naturalEnd = cue.duration ? cue.start + cue.duration : nextStart ?? videoDurationSeconds;
  const cueEnd = Math.min(naturalEnd, nextStart ?? videoDurationSeconds, videoDurationSeconds);
  if (cueEnd <= cue.start) throw new Error(`Invalid narration cue timing: ${cue.id}`);
  const phrases = splitCaptionPhrases(cue.transcript);
  const totalWords = phrases.reduce((sum, phrase) => sum + wordCount(phrase), 0);
  let cursor = cue.start;
  return phrases.map((phrase, phraseIndex) => {
    const isLast = phraseIndex === phrases.length - 1;
    const duration = (cueEnd - cue.start) * wordCount(phrase) / totalWords;
    const end = isLast ? cueEnd : cursor + duration;
    const caption = {
      id: `${cue.id}-${phraseIndex + 1}`,
      start: cursor,
      end,
      text: phrase,
    };
    cursor = end;
    return caption;
  });
});

const timestamp = (seconds: number) => {
  const milliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const remainingSeconds = Math.floor((milliseconds % 60_000) / 1000);
  const remainingMilliseconds = milliseconds % 1000;
  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':') + `.${String(remainingMilliseconds).padStart(3, '0')}`;
};

export const captionsToWebVtt = (captions: readonly DerivedCaption[]) => [
  'WEBVTT',
  '',
  ...captions.flatMap((caption) => [
    caption.id,
    `${timestamp(caption.start)} --> ${timestamp(caption.end)} line:78% position:50% align:center`,
    caption.text,
    '',
  ]),
].join('\n');

export const captionPlanToDerivedCaptions = (plan: CaptionPlan): DerivedCaption[] => (
  plan.cues.map((cue) => ({
    id: cue.id,
    start: cue.startFrame / plan.fps,
    end: cue.endFrame / plan.fps,
    text: cue.lines.join(' '),
  }))
);
