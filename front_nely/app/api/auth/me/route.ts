// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('🔍 /api/auth/me called');
    console.log('🍪 All cookies:', cookieStore.getAll().map(c => c.name));
    console.log('🔑 Access token exists:', !!accessToken);
    
    if (accessToken) {
      console.log('🔑 Access token preview:', accessToken.substring(0, 30) + '...');
    }

    if (!accessToken) {
      console.log('❌ No access token found in cookies');
      return NextResponse.json(
        { detail: 'Не авторизован' },
        { status: 401 }
      );
    }

    console.log('📡 Calling Django /auth/me/...');
    const res = await fetch(`${BACKEND_URL}/auth/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📥 Django /auth/me/ response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log('❌ Django error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }
      
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    console.log('✅ User fetched successfully:', data);

    // Handle the APIResponse wrapper
    const userData = data.data || data;
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('❌ Error in /api/auth/me:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера', error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      console.log('❌ No access token for PATCH /me');
      return NextResponse.json(
        { detail: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📝 Updating user profile:', body);

    const res = await fetch(`${BACKEND_URL}/auth/me/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log('❌ Profile update failed:', data);
      return NextResponse.json(data, { status: res.status });
    }

    console.log('✅ Profile updated successfully');
    
    // Handle the APIResponse wrapper
    const userData = data.data || data;
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return NextResponse.json(
      { detail: 'Ошибка сервера', error: String(error) },
      { status: 500 }
    );
  }
}