// app/api/wishlist/exists/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get('variant');

    if (!variantId) {
      return NextResponse.json(
        { detail: 'Variant ID is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const sessionId = cookieStore.get('session_id')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else if (sessionId) {
      headers['X-Session-Id'] = sessionId;
    }

    const res = await fetch(
      `${BACKEND_URL}/api/wishlist/exists/?variant=${variantId}`,
      {
        method: 'GET',
        headers,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Wishlist exists check error:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}