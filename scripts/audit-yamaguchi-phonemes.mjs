import console from 'node:console';
import {readFileSync,writeFileSync} from 'node:fs';
import {createLocalNarrator,modelId} from '../src/ai/providers/kokoro-local.mjs';
const narrator=await createLocalNarrator(),meta=JSON.parse(readFileSync('src/production/narration/yamaguchi-two-bombs.json','utf8')),units=[];
for(const c of meta.cues){const capture=Object.create(narrator);capture.generate_from_ids=async ids=>ids;const ids=await capture.generate(c.transcript,{voice:'af_heart',speed:1}),original=Array.from(ids.data,Number),phonemes=narrator.tokenizer.model.convert_ids_to_tokens(original.slice(1,-1)).join(''),roundtrip=Array.from(narrator.tokenizer(phonemes,{truncation:true}).input_ids.data,Number);if(JSON.stringify(original)!==JSON.stringify(roundtrip))throw new Error('Round-trip mismatch');units.push({id:c.id,text:c.transcript,phonemes,tokenRoundtrip:true,substitutions:[]});}
writeFileSync('content-intelligence/cycles/cycle-23/production-v1/phoneme-audit.json',JSON.stringify({enteredAt:new Date().toISOString(),modelId,voice:'af_heart',units,scope:'Post-generation capture using same full-text normalization and model; no new speech or substitutions. ASR misrecognizes Tsutomu Yamaguchi. Input audit and machine recognition cannot certify final audible name pronunciation; owner listening required.'},null,2)+'\n',{flag:'wx'});
console.log(units[1]);
