import type {NarrationCaptionInput} from './derive';
import {assertCaptionRegionIsSafe, magnivisCaptionDesignSystem} from './design-system';
import {
  captionPlanSchema,
  type CaptionAnimation,
  type CaptionPlan,
  type CaptionPlacement,
} from './schema';

export type CaptionChunkDirection = {
  lines: [string] | [string, string];
  emphasis?: Array<{
    text: string;
    level: 'concept' | 'strong';
    tone: 'ice' | 'gold';
  }>;
  placement: CaptionPlacement;
  animation: CaptionAnimation;
  presentationIntent: string;
};

export type NarrationCaptionDirection = {
  narrationCueId: string;
  chunks: CaptionChunkDirection[];
};

const wordCount = (text: string) => text.trim().split(/\s+/).length;

export const createCaptionPlan = ({
  id,
  revision,
  contentAsset,
  approvedScriptSha256,
  safeAreaProfileId,
  fps,
  narrationCues,
  directions,
  generatedAt,
  notes,
}: {
  id: string;
  revision: number;
  contentAsset: {id: string; revision: number};
  approvedScriptSha256: string;
  safeAreaProfileId: string;
  fps: number;
  narrationCues: readonly NarrationCaptionInput[];
  directions: readonly NarrationCaptionDirection[];
  generatedAt: string;
  notes: string;
}): CaptionPlan => {
  const directionByNarrationId = new Map(directions.map((direction) => [
    direction.narrationCueId,
    direction,
  ]));
  if (directionByNarrationId.size !== directions.length) {
    throw new Error('Caption direction contains duplicate narration cue IDs');
  }

  const cues = narrationCues.flatMap((narration, narrationIndex) => {
    const direction = directionByNarrationId.get(narration.id);
    if (!direction) throw new Error(`Missing caption direction for narration cue: ${narration.id}`);
    const nextStart = narrationCues[narrationIndex + 1]?.start;
    const naturalEnd = narration.duration
      ? narration.start + narration.duration
      : nextStart;
    const endSeconds = Math.min(
      naturalEnd ?? Number.POSITIVE_INFINITY,
      nextStart ?? Number.POSITIVE_INFINITY,
    );
    if (!Number.isFinite(endSeconds) || endSeconds <= narration.start) {
      throw new Error(`Invalid narration timing for caption plan: ${narration.id}`);
    }
    const reconstructed = direction.chunks
      .map(({lines}) => lines.join(' '))
      .join(' ');
    if (reconstructed !== narration.transcript) {
      throw new Error(`Caption direction changed approved narration: ${narration.id}`);
    }
    const startFrame = Math.round(narration.start * fps);
    const endFrame = Math.round(endSeconds * fps);
    const totalWords = direction.chunks.reduce(
      (sum, chunk) => sum + wordCount(chunk.lines.join(' ')),
      0,
    );
    let consumedWords = 0;
    return direction.chunks.map((chunk, chunkIndex) => {
      const chunkStart = startFrame + Math.round(
        (endFrame - startFrame) * consumedWords / totalWords,
      );
      consumedWords += wordCount(chunk.lines.join(' '));
      const chunkEnd = chunkIndex === direction.chunks.length - 1
        ? endFrame
        : startFrame + Math.round((endFrame - startFrame) * consumedWords / totalWords);
      assertCaptionRegionIsSafe(chunk.placement, safeAreaProfileId);
      return {
        id: `${id}.${narration.id}-${chunkIndex + 1}`,
        sourceNarrationCueId: narration.id,
        startFrame: chunkStart,
        endFrame: chunkEnd,
        lines: [...chunk.lines],
        emphasis: chunk.emphasis ?? [],
        placement: chunk.placement,
        animation: chunk.animation,
        presentationIntent: chunk.presentationIntent,
      };
    });
  });

  if (directionByNarrationId.size !== narrationCues.length) {
    throw new Error('Caption direction references unknown narration cues');
  }

  return captionPlanSchema.parse({
    schemaVersion: 1,
    id,
    revision,
    status: 'review-required',
    contentAsset,
    approvedScriptSha256,
    designSystem: {
      id: magnivisCaptionDesignSystem.id,
      revision: magnivisCaptionDesignSystem.revision,
    },
    safeAreaProfileId,
    fps,
    coverage: 'complete-narration',
    cues,
    provenance: {
      method: 'manual-editorial',
      generatedAt,
      notes,
    },
  });
};

export const validateCaptionPlanAgainstNarration = (
  input: unknown,
  narrationCues: readonly NarrationCaptionInput[],
  safeAreaProfileId: string,
) => {
  const plan = captionPlanSchema.parse(input);
  const planByNarrationId = new Map<string, typeof plan.cues>();
  for (const cue of plan.cues) {
    assertCaptionRegionIsSafe(cue.placement, safeAreaProfileId);
    const group = planByNarrationId.get(cue.sourceNarrationCueId) ?? [];
    group.push(cue);
    planByNarrationId.set(cue.sourceNarrationCueId, group);
  }
  for (const [index, narration] of narrationCues.entries()) {
    const planned = planByNarrationId.get(narration.id);
    if (!planned?.length) throw new Error(`CaptionPlan does not cover narration cue: ${narration.id}`);
    const nextStart = narrationCues[index + 1]?.start;
    const naturalEnd = narration.duration ? narration.start + narration.duration : nextStart;
    const narrationStartFrame = Math.round(narration.start * plan.fps);
    const narrationEndFrame = Math.round(Math.min(
      naturalEnd ?? Number.POSITIVE_INFINITY,
      nextStart ?? Number.POSITIVE_INFINITY,
    ) * plan.fps);
    if (
      planned[0]?.startFrame !== narrationStartFrame
      || planned.at(-1)?.endFrame !== narrationEndFrame
    ) {
      throw new Error(`CaptionPlan timing does not fully cover narration cue: ${narration.id}`);
    }
    const reconstructed = planned.map(({lines}) => lines.join(' ')).join(' ');
    if (reconstructed !== narration.transcript) {
      throw new Error(`CaptionPlan does not preserve approved narration: ${narration.id}`);
    }
  }
  if (planByNarrationId.size !== narrationCues.length) {
    throw new Error('CaptionPlan references an unknown narration cue');
  }
  return plan;
};
