'use client';

import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  // Simple local cart items (replace with your real cart state/API if needed)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Relaxed Cotton Blazer',
      priceFormatted: '$29.99',
      imageSrc: '/catalog/DSC05068.jpg',
      qty: 1,
    },
    {
      id: 2,
      title: 'Wool Coat',
      priceFormatted: '$129.00',
      imageSrc: '/catalog/DSC06087.jpg',
      qty: 1,
    },
  ]);

  useEffect(() => {
    const total = cartItems.reduce((s, i) => s + i.qty, 0);
    setCartCount(total);
  }, [cartItems]);

  const navLinks = [
    { name: 'Новинки', href: '/catalog/products?new=true' },
    { name: 'Каталог', href: '/catalog/products' },
    { name: 'Скидки', href: '/catalog/products?sale=true' },
    { name: 'Контакты', href: '/contact' },
  ];

  // --- Actions ---
  const openSearch = () => setSearchOpen(true);
  const openCart = () => setCartOpen(true);

  const handleUserClick = () => {
    // No API call needed - just check the context state
    if (isAuthenticated) {
      router.push('/account');
    } else {
      router.push('/login?next=' + encodeURIComponent(window.location.pathname));
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/cart');
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 px-4">
        <p className="text-sm">Скидки на первую покупку 10% | Покупайте сейчас</p>
      </div>

      {/* Main Header */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl xl:max-w-[1800px] 2xl:max-w-[2000px] grid grid-cols-3 items-center h-16 lg:h-20">
          {/* Left: Mobile menu button + Desktop nav */}
          <div className="flex items-center gap-4 justify-self-start">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 -ml-2 cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NextLink
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  {link.name}
                </NextLink>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="justify-self-center">
            <NextLink href="/" aria-label="Serein home" className="inline-block cursor-pointer">
              <Image
                src="/logo_purple.svg"
                alt="NelyLook"
                width={240}
                height={60}
                priority
                className="h-10 w-auto md:h-14 lg:h-16"
              />
            </NextLink>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center justify-self-end gap-4">
            {/* Search */}
            <button
              onClick={openSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account - Show loading state while checking auth */}
            <button
              onClick={handleUserClick}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Account"
              title={isAuthenticated ? 'Мой аккаунт' : 'Войти'}
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative cursor-pointer"
              aria-label="Shopping bag"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <NextLink
                key={link.name}
                href={link.href}
                className="block text-base font-medium text-gray-700 hover:text-black transition-colors py-2 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NextLink>
            ))}
          </nav>
        </div>
      )}

      {/* ---- Search Overlay ---- */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ---- Cart Drawer ---- */}
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </header>
  );
}

/* ===================== Helpers / Inline Components ===================== */

function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 cursor-pointer" onClick={onClose}>
      <div
        className="mx-auto mt-10 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            if (!query) return;
            router.push(`/catalog/products?search=${encodeURIComponent(query)}`);
            onClose();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск товаров…"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring cursor-text"
            autoFocus
          />
          <button type="submit" className="rounded-xl bg-black px-4 py-3 text-white cursor-pointer hover:bg-gray-800 transition-colors">
            Найти
          </button>
        </form>
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
  onCheckout,
}: {
  open: boolean;
  items: {
    id: number;
    title: string;
    priceFormatted: string;
    imageSrc: string;
    qty: number;
  }[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity cursor-pointer ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[80] h-full w-[90%] max-w-md transform bg-white shadow-2xl transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Корзина</h3>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-neutral-100 cursor-pointer" aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="max-h-[calc(100vh-160px)] space-y-4 overflow-y-auto p-4">
          {items.length === 0 && (
            <p className="text-sm text-neutral-500">Ваша корзина пуста.</p>
          )}
          {items.map((it) => (
            <div key={it.id} className="flex gap-3">
              <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.imageSrc} alt={it.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{it.title}</p>
                    <p className="text-xs text-neutral-500">Кол-во: {it.qty}</p>
                  </div>
                  <p className="text-sm font-semibold">{it.priceFormatted}</p>
                </div>
                <button
                  onClick={() => onRemove(it.id)}
                  className="mt-1 text-xs text-neutral-500 hover:underline cursor-pointer"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <button
            onClick={onCheckout}
            className="w-full rounded-xl bg-black py-3 text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            disabled={items.length === 0}
          >
            Перейти к оплате
          </button>
        </div>
      </aside>
    </>
  );
}