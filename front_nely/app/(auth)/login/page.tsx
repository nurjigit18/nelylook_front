"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextUrl = sp.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
  
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data?.detail || "Неверный e-mail или пароль.");
      setLoading(false);
      return;
    }
    
    // ✅ Use window.location.href instead of router.replace
    // This forces a full page reload, ensuring cookies are properly set
    window.location.href = nextUrl;
  }
  

  return (
    <>
      <main className="min-h-dvh">
        {/* full-bleed wrapper to escape any max-w container from parent layout */}
        <div className="mx-[calc(50%-50vw)] w-screen">
          <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[80dvh]">
              {/* Left: full-height photo */}
              <div className="relative min-h-[50dvh] md:min-h-[100dvh]">
                <Image
                  src="/catalog/DSC05068.JPG"   // must exist under /public/catalog/...
                  alt="Nely Look — mood"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Right: form */}
              <div className="w-full flex items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-14">
                <div className="w-full max-w-[480px]">
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    Добро пожаловать в Nely Look!
                  </h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    Войдите для лучшего шоппинга на Nely Look
                  </p>

                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Ваш Email</label>
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

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-sm font-medium">Пароль</label>
                        <Link href="/forgot-password" className="text-xs underline">
                          Забыли пароль?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          className="w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-black/70"
                          type={showPw ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                    </div>

                    {err && <p className="text-sm text-red-600">{err}</p>}

                    <button
                      className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? "Входим…" : "Войти"}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm">
                    Ещё нет профиля Nely Look?{" "}
                    <Link href="/register" className="font-medium underline">
                      Регистрация
                    </Link>
                  </p>

                  <p className="mt-2 text-center text-xs">
                    <Link href="/send-verification" className="underline">
                      Отправить письмо для подтверждения
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
