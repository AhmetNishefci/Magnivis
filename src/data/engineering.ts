import {factSchema, sourceSchema} from '../content/schema';

export const engineeringSources = [
  {
    id: 'burj-khalifa-fact-sheet',
    organization: 'Emaar Properties — Burj Khalifa',
    title: 'Burj Khalifa Fact Sheet',
    url: 'https://www.burjkhalifa.ae/img/fact-sheet.pdf',
    retrieved: '2026-09-26',
  },
  {
    id: 'ctg-three-gorges-overview',
    organization: 'China Three Gorges Corporation',
    title: 'Three Gorges Project Overview',
    url: 'https://tgf.ctg.com.cn/eportal/ui?pageId=720862',
    retrieved: '2026-09-26',
  },
  {
    id: 'cern-lhc-machine-experiments',
    organization: 'CERN Document Server',
    title: 'The LHC machine and experiments',
    url: 'https://cds.cern.ch/record/2773265',
    retrieved: '2026-09-26',
  },
  {
    id: 'swiss-nrla',
    organization: 'Swiss Federal Department of Foreign Affairs',
    title: 'The New Rail Link through the Alps serving Europe',
    url: 'https://www.aboutswitzerland.eda.admin.ch/en/the-new-rail-link-through-the-alps-nrla-serving-europe',
    retrieved: '2026-09-26',
  },
].map((source) => sourceSchema.parse(source));

export const engineeringFacts = [
  {
    id: 'burj-khalifa-height-m',
    claim: 'Burj Khalifa has a final architectural height of 828 metres.',
    value: 828,
    unit: 'm',
    basis: 'measured',
    sourceIds: ['burj-khalifa-fact-sheet'],
    display: '828 m',
    notes: 'The owner fact sheet states a final height of 828 metres.',
  },
  {
    id: 'three-gorges-dam-axis-length-m',
    claim: 'The Three Gorges dam axis is 2,309.5 metres long.',
    value: 2309.5,
    unit: 'm',
    basis: 'measured',
    sourceIds: ['ctg-three-gorges-overview'],
    display: '≈2.3 km',
    notes: 'The production rounds the corporation’s 2,309.5 m dam-axis value to 2.3 km.',
  },
  {
    id: 'lhc-circumference-km',
    claim: 'The Large Hadron Collider is a circular accelerator with a circumference of 26.7 kilometres.',
    value: 26.7,
    unit: 'km',
    basis: 'measured',
    sourceIds: ['cern-lhc-machine-experiments'],
    display: '26.7 km',
    notes: 'CERN describes the LHC as a 26.7 km circular accelerator.',
  },
  {
    id: 'gotthard-base-tunnel-length-km',
    claim: 'The Gotthard Base Tunnel is 57.1 kilometres long.',
    value: 57.1,
    unit: 'km',
    basis: 'measured',
    sourceIds: ['swiss-nrla'],
    display: '57.1 km',
    notes: 'The Swiss government source identifies it as the world’s longest railway tunnel.',
  },
  {
    id: 'gotthard-burj-count',
    claim: 'About 69 Burj Khalifas placed end to end equal the length of the Gotthard Base Tunnel.',
    value: 57_100 / 828,
    unit: 'count',
    basis: 'derived',
    sourceIds: ['burj-khalifa-fact-sheet', 'swiss-nrla'],
    display: '≈69',
    notes: 'Derived as 57,100 m divided by 828 m; orientation is illustrative and compares only linear dimensions.',
  },
].map((fact) => factSchema.parse(fact));

const value = (id: string) => {
  const fact = engineeringFacts.find((candidate) => candidate.id === id);
  if (!fact) throw new Error(`Missing engineering fact: ${id}`);
  return fact.value;
};

export const engineeringScale = {
  burjHeightM: value('burj-khalifa-height-m'),
  damLengthM: value('three-gorges-dam-axis-length-m'),
  lhcCircumferenceKm: value('lhc-circumference-km'),
  gotthardLengthKm: value('gotthard-base-tunnel-length-km'),
  gotthardBurjCount: value('gotthard-burj-count'),
  damInBurjs: value('three-gorges-dam-axis-length-m') / value('burj-khalifa-height-m'),
  lhcInDamLengths: value('lhc-circumference-km') * 1000 / value('three-gorges-dam-axis-length-m'),
};
