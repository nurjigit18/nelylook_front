// app/account/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function validatePassword(password: string): { isValid: boolean; error: string | null } {
  if (password.length < 8) return { isValid: false, error: "Пароль должен содержать минимум 8 символов" };
  if (!/[A-Z]/.test(password)) return { isValid: false, error: "Пароль должен содержать хотя бы одну заглавную букву" };
  if (!/[a-z]/.test(password)) return { isValid: false, error: "Пароль должен содержать хотя бы одну строчную букву" };
  if (!/\d/.test(password)) return { isValid: false, error: "Пароль должен содержать хотя бы одну цифру" };
  return { isValid: true, error: null };
}

export default function ChangePasswordPage() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (value.length > 0) {
      const validation = validatePassword(value);
      setPasswordError(validation.error);
    } else {
      setPasswordError(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!oldPassword) {
      setError('Введите текущий пароль');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (oldPassword === newPassword) {
      setError('Новый пароль должен отличаться от текущего');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password2: confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Handle specific errors from Django
        if (data.old_password) {
          throw new Error(Array.isArray(data.old_password) ? data.old_password[0] : data.old_password);
        }
        if (data.new_password2) {
          throw new Error(Array.isArray(data.new_password2) ? data.new_password2[0] : data.new_password2);
        }
        throw new Error(data.detail || data.message || 'Не удалось изменить пароль');
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds (since all tokens are invalidated)
      setTimeout(() => {
        router.push('/login?message=password_changed');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-[600px]">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-neutral-600">
          <Link href="/account" className="hover:text-black">
            Профиль
          </Link>
          <span className="mx-2">→</span>
          <span className="text-black">Сменить пароль</span>
        </nav>

        {!success ? (
          <div className="rounded border border-neutral-300 bg-white p-6 md:p-8">
            <h1 className="text-2xl font-semibold">Сменить пароль</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Для безопасности убедитесь, что ваш пароль сложный и уникальный
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              {/* Current Password */}
              <div>
                <label htmlFor="old-password" className="mb-1 block text-sm font-medium">
                  Текущий пароль
                </label>
                <div className="relative">
                  <input
                    id="old-password"
                    type={showOldPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-black/70"
                    placeholder="Введите текущий пароль"
                  />
                  <button
                    type="button"
                    aria-label={showOldPw ? "Скрыть пароль" : "Показать пароль"}
                    onClick={() => setShowOldPw((s) => !s)}
                    className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500"
                  >
                    {showOldPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-5">
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
                    Новый пароль
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => handleNewPasswordChange(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 ${
                        passwordError ? 'border-red-300 focus:ring-red-500' : 'focus:ring-black/70'
                      }`}
                      placeholder="Минимум 8 символов"
                    />
                    <button
                      type="button"
                      aria-label={showNewPw ? "Скрыть пароль" : "Показать пароль"}
                      onClick={() => setShowNewPw((s) => !s)}
                      className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500"
                    >
                      {showNewPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
                  {!passwordError && newPassword.length > 0 && (
                    <p className="mt-1 text-xs text-green-600">✓ Пароль соответствует требованиям</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">
                    Минимум 8 символов, 1 заглавная, 1 строчная буква и 1 цифра
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                  <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">
                    Подтвердите новый пароль
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-black/70"
                      placeholder="Повторите новый пароль"
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPw ? "Скрыть пароль" : "Показать пароль"}
                      onClick={() => setShowConfirmPw((s) => !s)}
                      className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500"
                    >
                      {showConfirmPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="mt-1 text-xs text-red-600">Пароли не совпадают</p>
                  )}
                  {confirmPassword && confirmPassword === newPassword && newPassword.length >= 8 && (
                    <p className="mt-1 text-xs text-green-600">✓ Пароли совпадают</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting || !!passwordError || !oldPassword || !newPassword || !confirmPassword}
                  className="rounded-lg bg-black px-6 py-2 text-white disabled:opacity-60 hover:bg-neutral-800 transition-colors"
                >
                  {submitting ? 'Сохраняем…' : 'Сменить пароль'}
                </button>
                <Link
                  href="/account"
                  className="rounded-lg border border-neutral-300 px-6 py-2 text-sm hover:bg-neutral-50 transition-colors"
                >
                  Отмена
                </Link>
              </div>
            </form>

            {/* Info box */}
            <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">После смены пароля:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-blue-700">
                    <li>Все активные сеансы будут завершены</li>
                    <li>Вам нужно будет войти заново</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded border border-neutral-300 bg-white p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="mt-6 text-2xl font-semibold">Пароль изменен!</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Ваш пароль успешно изменен. <br />
              Сейчас вы будете перенаправлены ко входу.
            </p>

            <p className="mt-4 text-xs text-neutral-500">
              Перенаправление через несколько секунд...
            </p>

            <div className="mt-6">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-black px-6 py-2 text-white hover:bg-neutral-800 transition-colors"
              >
                Войти сейчас
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}