import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {knowledgePackageSchema} from '../src/knowledge/schema';
import {contentAssetSchema} from '../src/content-assets/schema';
import {verifyInternalEditorial} from '../src/workflow/editorial';
import {sha256Json} from '../src/content-intelligence/run-schema';
import {loadMediaRegistry, mediaHash} from '../src/artifacts/media';
import {loadCycle, persistCycleEvent} from '../src/workflow/store';
import data from '../content-intelligence/cycles/cycle-9/authoring-data.json';

const base = 'content-intelligence/cycles/cycle-9';
const now = new Date().toISOString();
const id = 'two-goals', aid = `${id}.asset.qualification`;
const cid = (key: string) => `${id}.claim.${key}`;
const ref = (path: string) => ({path, sha256: mediaHash(path)});
const put = (name: string, value: unknown) => {
  const path = `${base}/${name}.json`;
  if (existsSync(path)) throw new Error(`Preserve existing ${path}`);
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n', {flag: 'wx'});
  return ref(path);
};
const sourceBodies = data.sources.map(s => {
  const path = `${base}/research/${s.file}`;
  const body = JSON.parse(readFileSync(path, 'utf8')) as {sourceId:string;url:string;retrievedAt:string;accessStatus:'partially-inspected';locator:string};
  if (body.sourceId !== `source.two-goals.${s.key}`) throw new Error('Source identity drift');
  return {...s, ...body, inspectedEvidence:ref(path)};
});
const claims = data.definitions.map(d => ({id:cid(d[0] as string), type:'qualitative' as const,
  statement:d[1] as string, verificationStatus:d[4] === 'verify' ? 'supported' as const : 'unverified' as const,
  caveats:[d[3] as string], evidence:(d[2] as string[]).map(key => {
    const s=sourceBodies.find(s=>s.key===key);if(!s)throw new Error('Unknown evidence source');
    return {sourceId:s.sourceId, locator:s.locator, notes:d[3] as string};
  })}));
const selected=claims.filter(c=>c.verificationStatus==='supported').map(c=>c.id);
const pkg=knowledgePackageSchema.parse({id,revision:1,topic:'Barbados–Grenada qualification and reversed incentives',
  centralQuestion:'Why did a football team deliberately score an own goal—then defend both goals—to qualify?',
  taxonomy:{pillar:'history-stories',domains:['sports-history','incentive-design'],topics:['qualification','deliberate-own-goal']},timeliness:'evergreen',
  thesis:'The specific qualifying margin and double-weighted extra-time winner made an intentional equalizer useful, then gave Grenada two possible scoring targets.',
  viewerPayoff:'Reconstruct why these apparently irrational decisions served the actual qualification objective.',
  sources:sourceBodies.map(s=>({id:s.sourceId,organization:s.organization,title:s.title,sourceType:s.type,url:s.url,retrieved:s.retrievedAt.slice(0,10),notes:s.quality+' '+s.limits.join(' ')})),claims,
  caveats:[{id:`${id}.caveat.reconstruction`,statement:'Contemporary reporting and specialist results support the core reconstruction; no official1994rulebook or complete film inspected. Exact date, scorer of earlier2–1, positions, quotes and sanctions are omitted. Illustrative colors and positions are not historical kit or movement evidence.',claimIds:selected}],
  hooks:[{id:`${id}.hook.own-goal`,archetype:'irrational-decision',text:data.lines[0]![0],viewerPromise:'Explain both successive tactical reversals within this event.',claimIds:[cid('own-goal'),cid('both-goals')]},{id:`${id}.hook.opponent-net`,archetype:'changed-objective',text:"Why protect your opponent's goal?",viewerPromise:'Understand the normal-time counterstrategy after the deliberate equalizer.',claimIds:[cid('both-goals'),cid('either-net')]}],
  narrativeOpportunities:[{id:`${id}.narrative.match`,title:'The match with two defensive goals',description:'Event-specific decisions, hidden qualification constraint, rule, counterstrategy and outcome.',claimIds:selected}],
  visualOpportunities:[{id:`${id}.visual.pitch`,title:'Follow the changing target',description:'Original pitch reconstruction follows the ball, then expands to reveal both goals and opposing qualification objectives.',claimIds:selected}],relatedQuestions:[],followUpOpportunities:[],editorialStatus:'review'});
