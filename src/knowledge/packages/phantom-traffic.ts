import snapshot from '../../../content-intelligence/reviews/phantom-traffic-approved-v3/knowledge-package.approved.json';
import {knowledgePackageSchema} from '../schema';

// Exact owner-approved editorial state; master visual approval remains pending.
export const phantomTrafficKnowledgePackage = knowledgePackageSchema.parse(snapshot);
