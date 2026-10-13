/** Exhaustive mathematical proof, not a physical experiment or random simulation. */
import {readFileSync, writeFileSync} from 'node:fs';
import {z} from 'zod';
import {mediaHash} from '../../../../../src/artifacts/media';
const base = 'content-intelligence/cycles/cycle-14/development-v1/mathematics';
const schema = z.object({dice: z.array(z.object({id: z.string(), faces: z.array(z.number().int()).length(6)})).length(4), rules: z.object({facesPerDie: z.literal(6), equallyLikelyFaces: z.literal(true), independentRolls: z.literal(true), winningCondition: z.literal('strictly-higher-number'), playersUseDistinctDice: z.literal(true)}), favoredCycleEdges: z.array(z.object({winner: z.string(), opponent: z.string()})).length(4)}).passthrough();
const config = schema.parse(JSON.parse(readFileSync(`${base}/configuration.json`, 'utf8')));
if (new Set(config.dice.map(d => d.id)).size !== 4) throw new Error('Dice IDs must be distinct');
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
const orderedComparisons = config.dice.flatMap(first => config.dice.filter(second => second.id !== first.id).map(second => {
 const outcomes = first.faces.flatMap((firstValue, firstIndex) => second.faces.map((secondValue, secondIndex) => ({firstFace: firstIndex + 1, secondFace: secondIndex + 1, firstValue, secondValue, result: firstValue > secondValue ? 'win' : firstValue < secondValue ? 'loss' : 'tie'})));
 const wins = outcomes.filter(o => o.result === 'win').length, losses = outcomes.filter(o => o.result === 'loss').length, ties = outcomes.filter(o => o.result === 'tie').length;
 if (outcomes.length !== 36 || wins + losses + ties !== 36) throw new Error('Incomplete pair coverage');
 const divisor = gcd(wins, 36);
 return {first: first.id, second: second.id, wins, losses, ties, probability: `${wins / divisor}/${36 / divisor}`, outcomes};
}));
for (const edge of config.favoredCycleEdges) {
 const row = orderedComparisons.find(r => r.first === edge.winner && r.second === edge.opponent);
 if (!row || row.wins !== 24 || row.losses !== 12 || row.ties !== 0) throw new Error('Approved two-thirds premise failed');
}
if (orderedComparisons.some(r => r.ties !== 0)) throw new Error('Tie premise failed for distinct dice');
for (const die of config.dice) if (!orderedComparisons.some(r => r.second === die.id && r.wins === 24)) throw new Error('A first choice lacks the specified counter');
const ref = (path: string) => ({path, sha256: mediaHash(path)});
const output = {passed: true, configuration: ref(`${base}/configuration.json`), implementation: ref(`${base}/enumerate.ts`), method: 'Index each of six faces separately, including repeated labels; enumerate all 36 independent face pairs for each of twelve ordered comparisons. All six unordered pairs covered; reverse directions retained.', assumptions: config.rules, orderedComparisons, observations: ['Each of the four favored cycle edges has 24 wins/36 outcomes = 2/3.', 'Orange against blue has 20 wins/36 outcomes = 5/9; yellow against green has 18/36 = 1/2.', 'No distinct-die pairing has ties. Opposite pairings do not inherit the cycle’s 2/3 probability.', 'Individual realized numbers remain ordered normally. Nontransitivity concerns pairwise win probabilities, not greater-than on actual numbers.', 'Every favorable edge still has 12 losing face pairs. No finite winning sequence or physical fairness experiment inferred.']};
const path = `${base}/enumeration.json`, bytes = JSON.stringify(output, null, 2) + '\n';
if (process.argv.includes('--verify')) {
 if (readFileSync(path, 'utf8') !== bytes) throw new Error('Stored proof changed or input/code drifted');
} else writeFileSync(path, bytes, {flag: 'wx'});
console.log(JSON.stringify({passed: true, orderedComparisons: 12, enumeratedFacePairs: 432, favoredEdges: 4, tiesForDistinctDice: 0}, null, 2));
