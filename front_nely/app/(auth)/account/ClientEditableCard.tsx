// app/account/ClientEditableCard.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

type UserMe = {
  id: number | string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  address?: string | null;
};

export default function ClientEditableCard({ me }: { me: UserMe }) {
  const { checkAuth } = useAuth(); // Get the checkAuth function from context
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(me.first_name ?? '');
  const [lastName, setLastName] = useState(me.last_name ?? '');
  const [phone, setPhone] = useState(me.phone ?? '');
  const [address, setAddress] = useState(me.address ?? '');

  const fullName = `${me.first_name ?? ''} ${me.last_name ?? ''}`.trim() || '—';

  async function onSave() {
    setSaving(true);
    setErr(null);
    
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          address: address || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data && (data.detail || data.error)) || 'Не удалось сохранить изменения'
        );
      }

      setEditing(false);
      
      // Update auth context instead of full page reload
      await checkAuth();
      
      // Reload only the current page data
      window.location.reload();
    } catch (e: any) {
      setErr(e.message || 'Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    setFirstName(me.first_name ?? '');
    setLastName(me.last_name ?? '');
    setPhone(me.phone ?? '');
    setAddress(me.address ?? '');
    setEditing(false);
    setErr(null);
  }

  return (
    <div className="mt-6">
      {!editing ? (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Field label="Полное имя" value={fullName} />
            <Field label="Телефон" value={me.phone || '—'} />
            <Field label="Email" value={me.email} />
            <Field label="Адрес" value={me.address || '—'} wide />
          </div>

          <div className="mt-6 border-t border-neutral-200" />
          <div className="mt-4">
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 cursor-pointer transition-colors"
            >
              ✎ Редактировать
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Имя"
              value={firstName}
              onChange={setFirstName}
              placeholder="Имя"
            />
            <Input
              label="Фамилия"
              value={lastName}
              onChange={setLastName}
              placeholder="Фамилия"
            />
            <Input
              label="Телефон"
              value={phone}
              onChange={setPhone}
              placeholder="+996700123456"
            />
            <Input
              label="Email"
              value={me.email}
              onChange={() => {}}
              disabled
            />
          </div>
          <div className="mt-6">
            <Textarea
              label="Адрес"
              value={address}
              onChange={setAddress}
              placeholder="Улица, город, регион, индекс"
            />
          </div>

          {err && (
            <p className="mt-3 text-sm text-red-600">{err}</p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {saving ? 'Сохраняем…' : 'Сохранить'}
            </button>
            <button
              onClick={onCancel}
              className="rounded border border-neutral-300 px-4 py-2 text-sm cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
        {label}
      </div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block cursor-text">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black disabled:bg-neutral-50 cursor-text disabled:cursor-not-allowed"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block cursor-text">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black cursor-text"
      />
    </label>
  );
}