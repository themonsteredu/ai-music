// 목업 provider용 샘플 로고송(WAV) 생성기.
// 짧고 밝은 멜로디 몇 음을 16-bit PCM WAV로 만든다. (외부 의존성 없음)
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const sampleRate = 44100;
const notes = [
  // [주파수(Hz), 길이(초)] — 도미솔도 상행 후 마무리
  [523.25, 0.22], // C5
  [659.25, 0.22], // E5
  [783.99, 0.22], // G5
  [1046.5, 0.34], // C6
  [783.99, 0.18], // G5
  [1046.5, 0.5], // C6 (끝음)
];

const total = notes.reduce((s, [, d]) => s + d, 0);
const samples = Math.floor(sampleRate * total);
const buffer = Buffer.alloc(44 + samples * 2);

// WAV 헤더
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + samples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(1, 22); // mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(samples * 2, 40);

let idx = 0;
for (const [freq, dur] of notes) {
  const n = Math.floor(sampleRate * dur);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    // 부드러운 감쇠 엔벨로프
    const env = Math.min(1, (n - i) / (sampleRate * 0.06)) * Math.min(1, i / (sampleRate * 0.01));
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.35 * env;
    buffer.writeInt16LE(Math.max(-1, Math.min(1, sample)) * 32767, 44 + idx * 2);
    idx++;
  }
}

const outDir = path.join(process.cwd(), 'public', 'samples');
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'mock-jingle.wav');
writeFileSync(outPath, buffer);
console.log('wrote', outPath, buffer.length, 'bytes');
