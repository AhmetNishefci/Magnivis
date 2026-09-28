import {woodFrogApprovedContentAsset} from '../../content-assets/assets/wood-frog-approved';
import {safeAreaProfileIds} from '../../design/safe-areas';
import {woodFrogNarrationCues} from '../../production/narration/wood-frog';
import {createCaptionPlan, type NarrationCaptionDirection} from '../plan';

const middleLower = 'middle-lower' as const;
const lowerSafe = 'lower-safe' as const;

const directions = [
  {
    narrationCueId: 'hook',
    chunks: [
      {
        lines: ['A wood frog can survive', 'a freeze'],
        emphasis: [{text: 'survive', level: 'concept', tone: 'ice'}],
        placement: middleLower,
        animation: 'fade-slide',
        presentationIntent: 'Establish the animal and survivable event without competing with the headline.',
      },
      {
        lines: ['that stops its heartbeat—then'],
        emphasis: [{text: 'stops its heartbeat', level: 'strong', tone: 'gold'}],
        placement: middleLower,
        animation: 'focus-highlight',
        presentationIntent: 'Land the counterintuitive cardiac fact as the strongest hook phrase.',
      },
      {
        lines: ['thaw and recover.'],
        emphasis: [{text: 'thaw and recover', level: 'strong', tone: 'ice'}],
        placement: middleLower,
        animation: 'soft-scale',
        presentationIntent: 'Resolve the hook with survival rather than death or resurrection framing.',
      },
    ],
  },
  {
    narrationCueId: 'freeze',
    chunks: [
      {
        lines: ['Much of its body water', 'can turn to ice,'],
        placement: lowerSafe,
        animation: 'fade-slide',
        presentationIntent: 'Reinforce body-water freezing beneath the tissue diagram.',
      },
      {
        lines: ['mainly outside its cells.'],
        emphasis: [{text: 'outside its cells', level: 'strong', tone: 'ice'}],
        placement: lowerSafe,
        animation: 'focus-highlight',
        presentationIntent: 'Emphasize the spatial distinction central to the scene.',
      },
    ],
  },
  {
    narrationCueId: 'location',
    chunks: [
      {
        lines: ['As extracellular ice grows,'],
        emphasis: [{text: 'extracellular ice', level: 'concept', tone: 'ice'}],
        placement: lowerSafe,
        animation: 'fade-slide',
        presentationIntent: 'Name the process while the cell-level view establishes context.',
      },
      {
        lines: ['water leaves the cells.'],
        emphasis: [{text: 'water leaves the cells', level: 'strong', tone: 'ice'}],
        placement: lowerSafe,
        animation: 'focus-highlight',
        presentationIntent: 'Synchronize the central mechanism with the outward particle motion.',
      },
      {
        lines: ['That dehydration helps keep'],
        emphasis: [{text: 'dehydration', level: 'concept', tone: 'gold'}],
        placement: lowerSafe,
        animation: 'fade-slide',
        presentationIntent: 'Bridge water movement to protection without overclaiming.',
      },
      {
        lines: ['dangerous ice crystals', 'from forming inside them.'],
        emphasis: [{text: 'inside them', level: 'strong', tone: 'gold'}],
        placement: lowerSafe,
        animation: 'focus-highlight',
        presentationIntent: 'Clarify that intracellular crystals are the avoided danger.',
      },
    ],
  },
  {
    narrationCueId: 'chemistry',
    chunks: [
      {
        lines: ['Its liver rapidly releases', 'glucose,'],
        emphasis: [{text: 'glucose', level: 'strong', tone: 'gold'}],
        placement: lowerSafe,
        animation: 'focus-highlight',
        presentationIntent: 'Pair glucose emphasis with the freeze-triggered liver path.',
      },
      {
        lines: ['while urea has already built up', 'before freezing.'],
        emphasis: [
          {text: 'urea', level: 'strong', tone: 'ice'},
          {text: 'before freezing', level: 'concept', tone: 'gold'},
        ],
        placement: lowerSafe,
        animation: 'fade-slide',
        presentationIntent: 'Preserve the approved timing distinction for pre-freeze urea.',
      },
    ],
  },
  {
    narrationCueId: 'protection',
    chunks: [
      {
        lines: ['These cryoprotectants', 'limit ice formation'],
        emphasis: [{text: 'cryoprotectants', level: 'concept', tone: 'ice'}],
        placement: lowerSafe,
        animation: 'soft-scale',
        presentationIntent: 'Name the shared protective role after both defenses are visible.',
      },
      {
        lines: ['and help protect cells through', 'freezing and thawing.'],
        emphasis: [{text: 'protect cells', level: 'strong', tone: 'gold'}],
        placement: lowerSafe,
        animation: 'fade-slide',
        presentationIntent: 'Complete the mechanism without implying total prevention of injury.',
      },
    ],
  },
  {
    narrationCueId: 'payoff',
    chunks: [
      {
        lines: ['As the frog thaws,'],
        placement: middleLower,
        animation: 'fade-slide',
        presentationIntent: 'Move captions above the recovery indicators as the thaw begins.',
      },
      {
        lines: ['its heart starts beating first;'],
        emphasis: [{text: 'heart starts beating first', level: 'strong', tone: 'gold'}],
        placement: middleLower,
        animation: 'focus-highlight',
        presentationIntent: 'Reinforce the first supported recovery step.',
      },
      {
        lines: ['breathing and leg reflexes follow.'],
        emphasis: [{text: 'breathing and leg reflexes', level: 'concept', tone: 'ice'}],
        placement: middleLower,
        animation: 'fade-slide',
        presentationIntent: 'Track the remaining recovery order without adding timestamps.',
      },
      {
        lines: ['It survived by controlling', 'the freeze—not by staying unfrozen.'],
        emphasis: [
          {text: 'controlling', level: 'strong', tone: 'gold'},
          {text: 'the freeze', level: 'strong', tone: 'gold'},
          {text: 'not', level: 'strong', tone: 'ice'},
        ],
        placement: middleLower,
        animation: 'soft-scale',
        presentationIntent: 'Deliver the explanatory payoff in the composition’s warm resolution.',
      },
    ],
  },
] satisfies readonly NarrationCaptionDirection[];

export const woodFrogCaptionPlan = createCaptionPlan({
  id: 'caption-plan.wood-frog.v1',
  revision: 1,
  contentAsset: {
    id: woodFrogApprovedContentAsset.id,
    revision: woodFrogApprovedContentAsset.revision,
  },
  approvedScriptSha256: 'a2ea7e39fe6409c13b1a2102b403187f222995d52100f25b6ec9a1876cb859bb',
  safeAreaProfileId: safeAreaProfileIds.verticalShortMaster,
  fps: 30,
  narrationCues: woodFrogNarrationCues,
  directions,
  generatedAt: '2026-09-28T20:57:45.000Z',
  notes: 'Owner-requested deterministic CaptionPlan using the Magnivis short-form design system; no AI or speech recognition was used. The closing sentence remains one semantic caption unit.',
});
