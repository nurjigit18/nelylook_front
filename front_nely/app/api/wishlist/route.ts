// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    // Get or create session ID for guests
    let sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) {
      sessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      headers['X-Session-Id'] = sessionId;
    }

    const res = await fetch(`${BACKEND_URL}/api/wishlist/`, {
      method: 'GET',
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json(data);
    
    // Set session cookie for guests
    if (!accessToken && sessionId) {
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    // Get or create session ID for guests
    let sessionId = cookieStore.get('session_id')?.value;
    if (!sessionId) {
      sessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const body = await request.json();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      headers['X-Session-Id'] = sessionId;
    }

    const res = await fetch(`${BACKEND_URL}/api/wishlist/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json(data);
    
    // Set session cookie for guests
    if (!accessToken && sessionId) {
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}