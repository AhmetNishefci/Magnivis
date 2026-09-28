import approvedSnapshot from '../../../content-intelligence/reviews/wood-frog-freeze-v1/knowledge-package.approved.json';
import {knowledgePackageSchema} from '../schema';

export const woodFrogApprovedKnowledgePackage = knowledgePackageSchema.parse(approvedSnapshot);
