import {readFileSync} from 'node:fs';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {validateCreativeDirection} from '../src/content-assets/creative-direction-integrity';
const [directionPath, packagePath, assetPath]=process.argv.slice(2);
if (!directionPath || !packagePath || !assetPath) throw new Error('Provide direction.json approved-package.json approved-asset.json');
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const direction=validateCreativeDirection(read(directionPath),knowledgePackageSchema.parse(read(packagePath)),contentAssetSchema.parse(read(assetPath)));
console.log(JSON.stringify({passed:true,id:direction.id,state:direction.state,platformApprovalGranted:false,publicationApprovalGranted:false},null,2));
