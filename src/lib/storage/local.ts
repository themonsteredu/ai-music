import 'server-only';
import { mkdir, readFile, writeFile, unlink, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { AudioStorage } from './index';
import { extFor } from './index';

/**
 * 로컬 디스크 저장 (개발 / 단일 PC).
 * ./storage/<id>.<ext> 로 저장하고 /api/audio/[id] 로 서빙한다.
 * 메타(mimeType)는 확장자로 복원한다.
 */
const DIR = path.join(process.cwd(), 'storage');

async function ensureDir() {
  await mkdir(DIR, { recursive: true });
}

function mimeFromExt(ext: string): string {
  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    default:
      return 'application/octet-stream';
  }
}

export class LocalStorage implements AudioStorage {
  async save(id: string, bytes: Buffer, mimeType: string) {
    await ensureDir();
    const ext = extFor(mimeType);
    await writeFile(path.join(DIR, `${id}.${ext}`), bytes);
    return { url: `/api/audio/${id}` };
  }

  private async findFile(id: string): Promise<string | null> {
    try {
      const files = await readdir(DIR);
      const match = files.find((f) => f.startsWith(`${id}.`));
      return match ? path.join(DIR, match) : null;
    } catch {
      return null;
    }
  }

  async read(id: string) {
    const filePath = await this.findFile(id);
    if (!filePath) return null;
    const bytes = await readFile(filePath);
    const ext = filePath.split('.').pop() ?? 'bin';
    return { bytes, mimeType: mimeFromExt(ext) };
  }

  async remove(id: string) {
    const filePath = await this.findFile(id);
    if (filePath) await unlink(filePath).catch(() => {});
  }
}
