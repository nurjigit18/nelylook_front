// app/account/actions.ts
'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  
  // Clear auth cookies
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
  
  redirect('/');
}