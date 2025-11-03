// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔐 Login attempt for:', body.email);
    
    const res = await fetch(`${BACKEND_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('📥 Django response status:', res.status);
    console.log('📦 Django response data:', JSON.stringify(data, null, 2));

    if (!res.ok) {
      console.log('❌ Login failed:', data);
      return NextResponse.json(data, { status: res.status });
    }

    // Extract tokens from the response
    // Your Django view wraps response in APIResponse.success()
    // which returns: { status: "success", message: "...", data: { access, refresh, user } }
    const accessToken = data.data?.access || data.access;
    const refreshToken = data.data?.refresh || data.refresh;

    if (!accessToken) {
      console.error('❌ No access token in response!', data);
      return NextResponse.json(
        { detail: 'Authentication successful but no token received' },
        { status: 500 }
      );
    }

    console.log('🎫 Access token exists:', !!accessToken);
    console.log('🎫 Refresh token exists:', !!refreshToken);
    console.log('🎫 Access token preview:', accessToken.substring(0, 30) + '...');

    const response = NextResponse.json(data);
    
    if (accessToken) {
      console.log('✅ Setting access_token cookie');
      response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });
    }

    if (refreshToken) {
      console.log('✅ Setting refresh_token cookie');
      response.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    console.log('✅ Login successful, cookies set');
    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера', error: String(error) },
      { status: 500 }
    );
  }
}