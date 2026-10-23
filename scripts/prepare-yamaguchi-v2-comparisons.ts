import {mkdirSync,writeFileSync} from 'node:fs';
import {renderMatchedComparison} from './lib/decoded-comparison';
const base='qa/yamaguchi-two-bombs-v2';mkdirSync(base,{recursive:true});
const sets={opening:[36,108,210],hiroshima:[380,503,560],journey:[630,720,800],nagasaki:[870,960,1029,1090],aftermath:[1210,1355],ending:[1530,1640,1740,1850]};
const comparisons=Object.entries(sets).map(([name,frames])=>({name,...renderMatchedComparison({before:'artifacts/masters/yamaguchi-two-bombs-cycle23-candidate-v1.mp4',after:'artifacts/masters/yamaguchi-two-bombs-cycle23-candidate-v2.mp4',frames,fps:30,output:`${base}/comparison-${name}.jpg`,width:360})}));
writeFileSync(`${base}/comparison-bindings.json`,JSON.stringify({checkedAt:new Date().toISOString(),comparisons,scope:'Timestamp-matched decoded masters, V1 left/V2 right. Sampled editorial evidence; no continuous AV/native-device claim.'},null,2)+'\n',{flag:'wx'});
