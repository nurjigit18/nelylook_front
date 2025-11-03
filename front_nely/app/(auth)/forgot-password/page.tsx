'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type ApiError = { detail?: string; error?: string } | Record<string, string[] | string>;

function humanizeErrors(data: ApiError | null): string {
  if (!data) return 'Ошибка. Попробуйте позже.';
  if (typeof (data as any).detail === 'string') return (data as any).detail;
  if (typeof (data as any).error === 'string') return (data as any).error;
  const lines: string[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (k === 'status' || k === 'message') continue;
    const msg = Array.isArray(v) ? v.join(', ') : v;
    lines.push(`${k}: ${msg}`);
  }
  return lines.join('\n') || 'Ошибка. Попробуйте позже.';
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(humanizeErrors(data));
      }
      
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить ссылку.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh">
      <div className="mx-[calc(50%-50vw)] w-screen">
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-1 items-stretch min-h-[80dvh]">
            {/* Left: photo */}
            {/* Right: form or success */}
            <div className="w-full flex items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-14">
              <div className="w-full max-w-[480px]">
                {!sent ? (
                  <>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                      Восстановить пароль
                    </h1>

                    <p className="mt-2 text-sm text-neutral-600">
                      Введите ваш e-mail и мы отправим ссылку для восстановления пароля
                    </p>

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70"
                          placeholder="Введите ваш e-mail"
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-600 whitespace-pre-line">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
                      >
                        {submitting ? 'Отправляем…' : 'Отправить ссылку'}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold">Письмо отправлено!</h2>
                      <p className="mt-2 text-sm text-neutral-600">
                        Мы отправили ссылку для восстановления пароля на <br />
                        <span className="font-medium">{email}</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Link
                        href="/login"
                        className="block w-full rounded-lg bg-black py-2 text-white hover:bg-neutral-800 transition-colors"
                      >
                        Перейти ко входу
                      </Link>
                      <button
                        onClick={() => {
                          setSent(false);
                          setEmail('');
                          setError(null);
                        }}
                        className="w-full rounded-lg border py-2 hover:bg-neutral-50 transition-colors"
                      >
                        Отправить заново
                      </button>
                    </div>

                    <p className="text-xs text-neutral-500">
                      Не получили письмо? Проверьте папку «Спам» или попробуйте отправить заново
                    </p>
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