// app/catalog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { X, SlidersHorizontal } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  category_name: string;
  base_price: string;
  sale_price: string | null;
  images?: Array<{
    id: number;
    url: string;
    alt_text: string;
    is_primary: boolean;
  }>;
};

type Color = {
  color_id: number;
  color_name: string;
  color_code: string;
};

type Size = {
  size_id: number;
  size_name: string;
};

type Category = {
  category_id: number;
  category_name: string;
};

type Season = {
  value: string;
  label: string;
};

type Filters = {
  price_range: {
    min_price: number;
    max_price: number;
  };
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  seasons: Season[];
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // data
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // filter state
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [onSale, setOnSale] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  // pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // load filters on mount
  useEffect(() => {
    loadFilters();
  }, []);
  useEffect(() => {
    const saleParam = searchParams.get('on_sale');
    const newParam = searchParams.get('new_arrival');
  
    if (saleParam === 'true') {
      setOnSale(true);
    }
    if (newParam === 'true') {
      setIsNewArrival(true);
    }
  }, [searchParams]);

  // load products when filters change
  useEffect(() => {
    if (filters) {
      loadProducts();
    }
  }, [
    selectedCategories,
    selectedColors,
    selectedSizes,
    priceRange,
    selectedSeasons,
    searchQuery,
    onSale,         
    isNewArrival,    
    page,
  ]);
  

  async function loadFilters() {
    try {
      const res = await fetch('/api/catalog/products/filters');

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to load filters' }));
        throw new Error(errorData.detail || 'Failed to load filters');
      }

      const data = await res.json();
      setFilters(data);

      if (data.price_range) {
        setPriceRange([
          data.price_range.min_price || 0,
          data.price_range.max_price || 10000,
        ]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (searchQuery) params.append('search', searchQuery);

      // IMPORTANT: names must match backend
      if (selectedCategories.length) {
        params.append('category', selectedCategories.join(','));
      }
      if (selectedColors.length) {
        params.append('color', selectedColors.join(','));
      }
      if (selectedSizes.length) {
        params.append('size', selectedSizes.join(','));
      }
      if (selectedSeasons.length) {
        params.append('season', selectedSeasons.join(','));
      }
      if (onSale) params.append('on_sale', 'true');
      if (isNewArrival) params.append('new_arrival', 'true');

      // price
      if (priceRange[0] > 0) params.append('min_price', priceRange[0].toString());
      // you can use filters?.price_range.max_price as upper bound
      if (priceRange[1] < 1000000) params.append('max_price', priceRange[1].toString());

      // pagination
      params.append('page', page.toString());
      params.append('page_size', '20');

      const res = await fetch(`/api/catalog/products?${params.toString()}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to load products' }));
        throw new Error(errorData.detail || 'Failed to load products');
      }

      const data = await res.json();
      const productList = data.results || [];

      if (page === 1) {
        setProducts(productList);
      } else {
        setProducts((prev) => [...prev, ...productList]);
      }

      setHasMore(!!data.next);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedSeasons([]);
    setOnSale(false);
    setIsNewArrival(false);
    if (filters?.price_range) {
      setPriceRange([
        filters.price_range.min_price || 0,
        filters.price_range.max_price || 10000,
      ]);
    }
    setSearchQuery('');
    setPage(1);
  }

  function toggleCategory(id: number) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPage(1);
  }

  function toggleColor(id: number) {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPage(1);
  }

  function toggleSize(id: number) {
    setSelectedSizes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setPage(1);
  }

  function toggleSeason(value: string) {
    setSelectedSeasons((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
    setPage(1);
  }

  function applyFilters() {
    setFilterDrawerOpen(false);
    setPage(1);
    // loadProducts will run because deps changed
  }

  return (
    <div className="container mx-auto px-12 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Каталог</h1>

        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
        </button>
      </div>

      {/* Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        selectedCategories={selectedCategories}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
        selectedSeasons={selectedSeasons}
        priceRange={priceRange}
        searchQuery={searchQuery}
        onToggleCategory={toggleCategory}
        onToggleColor={toggleColor}
        onToggleSize={toggleSize}
        onToggleSeason={toggleSeason}
        onPriceRangeChange={setPriceRange}
        onSearchChange={setSearchQuery}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
        onSale={onSale}
        onToggleOnSale={setOnSale}
      />

      {/* Products */}
      <main>
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Ошибка: {error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Товары не найдены</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2">
              {products.map((product) => {
                const primaryImage = product.images?.find((img) => img.is_primary);
                const image = primaryImage || product.images?.[0];

                const basePrice = product.base_price ? parseFloat(product.base_price) : 0;
                const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;

                const displayPrice =
                  salePrice && salePrice < basePrice ? salePrice : basePrice;
                const hasDiscount = salePrice && salePrice < basePrice;

                return (
                  <ProductCard
                    key={product.id}
                    href={`/catalog/products/${product.slug || product.id}`}
                    imageSrc={image?.url || '/placeholder-product.jpg'}
                    imageAlt={image?.alt_text || product.name}
                    title={product.name}
                    priceFormatted={`${displayPrice.toFixed(0)} сом`}
                    compareAtFormatted={
                      hasDiscount ? `${basePrice.toFixed(0)} сом` : undefined
                    }
                    className="w-full"
                  />
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-black text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Загрузка...' : 'Показать ещё'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ===================== Filter Drawer ===================== */

function FilterDrawer({
  open,
  onClose,
  filters,
  selectedCategories,
  selectedColors,
  selectedSizes,
  selectedSeasons,
  priceRange,
  searchQuery,
  onToggleCategory,
  onToggleColor,
  onToggleSize,
  onToggleSeason,
  onPriceRangeChange,
  onSearchChange,
  onClearFilters,
  onApplyFilters,
  onSale,
  onToggleOnSale,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters | null;
  selectedCategories: number[];
  selectedColors: number[];
  selectedSizes: number[];
  selectedSeasons: string[];
  priceRange: [number, number];
  searchQuery: string;
  onToggleCategory: (id: number) => void;
  onToggleColor: (id: number) => void;
  onToggleSize: (id: number) => void;
  onToggleSeason: (value: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  onSale: boolean;
  onToggleOnSale: (v: boolean) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[90%] max-w-md transform bg-white shadow-2xl transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Фильтры и Сортировка</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-140px)] p-4 space-y-6">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* On sale */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onSale}
                onChange={(e) => onToggleOnSale(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Только со скидкой</span>
            </label>
          </div>

          {/* Categories */}
          {filters?.categories && filters.categories.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Категории</h3>
              <div className="space-y-2">
                {filters.categories.map((cat) => (
                  <label key={cat.category_id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.category_id)}
                      onChange={() => onToggleCategory(cat.category_id)}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-sm">{cat.category_name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {filters?.sizes && filters.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Размеры</h3>
              <div className="grid grid-cols-3 gap-2">
                {filters.sizes.map((size) => (
                  <button
                    key={size.size_id}
                    onClick={() => onToggleSize(size.size_id)}
                    className={`px-3 py-2 border rounded text-sm ${
                      selectedSizes.includes(size.size_id)
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size.size_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {filters?.colors && filters.colors.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Цвета</h3>
              <div className="grid grid-cols-6 gap-3">
                {filters.colors.map((color) => (
                  <button
                    key={color.color_id}
                    onClick={() => onToggleColor(color.color_id)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColors.includes(color.color_id)
                        ? 'border-black ring-2 ring-black ring-offset-2'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.color_code }}
                    title={color.color_name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Seasons */}
          {filters?.seasons && filters.seasons.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Сезон</h3>
              <div className="space-y-2">
                {filters.seasons.map((season) => (
                  <label key={season.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSeasons.includes(season.value)}
                      onChange={() => onToggleSeason(season.value)}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-sm">{season.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price range */}
          {filters?.price_range && (
            <div>
              <h3 className="font-medium mb-3">Цена</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      onPriceRangeChange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="От"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      onPriceRangeChange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="До"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 space-y-2">
          <button
            onClick={onClearFilters}
            className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Очистить
          </button>
          <button
            onClick={onApplyFilters}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Показать
          </button>
        </div>
      </aside>
    </>
  );
}
