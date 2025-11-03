'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

interface Product {
  id: number;
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  sizeLabel: string;
  priceFormatted: string;
  compareAtFormatted?: string;
  rating: number;
}

interface FilterOptions {
  categories: { id: number; name: string }[];
  colors: { id: number; name: string; code: string }[];
  sizes: { id: number; name: string }[];
  priceRange: { min: number; max: number };
  seasons: { value: string; label: string }[];
}

interface ProductListPageProps {
  initialProducts: Product[];
  filters: FilterOptions;
  totalCount: number;
}

export default function ProductListPage({
  initialProducts,
  filters,
  totalCount,
}: ProductListPageProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceRange.min,
    filters.priceRange.max,
  ]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  // Filter toggle handlers
  const toggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleColor = (id: number) => {
    setSelectedColors(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSize = (id: number) => {
    setSelectedSizes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSeason = (value: string) => {
    setSelectedSeasons(prev =>
      prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedSeasons([]);
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedSeasons.length > 0 ||
    priceRange[0] !== filters.priceRange.min ||
    priceRange[1] !== filters.priceRange.max;

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories.join(','));
      }
      if (selectedColors.length > 0) {
        params.append('color', selectedColors.join(','));
      }
      if (selectedSizes.length > 0) {
        params.append('size', selectedSizes.join(','));
      }
      if (selectedSeasons.length > 0) {
        params.append('season', selectedSeasons.join(','));
      }
      if (priceRange[0] !== filters.priceRange.min) {
        params.append('min_price', priceRange[0].toString());
      }
      if (priceRange[1] !== filters.priceRange.max) {
        params.append('max_price', priceRange[1].toString());
      }
      params.append('ordering', sortBy);

      try {
        const response = await fetch(`/api/catalog/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [selectedCategories, selectedColors, selectedSizes, selectedSeasons, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold">Каталог</h1>
          <p className="mt-2 text-neutral-600">
            {totalCount} {totalCount === 1 ? 'товар' : 'товаров'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              {/* Filter Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-neutral-600 underline hover:text-black"
                  >
                    Очистить
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Categories */}
                {filters.categories.length > 0 && (
                  <div className="border-b pb-6">
                    <h3 className="mb-3 font-medium">Категории</h3>
                    <div className="space-y-2">
                      {filters.categories.map((cat) => (
                        <label key={cat.id} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                            className="h-4 w-4 rounded border-neutral-300"
                          />
                          <span className="text-sm">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {filters.colors.length > 0 && (
                  <div className="border-b pb-6">
                    <h3 className="mb-3 font-medium">Цвет</h3>
                    <div className="flex flex-wrap gap-2">
                      {filters.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => toggleColor(color.id)}
                          className={`group relative h-8 w-8 rounded-full border-2 transition-transform ${
                            selectedColors.includes(color.id)
                              ? 'border-black scale-110'
                              : 'border-neutral-300 hover:border-black'
                          }`}
                          title={color.name}
                        >
                          <div
                            className="h-full w-full rounded-full"
                            style={{ backgroundColor: color.code }}
                          />
                          {selectedColors.includes(color.id) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="h-4 w-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {filters.sizes.length > 0 && (
                  <div className="border-b pb-6">
                    <h3 className="mb-3 font-medium">Размер</h3>
                    <div className="flex flex-wrap gap-2">
                      {filters.sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => toggleSize(size.id)}
                          className={`min-w-[48px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            selectedSizes.includes(size.id)
                              ? 'border-black bg-black text-white'
                              : 'border-neutral-300 bg-white text-black hover:border-black'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seasons */}
                {filters.seasons.length > 0 && (
                  <div className="border-b pb-6">
                    <h3 className="mb-3 font-medium">Сезон</h3>
                    <div className="space-y-2">
                      {filters.seasons.map((season) => (
                        <label key={season.value} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSeasons.includes(season.value)}
                            onChange={() => toggleSeason(season.value)}
                            className="h-4 w-4 rounded border-neutral-300"
                          />
                          <span className="text-sm">{season.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="pb-6">
                  <h3 className="mb-3 font-medium">Цена</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min={filters.priceRange.min}
                      max={filters.priceRange.max}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>{priceRange[0]} сом</span>
                      <span>{priceRange[1]} сом</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Button & Sort */}
            <div className="mb-6 flex items-center justify-between gap-4 lg:justify-end">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Фильтры</span>
                {hasActiveFilters && (
                  <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                    {selectedCategories.length +
                      selectedColors.length +
                      selectedSizes.length +
                      selectedSeasons.length}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm"
              >
                <option value="newest">Новинки</option>
                <option value="price_asc">Цена: по возрастанию</option>
                <option value="price_desc">Цена: по убыванию</option>
                <option value="name">По названию</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-neutral-600">Загрузка...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <p className="text-lg text-neutral-600">Товары не найдены</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="rounded-lg bg-black px-6 py-2 text-white hover:bg-neutral-800"
                  >
                    Очистить фильтры
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Filter Content - Same as desktop */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Add same filter sections as desktop sidebar */}
                <p className="text-sm text-neutral-600">Фильтры (мобильная версия)</p>
              </div>

              {/* Footer */}
              <div className="border-t p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full rounded-lg bg-black py-3 text-white"
                >
                  Показать {products.length} товаров
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}