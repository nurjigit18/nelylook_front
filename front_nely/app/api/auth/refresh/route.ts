// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { detail: 'Refresh token не найден' },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Refresh token is invalid or expired
      const response = NextResponse.json(data, { status: res.status });
      // Clear cookies
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    // Update access token cookie
    const response = NextResponse.json(data);
    
    if (data.access) {
      response.cookies.set('access_token', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { detail: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}