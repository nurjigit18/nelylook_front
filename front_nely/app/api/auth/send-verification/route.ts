// app/api/auth/send-verification/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const api = "http://127.0.0.1:8000";
  const body = await req.json().catch(() => ({}));
  
  // Get access token from cookie instead of header
  const accessToken = req.cookies.get('access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json(
      { detail: 'Не авторизован' },
      { status: 401 }
    );
  }
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  };

  try {
    const upstream = await fetch(`${api}/auth/send-verification/`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await upstream.clone().json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    return NextResponse.json(
      { detail: "Ошибка отправки письма" },
      { status: 500 }
    );
  }
}