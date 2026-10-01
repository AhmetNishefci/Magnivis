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
