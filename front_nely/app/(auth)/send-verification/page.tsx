"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    const res = await fetch("/api/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data?.detail || "Ошибка при отправке письма. Попробуйте снова.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <>
      <main className="min-h-dvh">
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-1 items-stretch min-h-[80dvh]">
            {/* Left: photo fills column height */}

            {/* Right: form */}
            <div className="w-full flex items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-14">
              <div className="w-full max-w-[480px]">
                {/* Brand lockup */}
                <div className="mb-6 text-center md:text-left">
                  <div className="flex items-baseline justify-center md:justify-start">
                  </div>
                </div>

                {!success ? (
                  <>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                      Подтвердите ваш email
                    </h1>
                    <p className="mt-1 text-sm text-neutral-600">
                      Введите ваш email, и мы отправим вам письмо с ссылкой для
                      подтверждения аккаунта
                    </p>

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Ваш Email
                        </label>
                        <input
                          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/70"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="Введите ваш e-мейл"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      {err && <p className="text-sm text-red-600">{err}</p>}

                      <button
                        className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
                        disabled={loading}
                      >
                        {loading ? "Отправляем…" : "Отправить письмо"}
                      </button>
                    </form>

                    <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                      <p className="text-xs text-neutral-600">
                        💡 <span className="font-medium">Совет:</span> Убедитесь, что
                        вы используете тот же email, с которым регистрировались
                      </p>
                    </div>

                    <div className="mt-6 text-center">
                      <Link
                        href="/login"
                        className="text-sm underline inline-flex items-center gap-1"
                      >
                        <span>←</span> Вернуться к входу
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-[#7a2b8a]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-semibold">
                      Письмо отправлено!
                    </h1>
                    <p className="mt-2 text-sm text-neutral-600">
                      Мы отправили письмо с подтверждением на{" "}
                      <span className="font-medium">{email}</span>
                    </p>

                    <div className="mt-6 p-4 bg-neutral-50 rounded-lg text-left space-y-3">
                      <div className="flex gap-3">
                        <span className="text-lg">📧</span>
                        <div>
                          <p className="text-sm font-medium">
                            Откройте письмо и нажмите на ссылку
                          </p>
                          <p className="text-xs text-neutral-600 mt-1">
                            Ссылка действительна в течение 24 часов
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="text-lg">🔍</span>
                        <div>
                          <p className="text-sm font-medium">Не видите письмо?</p>
                          <p className="text-xs text-neutral-600 mt-1">
                            Проверьте папку «Спам» или «Промоакции»
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="text-lg">⏱️</span>
                        <div>
                          <p className="text-sm font-medium">Всё ещё не пришло?</p>
                          <button
                            onClick={() => setSuccess(false)}
                            className="text-xs text-[#7a2b8a] underline font-medium mt-1"
                          >
                            Отправить письмо повторно
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href="/login"
                        className="text-sm underline inline-flex items-center gap-1"
                      >
                        <span>←</span> Вернуться к входу
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}