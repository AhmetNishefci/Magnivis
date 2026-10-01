import {describe,it,expect} from 'vitest';
import {phantomTrafficPublicationRecords as records,phantomTrafficLivePresentation as qa,liveOwnerPresentationSchema} from '../src/operations/phantom-traffic';
import {publicationRecordSchema} from '../src/operations/schema';
import {publicationRegistry,metricSnapshotRegistry} from '../src/operations/registry';
import {validatePhantomTrafficLockedMaster} from '../src/production/phantom-traffic-master-integrity';
describe('Phantom Traffic publication evidence and operational closure',()=>{
 it('registers all four owner-reported publications with source/delivery/authorization bindings',()=>{
  expect(records).toHaveLength(4);for(const r of records){expect(publicationRegistry.get(r.id)).toEqual(r);expect(r.state).toBe('published-owner-reported');expect(r.publishedOn).toBe('2026-10-01');expect(r.ownerReport?.publishedAt).toBeNull();expect(r.source.platformVariant.revision).toBe(3);expect(r.source.delivery.manifestSha256).toMatch(/^[a-f0-9]{64}$/);}
 });
 it('retains TikTok Studio only as management evidence without a made-up public ID',()=>{
  const t=records.find(r=>r.platform==='tiktok')!;expect(t.remote).toBeUndefined();expect(t.ownerReport?.managementUrl).toBe('https://www.tiktok.com/tiktokstudio/content');expect(t.ownerReport?.missingPublicPermalink).toBe(true);
  expect(publicationRecordSchema.safeParse({...t,remote:{postId:'invented',url:t.ownerReport!.managementUrl},ownerReport:{...t.ownerReport!,missingPublicPermalink:false}}).success).toBe(false);
 });
 it('requires explicit owner evidence and final delivery identity rather than weakening ordinary published state',()=>{
  const t=records.find(r=>r.platform==='tiktok')!;expect(publicationRecordSchema.safeParse({...t,ownerReport:undefined}).success).toBe(false);expect(publicationRecordSchema.safeParse({...t,state:'published',ownerReport:undefined}).success).toBe(false);
 });
 it('preserves supplied public IDs and dates without asserting native upload settings',()=>{
  expect(records.find(r=>r.platform==='youtube')?.remote?.postId).toBe('3jmxLXcowC8');expect(records.find(r=>r.platform==='instagram')?.remote?.postId).toBe('Dd89-PvFDqn');expect(records.find(r=>r.platform==='facebook')?.remote?.postId).toBe('2300822597344788');
  for(const r of records)expect(r.settings.reuse).toBe('unknown');
 });
 it('records planned comments as owner-reported posted without IDs, time, pinning or metrics',()=>{
  for(const r of records){expect(r.firstComment?.state).toBe('owner-reported-posted');expect(r.firstComment?.commentId).toBeNull();expect(r.firstComment?.pinState).toBe('unknown');expect(metricSnapshotRegistry.listByPublication(r.id)).toEqual([]);}
 });
 it('records desktop/mobile approval at owner platform scope without inventing individually tested surfaces or measurements',()=>{
  expect(qa).toHaveLength(4);for(const r of qa){expect(r.contexts).toEqual(['desktop/web where applicable','mobile where applicable']);expect(r.individuallyNamedSurfaces).toEqual([]);expect(r.screenshots).toEqual([]);expect(liveOwnerPresentationSchema.safeParse({...r,device:'Invented device'}).success).toBe(false);}
  expect(validatePhantomTrafficLockedMaster().artifact.sha256).toBe('bdf22d48b4fe1b873fd659a487954c09c1573dd5466795656128c08d03208d4b');
 });
});
