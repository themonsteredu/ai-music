import type { GenerateInput } from './validation';
import type { ProviderInfo } from './providers/types';

/** 클라이언트에서 쓰는 Track 형태 (Prisma 모델의 직렬화 버전) */
export interface TrackDTO {
  id: string;
  studentName: string | null;
  classCode: string | null;
  title: string | null;
  kind: string;
  providerId: string;
  mode: string;
  providerJobId: string | null;
  status: string;
  storeName: string | null;
  category: string | null;
  vibe: string | null;
  prompt: string;
  lyrics: string | null;
  durationSec: number | null;
  fileUrl: string | null;
  mimeType: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = (await res.json()) as ApiResult<T>;
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export function fetchProviders(kind?: string): Promise<ProviderInfo[]> {
  const q = kind ? `?kind=${encodeURIComponent(kind)}` : '';
  return req<ProviderInfo[]>(`/api/providers${q}`);
}

export function fetchTracks(classCode?: string): Promise<TrackDTO[]> {
  const q = classCode ? `?classCode=${encodeURIComponent(classCode)}` : '';
  return req<TrackDTO[]>(`/api/tracks${q}`);
}

export function fetchTrackStatus(id: string): Promise<TrackDTO> {
  return req<TrackDTO>(`/api/tracks/${id}/status`);
}

export function deleteTrack(id: string): Promise<{ id: string }> {
  return req<{ id: string }>(`/api/tracks/${id}`, { method: 'DELETE' });
}

export function startGeneration(
  input: GenerateInput,
): Promise<{ track: TrackDTO; launchUrl?: string }> {
  return req<{ track: TrackDTO; launchUrl?: string }>(`/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function importAudio(id: string, file: File): Promise<TrackDTO> {
  const form = new FormData();
  form.append('file', file);
  return req<TrackDTO>(`/api/tracks/${id}/import`, {
    method: 'POST',
    body: form,
  });
}