const asset=contentAssetSchema.parse({id:aid,revision:1,knowledgePackageId:id,assetType:'short-form-video',editorialPurpose:pkg.viewerPayoff,
  storyAngle:'Apparently irrational decisions become rational through the actual match constraints.',hookId:pkg.hooks[0]!.id,selectedClaimIds:selected,
  durationIntentSeconds:{minimum:60,maximum:125},script:{language:'en',segments:data.lines.map((l,i)=>({id:`${aid}.script.${i+1}`,type:'factual',text:l[0],claimIds:(l[1] as string[]).map(cid)}))},
  narrativeStructure:data.lines.map((_,i)=>({id:`${aid}.beat.${i+1}`,label:`decision-${i+1}`,purpose:data.objectives[i],scriptSegmentIds:[`${aid}.script.${i+1}`]})),
  visualPlan:data.lines.map((l,i)=>({id:`${aid}.visual.${i+1}`,narrativeBeatId:`${aid}.beat.${i+1}`,objective:data.objectives[i],visualType:'bespoke',suggestedPrimitive:'bespoke',scriptSegmentIds:[`${aid}.script.${i+1}`],claimIds:(l[1] as string[]).map(cid),notes:'Original illustrated reconstruction, not match footage. Schematic player positions/colors; no exact historical formation. Earlier2–1 is a scoreboard change only, not a claim about its scorer. Extra-time score display distinguishes weighted margin from physical goal events.'})),
  narrationPlan:{mode:'narrated',voiceDirection:'Established af_heart, connected curious storytelling and increasingly clear decisions; no football commentator imitation.',pronunciationNotes:['Barbados: bar-BAY-dohs. Grenada: grih-NAY-duh. Two-one and two-two are score readings.']},editorialStatus:'editorial-review'});
const review={schemaVersion:3,cycleId:'cycle.9',topicCandidateId:'two-goals',enteredAt:now,reviewer:'Codex session internal evidence review; not owner approval',
  premiseAlignment:{selectionSha256:sha256Json(JSON.parse(readFileSync(`${base}/topic-selection.json`,'utf8'))),preservesPublishingOpportunity:true,rationale:'New contemporary report strengthens central own-goal/both-goal account. Excluding disputed peripheral scorer/date/positions leaves the approved rule-and-qualification publishing opportunity intact.'},
  packageSha256:sha256Json(pkg),assetSha256:sha256Json(asset),scriptSha256:sha256Json(asset.script),
  inspections:sourceBodies.map(s=>({sourceId:s.sourceId,accessStatus:s.accessStatus,identityConfirmed:true,evidenceLocations:[s.locator],supportsClaimIds:claims.filter(c=>c.verificationStatus==='supported'&&c.evidence.some(e=>e.sourceId===s.sourceId)).map(c=>c.id),limitations:s.limits,inspectedEvidence:s.inspectedEvidence,sourceQualityRationale:s.quality})),
  claims:claims.map(c=>({id:c.id,statementSha256:sha256Json(c.statement),disposition:c.verificationStatus==='supported'?'verify':'exclude',rationale:c.caveats[0],evidence:c.verificationStatus==='supported'?c.evidence.map(e=>({sourceId:e.sourceId,locator:e.locator,assessment:e.notes,sufficientForWording:true})):[],qualificationsPreserved:true})),
  misconceptionSafeguards:['Own goal is deliberate; the earlier2–1 scorer is not asserted.','Qualifying is distinct from winning a match or winning the tournament.','Double weighting is this historical rule, not normal golden-goal scoring or double match points.','Grenada either-net incentive is before full time.','No guaranteed optimal strategy, probability estimate, fixed player formation, quoted dialogue or current-rule claim.','Illustrations/colors are original reconstruction, not authentic match footage.'],
  comprehensionReview:'One constraint at a time: insufficient lead, alternative route, double goal, tied score, Grenada win/one-goal loss, Barbados defending both, outcome. No group table required in narration; arithmetic independently recomputed in research/qualification-arithmetic.json. Limited full-time/extra-time labels protect scope.',
  rightsReview:'Original illustrations only; Times scan consulted solely as research, no reproduction in master. Existing OFL font and Apache2.0localKokoro. No third-party match film, stadium image, logo or player likeness.',
  careAssessment:{state:'routine',rationale:'Historical strategic event without unsupported wrongdoing allegations, harmful advice or demographic attribution.'},exceptionalConditions:[]};
put('draft-package',pkg);put('draft-asset',asset);put('internal-editorial-review',review);
const ready=verifyInternalEditorial(review,pkg,asset);
put('knowledge-package.ready',ready.knowledgePackage);put('content-asset.ready',ready.contentAsset);
const record=put('editorial-receipt',{draftPackage:pkg,draftAsset:asset,review}),registry=loadMediaRegistry();
persistCycleEvent(process.cwd(),loadCycle(process.cwd(),'cycle.9',registry),{type:'complete-internal',stage:'editorial',record,at:new Date().toISOString()},registry);
console.log('Cycle9 editorial verification complete; creative stage pending.');
