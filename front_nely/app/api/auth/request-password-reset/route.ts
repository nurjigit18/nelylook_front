// app/api/auth/request-password-reset/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    
    const res = await fetch(`${BACKEND_URL}/auth/request-password-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}