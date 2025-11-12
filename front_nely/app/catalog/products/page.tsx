'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { X, SlidersHorizontal } from 'lucide-react';

type ColorVariant = {
  id: number;
  slug: string;
  name: string;
  color_id: number;
  color_name: string;
  color_code: string;
  primary_image: string | null;
  base_price: string;
  sale_price: string | null;
  available_sizes: string[];
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  category: string | null;
  season: string;
  stock_quantity: number;
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
  
  // State
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load filters on mount
  useEffect(() => {
    loadFilters();
  }, []);

  // Load products when filters change
  useEffect(() => {
    if (filters) {
      loadColorVariants();
    }
  }, [selectedCategories, selectedColors, selectedSizes, priceRange, selectedSeasons, searchQuery, page]);

  async function loadFilters() {
    try {
      const res = await fetch('/api/catalog/products/filters');
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to load filters' }));
        throw new Error(errorData.detail || 'Failed to load filters');
      }
      
      const data = await res.json();
      console.log('✅ Filters loaded:', data);
      
      setFilters(data);
      
      if (data.price_range) {
        const min = Math.floor(data.price_range.min_price || 0);
        const max = Math.ceil(data.price_range.max_price || 10000);
        setPriceRange([min, max]);
        setTempPriceRange([min, max]);
      }
    } catch (err: any) {
      console.error('❌ Error loading filters:', err);
      setError(err.message);
    }
  }

  async function loadColorVariants() {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategories.length) params.append('category', selectedCategories.join(','));
      // ✅ FIXED: Send as 'colors' - API route will transform to 'color'
      if (selectedColors.length) params.append('colors', selectedColors.join(','));
      // ✅ FIXED: Send as 'sizes' - API route will transform to 'size'
      if (selectedSizes.length) params.append('sizes', selectedSizes.join(','));
      if (selectedSeasons.length) params.append('season', selectedSeasons.join(','));
      
      // Only add price filters if they differ from the full range
      if (filters?.price_range) {
        const fullMin = Math.floor(filters.price_range.min_price || 0);
        const fullMax = Math.ceil(filters.price_range.max_price || 10000);
        
        if (priceRange[0] > fullMin) {
          params.append('min_price', priceRange[0].toString());
        }
        if (priceRange[1] < fullMax) {
          params.append('max_price', priceRange[1].toString());
        }
      }
      
      params.append('page', page.toString());
      params.append('page_size', '20');
      
      console.log('📡 Loading color variants with params:', params.toString());
      
      const res = await fetch(`/api/catalog/products/by-color?${params.toString()}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Failed to load products' }));
        throw new Error(errorData.detail || 'Failed to load products');
      }
      
      const data = await res.json();
      console.log('✅ Color variants response:', data);
      
      // Handle both paginated and non-paginated responses
      let variants: ColorVariant[] = [];
      
      if (Array.isArray(data)) {
        // Direct array response
        variants = data;
        setHasMore(false);
      } else if (data.results && Array.isArray(data.results)) {
        // Paginated response
        variants = data.results;
        setHasMore(!!data.next);
      } else if (data.data && Array.isArray(data.data)) {
        // Wrapped response
        variants = data.data;
        setHasMore(false);
      }
      
      console.log('📦 Variant count:', variants.length);
      
      if (page === 1) {
        setColorVariants(variants);
      } else {
        setColorVariants(prev => [...prev, ...variants]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('❌ Error loading color variants:', err);
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
    if (filters?.price_range) {
      const min = Math.floor(filters.price_range.min_price || 0);
      const max = Math.ceil(filters.price_range.max_price || 10000);
      setPriceRange([min, max]);
      setTempPriceRange([min, max]);
    }
    setSearchQuery('');
    setPage(1);
  }

  function toggleCategory(id: number) {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setPage(1);
  }

  function toggleColor(id: number) {
    setSelectedColors(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setPage(1);
  }

  function toggleSize(id: number) {
    setSelectedSizes(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setPage(1);
  }

  function toggleSeason(value: string) {
    setSelectedSeasons(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
    setPage(1);
  }

  function applyFilters() {
    setPriceRange(tempPriceRange);
    setFilterDrawerOpen(false);
    setPage(1);
  }

  if (error && !filters) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Ошибка: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Filter Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Каталог</h1>
          {colorVariants.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Найдено {colorVariants.length} вариантов товаров
            </p>
          )}
        </div>
        
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Фильтры
        </button>
      </div>

      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || selectedSeasons.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedCategories.map(id => {
            const cat = filters?.categories.find(c => c.category_id === id);
            return cat ? (
              <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {cat.category_name}
                <button onClick={() => toggleCategory(id)} className="hover:text-red-600 cursor-pointer">×</button>
              </span>
            ) : null;
          })}
          {selectedColors.map(id => {
            const color = filters?.colors.find(c => c.color_id === id);
            return color ? (
              <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {color.color_name}
                <button onClick={() => toggleColor(id)} className="hover:text-red-600 cursor-pointer">×</button>
              </span>
            ) : null;
          })}
          {selectedSizes.map(id => {
            const size = filters?.sizes.find(s => s.size_id === id);
            return size ? (
              <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                {size.size_name}
                <button onClick={() => toggleSize(id)} className="hover:text-red-600 cursor-pointer">×</button>
              </span>
            ) : null;
          })}
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-red-600 hover:underline cursor-pointer"
          >
            Очистить все
          </button>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        selectedCategories={selectedCategories}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
        selectedSeasons={selectedSeasons}
        priceRange={tempPriceRange}
        searchQuery={searchQuery}
        onToggleCategory={toggleCategory}
        onToggleColor={toggleColor}
        onToggleSize={toggleSize}
        onToggleSeason={toggleSeason}
        onPriceRangeChange={setTempPriceRange}
        onSearchChange={setSearchQuery}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
      />

      {/* Products Grid */}
      <main>
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Ошибка: {error}</p>
          </div>
        ) : colorVariants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Товары не найдены</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {colorVariants.map((variant) => {
                const displayPrice = variant.sale_price || variant.base_price;
                const originalPrice = variant.sale_price ? variant.base_price : null;
                const imageUrl = variant.primary_image || '/placeholder-product.jpg';
                const href = `/catalog/products/${variant.slug}?color=${variant.color_id}`;
                
                return (
                  <ProductCard
                    key={`${variant.id}-${variant.color_id}`}
                    href={href}
                    imageSrc={imageUrl}
                    imageAlt={`${variant.name} - ${variant.color_name}`}
                    title={`${variant.name} - ${variant.color_name}`}
                    sizeLabel={variant.category || ''}
                    priceFormatted={displayPrice}
                    compareAtFormatted={originalPrice || undefined}
                    className="w-full"
                  />
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loading}
                  className="px-6 py-3 bg-black text-white rounded-lg disabled:opacity-50 cursor-pointer hover:bg-gray-800 transition-colors"
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
}) {
  const fullMin = filters?.price_range ? Math.floor(filters.price_range.min_price || 0) : 0;
  const fullMax = filters?.price_range ? Math.ceil(filters.price_range.max_price || 10000) : 10000;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[90%] max-w-md transform bg-white shadow-2xl transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Фильтры и Сортировка</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-140px)] p-4 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg cursor-text"
            />
          </div>

          {filters?.categories && filters.categories.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Категории</h3>
              <div className="space-y-2">
                {filters.categories.map((cat) => (
                  <label key={cat.category_id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.category_id)}
                      onChange={() => onToggleCategory(cat.category_id)}
                      className="rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm">{cat.category_name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {filters?.price_range && (
            <div>
              <h3 className="font-medium mb-3">Цена</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{priceRange[0]} сом</span>
                  <span>{priceRange[1]} сом</span>
                </div>
                
                <div className="relative pt-2 pb-6">
                  <input
                    type="range"
                    min={fullMin}
                    max={fullMax}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newMin = Math.min(Number(e.target.value), priceRange[1] - 100);
                      onPriceRangeChange([newMin, priceRange[1]]);
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-10 cursor-pointer range-slider"
                  />
                  
                  <input
                    type="range"
                    min={fullMin}
                    max={fullMax}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = Math.max(Number(e.target.value), priceRange[0] + 100);
                      onPriceRangeChange([priceRange[0], newMax]);
                    }}
                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto z-10 cursor-pointer range-slider"
                  />
                  
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="absolute h-2 bg-black rounded-full"
                      style={{
                        left: `${((priceRange[0] - fullMin) / (fullMax - fullMin)) * 100}%`,
                        right: `${100 - ((priceRange[1] - fullMin) / (fullMax - fullMin)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border rounded cursor-text"
                    placeholder="От"
                    min={fullMin}
                    max={priceRange[1]}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 border rounded cursor-text"
                    placeholder="До"
                    min={priceRange[0]}
                    max={fullMax}
                  />
                </div>
              </div>
            </div>
          )}

          {filters?.sizes && filters.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Размеры</h3>
              <div className="grid grid-cols-3 gap-2">
                {filters.sizes.map((size) => (
                  <button
                    key={size.size_id}
                    onClick={() => onToggleSize(size.size_id)}
                    className={`px-3 py-2 border rounded text-sm cursor-pointer transition-all ${
                      selectedSizes.includes(size.size_id)
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 hover:border-black hover:bg-gray-50'
                    }`}
                  >
                    {size.size_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filters?.colors && filters.colors.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Цвета</h3>
              <div className="grid grid-cols-6 gap-3">
                {filters.colors.map((color) => (
                  <button
                    key={color.color_id}
                    onClick={() => onToggleColor(color.color_id)}
                    className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
                      selectedColors.includes(color.color_id)
                        ? 'border-black ring-2 ring-black ring-offset-2'
                        : 'border-gray-300 hover:border-gray-600'
                    }`}
                    style={{ backgroundColor: color.color_code }}
                    title={color.color_name}
                  />
                ))}
              </div>
            </div>
          )}

          {filters?.seasons && filters.seasons.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Сезон</h3>
              <div className="space-y-2">
                {filters.seasons.map((season) => (
                  <label key={season.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedSeasons.includes(season.value)}
                      onChange={() => onToggleSeason(season.value)}
                      className="rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm">{season.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 space-y-2">
          <button
            onClick={onClearFilters}
            className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Очистить
          </button>
          <button
            onClick={onApplyFilters}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
          >
            Показать
          </button>
        </div>
      </aside>
    </>
  );
} 