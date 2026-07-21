import { NextResponse } from 'next/server';

/** 일관된 API 응답 형태: { ok, data } | { ok:false, error } */
export function ok<T>(data: T, init?: number) {
  return NextResponse.json({ ok: true, data }, { status: init ?? 200 });
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}
