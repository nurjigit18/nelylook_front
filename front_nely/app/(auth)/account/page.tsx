// app/account/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ClientEditableCard from './ClientEditableCard';

// Updated type to match what Django actually returns
type UserMe = {
  id: number | string;
  email: string;
  first_name?: string | null;
  phone?: string | null;
  role?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
};

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

// Fetch current user directly from server with cookies
async function getMe(): Promise<UserMe | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    console.log('🔍 Account page - checking auth...');
    console.log('🍪 Access token exists:', !!accessToken);

    if (!accessToken) {
      console.log('❌ No access token found in cookies');
      return null;
    }

    console.log('📡 Fetching user from Django...');
    const res = await fetch(`${BACKEND_URL}/auth/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📥 Django response status:', res.status);

    if (!res.ok) {
      console.log('❌ Django returned error:', res.status);
      return null;
    }

    const data = await res.json();
    
    // Handle APIResponse wrapper if present
    const userData = data.data || data;
    
    console.log('✅ User fetched successfully:');
    console.log('   - Email:', userData.email);
    console.log('   - First Name:', userData.first_name);
    console.log('   - Phone:', userData.phone);
    console.log('   - Role:', userData.role);
    
    return userData as UserMe;
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return null;
  }
}

export default async function AccountPage() {
  const me = await getMe();
  
  if (!me) {
    redirect('/login?next=%2Faccount');
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Добро пожаловать, {me.first_name || 'Пользователь'}
            </h1>
          </div>

          <nav className="text-sm">
            <ul className="space-y-3">
              <li>
                <span className="cursor-default text-black underline">
                  Личная информация
                </span>
              </li>
              <li className="text-neutral-500 hover:text-black">
                <a href="/account/change-password">Сменить пароль</a>
              </li>
            </ul>
          </nav>

          <div className="pt-4">
            <LogoutButton />
          </div>
        </aside>

        {/* Content */}
        <section className="rounded border border-neutral-300">
          <div className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Личная информация
            </h2>

            <ClientEditableCard me={me} />
          </div>
        </section>
      </div>
    </main>
  );
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black"
      >
        <span aria-hidden></span> Выйти
      </button>
    </form>
  );
}