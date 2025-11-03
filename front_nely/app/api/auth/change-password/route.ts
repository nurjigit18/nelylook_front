// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('🔐 Change password request');
    console.log('🔑 Access token exists:', !!accessToken);

    if (!accessToken) {
      console.log('❌ No access token - user not authenticated');
      return NextResponse.json(
        { detail: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    console.log('📡 Calling Django /auth/change-password/...');
    const res = await fetch(`${BACKEND_URL}/auth/change-password/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Django response status:', res.status);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.log('❌ Password change failed:', data);
      return NextResponse.json(data, { status: res.status });
    }

    console.log('✅ Password changed successfully');
    
    // Password changed successfully - clear cookies since Django invalidates tokens
    const response = NextResponse.json(data);
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    
    console.log('🗑️ Cookies cleared - user will need to login again');

    return response;
  } catch (error) {
    console.error('❌ Error changing password:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера', error: String(error) },
      { status: 500 }
    );
  }
}