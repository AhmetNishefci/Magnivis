import {readFileSync,existsSync} from 'node:fs';
import {knowledgePackageRegistry} from '../src/knowledge/registry';
import {contentAssetRegistry} from '../src/content-assets/registry';
import {validateWoodFrogProductionPlan} from '../src/production/integrity';
import {resolveVideoTarget} from './video-targets';
import {presentationProfileSchema,presentationQaSchema} from '../src/platform-variants/presentation';
import {z} from 'zod';
const guide=readFileSync('AGENTS.md','utf8');
const links=[...guide.matchAll(/`((?:docs|recovery-audit)\/[^`]+\.md)`/g)].map(match=>match[1]!);
for(const link of links)if(!existsSync(link))throw new Error(`Broken agent route: ${link}`);
const documents=['BRAND','STRATEGY','CONTENT-BIBLE','CONTENT-INTELLIGENCE','RESEARCH-STANDARDS','KNOWLEDGE-PACKAGES','CONTENT-ASSETS','PRODUCTION-PLANS','CAPTIONS','VIDEO-SYSTEM','PLATFORM-VARIANTS','PLATFORM-QA','DELIVERY-PACKAGES','OPERATIONS','PERFORMANCE','ROADMAP','PROJECT-STATE','DECISIONS','ASSET-LICENSES','ARTIFACT-STORAGE','LONGFORM-001-BRIEF','RECOVERY-CLOSE-CANDIDATE'];
for(const name of documents)if(!existsSync(`docs/${name}.md`))throw new Error(`Canonical authority missing: ${name}`);
const ids=['earth-to-stars','ocean-depth','billion-dollars','speed-of-light','human-engineering','wood-frog'];
for(const id of ids){const target=resolveVideoTarget(id);for(const cue of target.spec.audio.narrationCues)if(!existsSync(`public/${cue.file}`))throw new Error(`Missing exact narration: ${id}/${cue.id}`);}
const plan=validateWoodFrogProductionPlan();
const profiles=z.array(presentationProfileSchema).parse(JSON.parse(readFileSync('artifacts/presentation-profiles.json','utf8')));
z.array(presentationQaSchema).parse(JSON.parse(readFileSync('artifacts/presentation-qa.json','utf8')));
for(const surface of ['instagram-profile-grid','facebook-page-feed'])if(profiles.find(p=>p.surface===surface)?.insets!==null)throw new Error(`Lost Meta geometry unexpectedly activated: ${surface}`);
console.log(JSON.stringify({passed:true,documents:documents.length,agentRoutes:links.length,historicalContent:ids,knowledgePackages:knowledgePackageRegistry.list().map(p=>p.id),contentAssets:contentAssetRegistry.list().map(a=>a.id),productionPlan:plan.id,metaGeometry:'unmeasured',humanApprovalGranted:false},null,2));
