import snapshot from '../../../content-intelligence/reviews/millennium-bridge-reconstruction-v1/knowledge-package.approved.json';
import {knowledgePackageSchema} from '../schema';

export const millenniumBridgeApprovedKnowledgePackage = knowledgePackageSchema.parse(snapshot);
