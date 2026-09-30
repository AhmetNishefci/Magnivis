import {resolve} from 'node:path';
import {explorationBDirectory, validateExplorationB, writeExplorationB} from '../src/design-exploration/millennium-bridge-b/review';
import {validateExplorationBInspection} from '../src/design-exploration/millennium-bridge-b/inspection';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
if (args[0] !== 'generate' && args[0] !== 'validate') throw new Error('Usage: pnpm design:bridge:b <generate|validate> [directory]');
const directory = resolve(args[1] ?? explorationBDirectory);
if (args[0] === 'generate') await writeExplorationB(directory);
const manifest = await validateExplorationB(directory);
if (args[0] === 'validate') validateExplorationBInspection(directory);
console.log(`${manifest.status}: ${directory}; five static design frames, no video`);
