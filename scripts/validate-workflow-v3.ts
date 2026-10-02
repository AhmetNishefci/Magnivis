import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {z} from 'zod';
import {loadMediaRegistry} from '../src/artifacts/media';
import {recordReferenceSchema,readBoundFile} from '../src/workflow/evidence';
import {loadCycle,projectCycleOverview} from '../src/workflow/store';
const root=process.cwd();
const project=z.object({schemaVersion:z.literal(3),phase:z.enum(['engineering-review','content-cycle','idle']),cycleIndex:z.literal('workflow/cycles'),nextOwnerGate:z.string().nullable(),historicalCycles:z.array(z.object({id:z.string(),state:z.string(),evidence:recordReferenceSchema,publicationEvidence:recordReferenceSchema.optional()}).passthrough())}).passthrough().parse(JSON.parse(readFileSync(resolve(root,'workflow/project-state.json'),'utf8')));
for(const c of project.historicalCycles){readBoundFile(c.evidence,root);if(c.publicationEvidence)readBoundFile(c.publicationEvidence,root);}
const directory=resolve(root,'workflow/cycles');const registry=loadMediaRegistry(root);
const cycles=existsSync(directory)?readdirSync(directory,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>loadCycle(root,d.name,registry)):[];

const checkpoint=process.argv[2];let preserved=0;
if(checkpoint){const records=z.object({schemaVersion:z.literal(1),baselineCommit:z.string().regex(/^[a-f0-9]{40}$/),files:z.array(recordReferenceSchema)}).strict().parse(JSON.parse(readFileSync(checkpoint,'utf8')));records.files.forEach(r=>readBoundFile(r,root));preserved=records.files.length;}
console.log(JSON.stringify({passed:true,historicalEvidenceReferences:project.historicalCycles.length,preservedCheckpointFiles:preserved,overview:projectCycleOverview(cycles,root),registeredCycles:cycles.length,phase:project.phase,nextOwnerGate:project.nextOwnerGate},null,2));
