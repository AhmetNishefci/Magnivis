import {resolve} from 'node:path';
import {bridgeDesignReviewDirectory, validateBridgeDesignReview, writeBridgeDesignReview} from '../src/design-exploration/millennium-bridge/review';
import {validateBridgeDesignInspection} from '../src/design-exploration/millennium-bridge/inspection';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const stage = args[0];
if (stage !== 'generate' && stage !== 'validate') throw new Error('Usage: pnpm design:bridge <generate|validate> [directory]');
const directory = resolve(args[1] ?? bridgeDesignReviewDirectory);
if (stage === 'generate') await writeBridgeDesignReview(directory);
const manifest = await validateBridgeDesignReview(directory);
if (stage === 'validate') validateBridgeDesignInspection(directory);
console.log(`${manifest.status}: ${directory}; five design PNGs only, no full video`);
