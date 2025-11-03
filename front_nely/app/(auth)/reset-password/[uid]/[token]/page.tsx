// app/reset-password/[uid]/[token]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function validatePassword(password: string): { isValid: boolean; error: string | null } {
  if (password.length < 8) return { isValid: false, error: "Пароль должен содержать минимум 8 символов" };
  if (!/[A-Z]/.test(password)) return { isValid: false, error: "Пароль должен содержать хотя бы одну заглавную букву" };
  if (!/[a-z]/.test(password)) return { isValid: false, error: "Пароль должен содержать хотя бы одну строчную букву" };
  if (!/\d/.test(password)) return { isValid: false, error: "Пароль должен содержать хотя бы одну цифру" };
  return { isValid: true, error: null };
}

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const uid = params.uid as string;
  const token = params.token as string;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (value: string) => {
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

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.detail || 'Не удалось сбросить пароль');
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh">
      <div className="mx-[calc(50%-50vw)] w-screen">
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-1 items-stretch min-h-[80dvh]">

            {/* Right: form or success */}
            <div className="w-full flex items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-14">
              <div className="w-full max-w-[480px]">
                {!success ? (
                  <>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                      Новый пароль
                    </h1>
                    <p className="mt-2 text-sm text-neutral-600">
                      Введите новый пароль для вашего аккаунта
                    </p>

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
                          Новый пароль
                        </label>
                        <div className="relative">
                          <input
                            id="new-password"
                            type={showPw ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            value={newPassword}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 ${
                              passwordError ? 'border-red-300 focus:ring-red-500' : 'focus:ring-black/70'
                            }`}
                            placeholder="Минимум 8 символов"
                          />
                          <button
                            type="button"
                            aria-label={showPw ? "Скрыть пароль" : "Показать пароль"}
                            onClick={() => setShowPw((s) => !s)}
                            className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500"
                          >
                            {showPw ? "🙈" : "👁️"}
                          </button>
                        </div>
                        {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
                        {!passwordError && newPassword.length > 0 && (
                          <p className="mt-1 text-xs text-green-600">✓ Пароль соответствует требованиям</p>
                        )}
                        <p className="mt-1 text-xs text-neutral-500">
                          Минимум 8 символов, 1 заглавная буква, 1 строчная буква и 1 цифра
                        </p>
                      </div>

                      <div>
                        <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium">
                          Подтвердите пароль
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
                            placeholder="Повторите пароль"
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
                      </div>

                      {error && (
                        <p className="text-sm text-red-600 whitespace-pre-line">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting || !!passwordError}
                        className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
                      >
                        {submitting ? 'Сохраняем…' : 'Сменить пароль'}
                      </button>
                    </form>

                    <div className="mt-6">
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black"
                      >
                        <span aria-hidden>←</span> Назад ко входу
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    {/* Success Icon */}
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold">Пароль изменен!</h2>
                      <p className="mt-2 text-sm text-neutral-600">
                        Ваш пароль успешно изменен. <br />
                        Перенаправляем ко входу...
                      </p>
                    </div>

                    <Link
                      href="/login"
                      className="inline-block rounded-lg bg-black px-6 py-2 text-white hover:bg-neutral-800 transition-colors"
                    >
                      Войти сейчас
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}