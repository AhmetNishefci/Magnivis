import snapshot from '../../../content-intelligence/reviews/phantom-traffic-finalization-v2/knowledge-package.review.json';
import {knowledgePackageSchema} from '../schema';

// Six narration claims are owner-verified; final editorial package approval remains pending.
export const phantomTrafficKnowledgePackage = knowledgePackageSchema.parse(snapshot);
