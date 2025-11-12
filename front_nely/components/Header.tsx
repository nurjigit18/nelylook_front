'use client';

import { Search, User, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

type CatalogCategory = {
  id: number;  // This comes from serializer (source="category_id")
  name: string;  // This comes from serializer (source="category_name")
  slug: string;  // This comes from serializer (source="category_slug")
  parent_name?: string;
  description?: string;
  display_order?: number;
};

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(0); // NEW: Wishlist count

  // search UI
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // catalog dropdown
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogCategories, setCatalogCategories] = useState<CatalogCategory[]>([]);

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

  useEffect(() => {
    loadWishlistCount();
    
    // Listen for wishlist updates from ProductCard
    const handleWishlistUpdate = () => {
      loadWishlistCount();
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);
  
  async function loadWishlistCount() {
    try {
      const res = await fetch('/api/wishlist/count');
      if (res.ok) {
        const data = await res.json();
        setWishlistCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error loading wishlist count:', error);
    }
  }

  useEffect(() => {
    console.log('🚀 Starting category fetch...');
    
    fetch('/api/catalog/categories')
      .then((res) => {
        console.log('📡 Response status:', res.status, res.ok);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('📦 Categories data received:', data);
        console.log('📊 Is array?', Array.isArray(data));
        console.log('📊 Count:', data?.length);
        
        if (Array.isArray(data)) {
          console.log('✅ Setting categories:', data.length);
          setCatalogCategories(data);
        } else {
          console.error('❌ Expected array, got:', typeof data);
        }
      })
      .catch((err) => {
        console.error('❌ Error fetching categories:', err);
      });
  }, []);
  

  const navLinks = [
    { name: 'Новинки', href: '/catalog/products?new_arrival=true' },
    { name: 'Каталог', href: '/catalog/products' }, // this one will get dropdown
    { name: 'Скидки', href: '/catalog/products?on_sale=true' },
    { name: 'Контакты', href: '/contact' },
  ];

  const handleUserClick = () => {
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
        setCartOpen(false);
        setIsSearchExpanded(false);
        setIsCatalogOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // submit search
  const submitSearch = () => {
    const q = searchValue.trim();
    if (!q) return;
    setIsSearchExpanded(false);
    router.push(`/catalog/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 px-4">
        <p className="text-sm">Скидки на первую покупку 10% | Покупайте сейчас</p>
      </div>

      {/* Main Header */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 relative">
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
              {navLinks.map((link) => {
                if (link.name === 'Каталог') {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => {
                        console.log('🖱️ Mouse entered Каталог');
                        setIsCatalogOpen(true);
                      }}
                      onMouseLeave={() => {
                        console.log('🖱️ Mouse left Каталог container');
                        setIsCatalogOpen(false);
                      }}
                    >
                      <NextLink
                        href={link.href}
                        className="relative text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer
                                  hover:text-black hover:-translate-y-[1px] after:content-[''] after:absolute after:left-0 after:-bottom-2
                                  after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-200 hover:after:w-full"
                      >
                        {link.name}
                      </NextLink>
                
                      {isCatalogOpen && (
                        <div
                          className="absolute left-0 top-full w-[720px] bg-white border border-gray-200 shadow-xl z-[100]
                                    py-4 px-5 mt-0"
                          onMouseEnter={() => {
                            console.log('🖱️ Mouse in dropdown');
                            setIsCatalogOpen(true);
                          }}
                          onMouseLeave={() => {
                            console.log('🖱️ Mouse left dropdown');
                            setIsCatalogOpen(false);
                          }}
                        >
                          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">
                            Все категории
                          </h3>
                          
                          {/* Scrollable area */}
                          <div
                            className={`grid gap-x-8 gap-y-2.5 max-h-[500px] overflow-y-auto
                                        ${catalogCategories.length > 12 ? 'grid-cols-3' : catalogCategories.length > 6 ? 'grid-cols-2' : 'grid-cols-1'}`}
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#d1d5db transparent'
                            }}
                          >
                            {catalogCategories.length > 0 ? (
                              catalogCategories.map((cat) => (
                                <div key={cat.id}>
                                  <NextLink
                                    href={`/catalog/${cat.slug}`}
                                    className="text-sm text-gray-700 hover:text-black hover:bg-gray-50 py-2 px-3 rounded transition-colors block"
                                    onClick={() => setIsCatalogOpen(false)}
                                  >
                                    {cat.name}
                                  </NextLink>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-400 py-4">
                                Загрузка категорий...
                              </div>
                            )}
                          </div>
                
                          <div className="border-t mt-4 pt-3">
                            <NextLink
                              href="/catalog/products"
                              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black font-medium transition-colors"
                              onClick={() => setIsCatalogOpen(false)}
                            >
                              Смотреть все товары
                              <span aria-hidden="true">→</span>
                            </NextLink>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // other links
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-medium text-gray-700 transition-all duration-200 cursor-pointer
                              hover:text-black hover:-translate-y-[1px] after:content-[''] after:absolute after:left-0 after:-bottom-2
                              after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-200 hover:after:w-full"
                  >
                    {link.name}
                  </NextLink>
                );
              })}
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

          {/* Right: Icons + Collapsing Search */}
          <div className="flex items-center justify-self-end gap-4">
            {/* Collapsing search container */}
            <div className="relative flex items-center gap-2">
              {/* expanding input */}
              <div
                className={`flex items-center bg-gray-100 border border-transparent transition-all duration-200
                            ${isSearchExpanded ? 'w-48 sm:w-56 border-gray-200 px-3 rounded-full' : 'w-0 px-0 overflow-hidden rounded-full'}`}
              >
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                  placeholder="Поиск…"
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus={isSearchExpanded}
                />
                {isSearchExpanded && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setSearchValue('');
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* search icon */}
              <button
                onClick={() => {
                  if (!isSearchExpanded) {
                    setIsSearchExpanded(true);
                  } else {
                    if (!searchValue.trim()) {
                      setIsSearchExpanded(false);
                    } else {
                      submitSearch();
                    }
                  }
                }}
                className="group relative p-2 rounded-full transition-all duration-200 cursor-pointer
                           hover:bg-gray-100 hover:shadow-sm hover:-translate-y-[1px] active:scale-95"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </button>
            </div>

            {/* NEW: Wishlist */}
            <button
              onClick={() => router.push('/wishlist')}
              className="group relative p-2 rounded-full transition-all duration-200 cursor-pointer
                         hover:bg-gray-100 hover:shadow-sm hover:-translate-y-[1px] active:scale-95"
              aria-label="Wishlist"
              title="Избранное"
            >
              <Heart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={handleUserClick}
              disabled={isLoading}
              className="group relative p-2 rounded-full transition-all duration-200 cursor-pointer
                         hover:bg-gray-100 hover:shadow-sm hover:-translate-y-[1px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Account"
              title={isAuthenticated ? 'Мой аккаунт' : 'Войти'}
            >
              <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="group relative p-2 rounded-full transition-all duration-200 cursor-pointer
                         hover:bg-gray-100 hover:shadow-sm hover:-translate-y-[1px] active:scale-95"
              aria-label="Shopping bag"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
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
            {/* NEW: Wishlist in mobile menu */}
            <NextLink
              href="/wishlist"
              className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-black transition-colors py-2 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="w-5 h-5" />
              Избранное
              {wishlistCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </NextLink>
          </nav>
        </div>
      )}

      {/* Cart Drawer */}
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

/* ===================== Cart Drawer stays same ===================== */
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
      <div
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity cursor-pointer ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-[80] h-full w-[90%] max-w-md transform bg-white shadow-2xl transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Корзина</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-all duration-200 cursor-pointer hover:bg-neutral-100 hover:-translate-y-[1px] active:scale-95"
            aria-label="Close cart"
          >
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