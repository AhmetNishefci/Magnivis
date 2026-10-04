import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {KokoroTTS} from 'kokoro-js';

// Offline CPU speech/inspection boundary. No paid API or voice cloning.
const require = createRequire(import.meta.url);
const transformersPath = require.resolve('@huggingface/transformers', {paths: [require.resolve('kokoro-js')]});
const imported = await import(pathToFileURL(transformersPath.replace(/\.cjs$/, '.mjs')).href);
const transformers = imported.env ? imported : imported.default;
transformers.env.cacheDir = resolve('.cache/longitude-ai');
export const modelId = 'onnx-community/Kokoro-82M-v1.0-ONNX';
export const createLocalNarrator = () => KokoroTTS.from_pretrained(modelId, {dtype:'q8',device:'cpu'});
export const createLocalSpeechInspector = () => transformers.pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny.en', {dtype:'q8',device:'cpu'});

// Per-call opt-in: retain public full-context normalization and synthesize once.
export const generateWithGrenadaPronunciation = async (narrator, text, repair, options) => {
 const capture = Object.create(narrator);
 capture.generate_from_ids = async ids => ids;
 const original = await capture.generate(text, options);
 const originalIds = Array.from(original.data, Number);
 const before = narrator.tokenizer.model.convert_ids_to_tokens(originalIds.slice(1,-1)).join('');
 const roundtrip = Array.from(narrator.tokenizer(before, {truncation:true}).input_ids.data, Number);
 if (JSON.stringify(roundtrip) !== JSON.stringify(originalIds)) throw new Error('Phoneme capture failed exact token round-trip');
 const corrected = repair(text, before);
 const ids = narrator.tokenizer(corrected.phonemes, {truncation:true}).input_ids;
 const audio = await narrator.generate_from_ids(ids, options);
 return {audio, audit:{text, before, after:corrected.phonemes, occurrences:corrected.occurrences, originalIds, correctedIds:Array.from(ids.data,Number), tokenRoundtrip:true}};
};
