import {readFileSync, realpathSync, statSync} from 'node:fs';
import {relative, resolve, isAbsolute, sep} from 'node:path';
import {recordReferenceSchema,ownerDecisionSchema,type RecordReference,type OwnerDecision} from './evidence-schema';
export {digest,text,recordReferenceSchema,ownerDecisionSchema,type RecordReference,type OwnerDecision} from './evidence-schema';
import {mediaHash} from '../artifacts/media';
import {sha256Json} from '../content-intelligence/run-schema';

export const readBoundFile = (input: RecordReference, root = process.cwd()): Buffer => {
  const ref = recordReferenceSchema.parse(input);
  const path = realpathSync(resolve(root, ref.path));
  const rel = relative(realpathSync(root), path);
  if (isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`) || !statSync(path).isFile()) throw new Error('Evidence path escapes repository');
  if (mediaHash(path) !== ref.sha256) throw new Error('Evidence file digest mismatch');
  return readFileSync(path);
};
export const readBoundRecord = (input: RecordReference, root = process.cwd()): unknown => JSON.parse(readBoundFile(input,root).toString('utf8'));
export const requireOwnerDecision = (ref: RecordReference, cycleId: string, gate: OwnerDecision['gate'], target: unknown, root = process.cwd()) => {
  const decision = ownerDecisionSchema.parse(readBoundRecord(ref, root));
  if (decision.cycleId !== cycleId || decision.gate !== gate || decision.targetSha256 !== sha256Json(target)) throw new Error('Owner decision is detached from the exact review target');
  if(gate==='exception'){const scope=(target as {target?:RecordReference}).target;if(!scope||!decision.scope||sha256Json(scope)!==sha256Json(decision.scope))throw new Error('Exceptional approval must identify its exact scoped artifact');}
  return decision;
};
