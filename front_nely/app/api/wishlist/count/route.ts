// app/api/wishlist/count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
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
    } else {
      // No auth, return 0
      return NextResponse.json({ count: 0 });
    }

    const res = await fetch(`${BACKEND_URL}/api/wishlist/count/`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      return NextResponse.json({ count: 0 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Wishlist count error:', error);
    return NextResponse.json({ count: 0 });
  }
}