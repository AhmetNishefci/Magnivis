import console from 'node:console';
import {mkdirSync} from 'node:fs';
import {KokoroTTS} from 'kokoro-js';

const modelId = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const voice = 'af_heart';
const outputDirectory = 'public/audio/narration';

const cues = [
  {
    id: 'hook',
    text: 'Earth is huge. Twelve thousand, seven hundred and forty-two kilometers across.',
  },
  {
    id: 'jupiter',
    text: 'But Jupiter is nearly eleven Earths wide.',
  },
  {
    id: 'sun',
    text: 'Our Sun is almost ten Jupiters across.',
  },
  {
    id: 'rigel',
    text: "RYE-juhl is about fifty times the Sun's radius.",
  },
  {
    id: 'betelgeuse',
    text: "And Betelgeuse? An estimated seven hundred and twenty-four times the Sun's radius.",
  },
  {
    id: 'coda',
    text: "And that's just one star.",
  },
];

mkdirSync(outputDirectory, {recursive: true});

console.log(`Loading ${modelId} locally with voice ${voice}...`);
const tts = await KokoroTTS.from_pretrained(modelId, {
  dtype: 'q8',
  device: 'cpu',
  progress_callback: (download) => {
    if (download.status === 'progress' && typeof download.progress === 'number') {
      const percentage = Math.round(download.progress);
      if (percentage % 20 === 0) console.log(`Model download: ${percentage}%`);
    }
  },
});

for (const cue of cues) {
  const audio = await tts.generate(cue.text, {voice, speed: 0.92});
  const path = `${outputDirectory}/${cue.id}.wav`;
  audio.save(path);
  const duration = audio.audio.length / audio.sampling_rate;
  console.log(`${cue.id}: ${duration.toFixed(2)}s -> ${path}`);
}
