// app/api/wishlist/by-variant/[variantId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { variantId: string } }
) {
  try {
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
      `${BACKEND_URL}/api/wishlist/by-variant/${params.variantId}/`,
      {
        method: 'DELETE',
        headers,
      }
    );

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Wishlist DELETE by variant error:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}