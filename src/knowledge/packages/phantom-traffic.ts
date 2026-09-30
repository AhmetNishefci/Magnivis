import snapshot from '../../../content-intelligence/reviews/phantom-traffic-v1/knowledge-package.review.json';
import {knowledgePackageSchema} from '../schema';

// Evidence-inspected review snapshot. Human verification and approval remain pending.
export const phantomTrafficKnowledgePackage = knowledgePackageSchema.parse(snapshot);
