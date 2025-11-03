// app/login/actions.ts
'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nextUrl = formData.get('nextUrl') as string || '/';

  if (!email || !password) {
    return { error: 'Email и пароль обязательны' };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        error: data?.detail || data?.message || 'Неверный e-mail или пароль.' 
      };
    }

    // Set cookies server-side (Next.js 15 - cookies() is async)
    const cookieStore = await cookies();
    
    if (data.access) {
      cookieStore.set('access_token', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hours
        path: '/',
      });
    }

    if (data.refresh) {
      cookieStore.set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    // Redirect will happen after this function returns
    redirect(nextUrl);
  } catch (error: any) {
    // If redirect was called, it throws a special error - let it through
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error('Login error:', error);
    return { error: 'Ошибка сервера. Попробуйте позже.' };
  }
}