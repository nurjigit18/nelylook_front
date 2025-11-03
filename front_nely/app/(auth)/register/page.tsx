// app/(auth)/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    phone: '+996', // ✅ Pre-filled with +996
  });

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // ✅ Client-side validation states
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  // ✅ Check password match in real-time
  useEffect(() => {
    if (!formData.confirmPassword) {
      setPasswordsMatch(null);
      return;
    }

    const match = formData.password === formData.confirmPassword;
    setPasswordsMatch(match);
    
    if (!match) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: 'Пароли не совпадают' }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  }, [formData.password, formData.confirmPassword]);

  // ✅ Check password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(null);
      return;
    }

    const password = formData.password;
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    // Calculate strength
    if (password.length >= 8) {
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

      if (criteriaCount >= 3) {
        strength = 'strong';
      } else if (criteriaCount >= 2) {
        strength = 'medium';
      }
    }

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (field: string, value: string) => {
    // ✅ Special handling for phone field - keep +996 prefix
    if (field === 'phone') {
      // Don't allow deleting +996
      if (!value.startsWith('+996')) {
        value = '+996';
      }
      // Only allow numbers after +996
      const cleanValue = value.slice(4).replace(/\D/g, '');
      value = '+996' + cleanValue;
      
      // Limit to reasonable phone length (+996 + 9 digits = 13 chars)
      if (value.length > 13) {
        value = value.slice(0, 13);
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (field !== 'confirmPassword') {
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const loginAndSendVerification = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting auto-login after registration...');
      
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      console.log('📥 Login response:', loginRes.status);

      if (!loginRes.ok) {
        console.error('❌ Auto-login failed:', loginData);
        setSendError('Не удалось получить токен доступа');
        return;
      }

      // Handle both nested and flat response structures
      const accessToken = loginData?.data?.access || loginData?.access;
      const refreshToken = loginData?.data?.refresh || loginData?.refresh;

      console.log('🎫 Tokens obtained:', !!accessToken, !!refreshToken);

      if (!accessToken) {
        console.error('❌ No token found');
        setSendError('Не удалось получить токен доступа');
        return;
      }

      console.log('✅ Tokens obtained successfully');

      // Send verification email
      console.log('📧 Sending verification email...');
      const verifyRes = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (verifyRes.ok) {
        console.log('✅ Verification email sent');
        setVerificationSent(true);
      } else {
        console.error('❌ Verification email failed');
        setSendError('Письмо подтверждения не удалось отправить');
      }
    } catch (err) {
      console.error('❌ Error in loginAndSendVerification:', err);
      setSendError('Ошибка при отправке письма подтверждения');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // First name
    if (!formData.firstName.trim()) {
      errors.firstName = 'Имя обязательно';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Введите корректный email';
      }
    }

    // Phone validation
    if (!formData.phone || formData.phone === '+996') {
      errors.phone = 'Телефон обязателен';
    } else if (formData.phone.length < 13) {
      errors.phone = 'Введите полный номер (9 цифр после +996)';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      errors.password = 'Пароль должен содержать минимум 8 символов';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    return errors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSendError(null);

    // Validate form
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      console.log('📝 Registering user:', formData.email);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName.trim(),
          phone: formData.phone,
        }),
      });

      const data = await res.json();
      console.log('📥 Registration response:', res.status);

      if (!res.ok) {
        console.error('❌ Registration failed:', data);

        if (data.errors) {
          const backendErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              backendErrors[field] = messages[0];
            } else {
              backendErrors[field] = String(messages);
            }
          });
          setFieldErrors(backendErrors);
        } else if (data.detail) {
          setError(data.detail);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Ошибка регистрации');
        }
        return;
      }

      console.log('✅ Registration successful');
      setSuccess(true);

      await loginAndSendVerification(formData.email, formData.password);

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <main className="min-h-dvh">
        <div className="mx-[calc(50%-50vw)] w-screen">
          <section className="w-full">
            <div className="grid grid-cols-1 items-stretch min-h-[80dvh]">
              <div className="w-full flex items-center justify-center px-6 md:px-12 lg:px-20 py-8">
                <div className="w-full max-w-[480px] text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-semibold">Регистрация успешна!</h2>

                  {verificationSent ? (
                    <p className="mt-2 text-sm text-neutral-600">
                      Письмо подтверждения отправлено на <strong>{formData.email}</strong>
                    </p>
                  ) : sendError ? (
                    <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                      <p className="text-sm text-yellow-800">{sendError}</p>
                      <p className="mt-2 text-xs text-yellow-700">
                        Вы можете войти и отправить письмо позже из профиля
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-neutral-600">
                      Отправка письма подтверждения...
                    </p>
                  )}

                  <p className="mt-4 text-xs text-neutral-500">
                    Перенаправляем на страницу входа...
                  </p>

                  <Link
                    href="/login"
                    className="mt-6 inline-block rounded-lg bg-black px-6 py-2 text-white hover:bg-neutral-800"
                  >
                    Войти сейчас
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh">
      <div className="mx-[calc(50%-50vw)] w-screen">
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[80dvh]">
            {/* Left: Image */}
            <div className="relative min-h-[50dvh] md:min-h-[100dvh]">
              <Image
                src="/catalog/DSC05068.JPG"
                alt="Nely Look"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Right: Form */}
            <div className="w-full flex items-center justify-center px-6 md:px-12 lg:px-20 py-8 md:py-14">
              <div className="w-full max-w-[480px]">
                <h1 className="text-2xl md:text-3xl font-semibold">Создать аккаунт</h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Присоединяйтесь к Nely Look сегодня
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                      Имя <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
                        fieldErrors.firstName || fieldErrors.first_name
                          ? 'border-red-300 focus:ring-red-500'
                          : 'focus:ring-black/70'
                      }`}
                      placeholder="Введите ваше имя"
                    />
                    {(fieldErrors.firstName || fieldErrors.first_name) && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.firstName || fieldErrors.first_name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
                        fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'focus:ring-black/70'
                      }`}
                      placeholder="example@domain.com"
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                  </div>

                  {/* Phone with +996 prefix */}
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
                        fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : 'focus:ring-black/70'
                      }`}
                      placeholder="+996700123456"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500">
                      Формат: +996 + 9 цифр (например: +996700123456)
                    </p>
                  </div>

                  {/* Password with strength indicator */}
                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium">
                      Пароль <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 ${
                          fieldErrors.password ? 'border-red-300 focus:ring-red-500' : 'focus:ring-black/70'
                        }`}
                        placeholder="Минимум 8 символов"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500"
                      >
                        {showPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                    )}
                    
                    {/* Password strength indicator */}
                    {formData.password && passwordStrength && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          <div className={`h-1 flex-1 rounded ${
                            passwordStrength === 'weak' ? 'bg-red-500' :
                            passwordStrength === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                          <div className={`h-1 flex-1 rounded ${
                            passwordStrength === 'medium' || passwordStrength === 'strong' ? 
                            passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500' : 
                            'bg-neutral-200'
                          }`} />
                          <div className={`h-1 flex-1 rounded ${
                            passwordStrength === 'strong' ? 'bg-green-500' : 'bg-neutral-200'
                          }`} />
                        </div>
                        <p className={`mt-1 text-xs ${
                          passwordStrength === 'weak' ? 'text-red-600' :
                          passwordStrength === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength === 'weak' && '⚠️ Слабый пароль'}
                          {passwordStrength === 'medium' && '👍 Средний пароль'}
                          {passwordStrength === 'strong' && '✓ Надежный пароль'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password with match indicator */}
                  <div>
                    <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
                      Подтвердите пароль <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPw ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 ${
                          fieldErrors.confirmPassword
                            ? 'border-red-300 focus:ring-red-500'
                            : passwordsMatch === true
                            ? 'border-green-300 focus:ring-green-500'
                            : 'focus:ring-black/70'
                        }`}
                        placeholder="Повторите пароль"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw((s) => !s)}
                        className="absolute inset-y-0 right-0 grid place-items-center px-3 text-neutral-500"
                      >
                        {showConfirmPw ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                    {!fieldErrors.confirmPassword && passwordsMatch === true && (
                      <p className="mt-1 text-xs text-green-600">✓ Пароли совпадают</p>
                    )}
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60 hover:bg-neutral-800 transition-colors"
                  >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm">
                  Уже есть аккаунт?{' '}
                  <Link href="/login" className="font-medium underline">
                    Войти
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}