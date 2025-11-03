// app/account/LogoutButton.tsx
'use client';

import { useAuth } from '@/app/contexts/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black"
    >
      <span aria-hidden>↩</span> Выйти
    </button>
  );
}