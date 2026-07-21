// 배포용 파일 트리를 JSON 으로 만든다 (source only). node scripts/build-deploy.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [];

function addFile(rel) {
  const abs = path.join(root, rel);
  files.push({ file: rel, data: readFileSync(abs, 'utf8') });
}

function walk(dir) {
  for (const name of readdirSync(path.join(root, dir))) {
    const rel = path.join(dir, name);
    const st = statSync(path.join(root, rel));
    if (st.isDirectory()) walk(rel);
    else if (/\.(ts|tsx|css|mjs)$/.test(name)) files.push({ file: rel, data: readFileSync(path.join(root, rel), 'utf8') });
  }
}

// 설정/루트 파일
for (const f of [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'prisma/schema.prisma',
  'scripts/gen-sample.mjs',
]) addFile(f);

// 소스
walk('src');

// 빌드용 최소 .env (prisma generate + 런타임 /tmp DB). STORAGE_DRIVER 는 두지 않음 → 서버리스 inline
files.push({
  file: '.env',
  data: 'DATABASE_URL="file:/tmp/dev.db"\nDEFAULT_PROVIDER=mock\n',
});

const out = path.join(root, '..', 'deploy-tree.json');
writeFileSync(out, JSON.stringify(files, null, 0));
console.log('files:', files.length);
console.log('paths:', files.map((f) => f.file).join('\n'));
console.log('bytes:', JSON.stringify(files).length);
