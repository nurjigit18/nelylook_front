'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface ProductImage {
  id: number;
  url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
  color_id?: number;
}

interface Color {
  id: number;
  name: string;
  code: string;
}

interface Size {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  sale_price?: string | null;
  description: string;
  short_description?: string;
  available_colors: Color[];
  available_sizes: Size[];
  images: ProductImage[];
  category_name?: string;
  season_display?: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  rating?: number;  // Make rating optional
}

interface RelatedProduct {
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

interface ProductDetailPageProps {
  product: Product;
  relatedProducts?: RelatedProduct[];
  whatsappNumber?: string;
}

// Helper function to clean image URLs
const cleanImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder-product.jpg';
  return url.replace(/\?$/, '').trim();
};

export default function ProductDetailPage({ 
  product, 
  relatedProducts = [],
  whatsappNumber = '+996700123456' 
}: ProductDetailPageProps) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    product.available_colors[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    product.available_sizes[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<ProductImage | null>(
    product.images.find(img => img.is_primary) || product.images[0] || null
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('description');

  // Filter images by selected color
  const colorImages = product.images.filter(
    img => selectedColor && img.color_id === selectedColor.id
  );
  const displayImages = colorImages.length > 0 ? colorImages : product.images;

  // Calculate discount percentage
  const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.base_price);
  const discountPercentage = hasDiscount
    ? Math.round((1 - parseFloat(product.sale_price!) / parseFloat(product.base_price)) * 100)
    : 0;

  const currentPrice = product.sale_price || product.base_price;

  // Handle quantity change
  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  // WhatsApp message handler
  const handleBuyNow = () => {
    const message = `Здравствуйте! Я хочу купить:\n\n` +
      `🛍️ ${product.name}\n` +
      `🎨 Цвет: ${selectedColor?.name || 'не выбран'}\n` +
      `📏 Размер: ${selectedSize?.name || 'не выбран'}\n` +
      `🔢 Количество: ${quantity}\n` +
      `💰 Цена: ${currentPrice} сом\n\n` +
      `Ссылка: ${window.location.href}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-neutral-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/catalog/products" className="hover:text-black">
            Shop
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              {mainImage ? (
                <Image
                  src={cleanImageUrl(mainImage.url)}
                  alt={mainImage.alt_text || product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-400">
                  No image available
                </div>
              )}
              
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                  Save {discountPercentage}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {displayImages.slice(0, 3).map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setMainImage(img)}
                    className={`relative aspect-[3/4] overflow-hidden bg-neutral-100 ${
                      mainImage?.id === img.id ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <Image
                      src={cleanImageUrl(img.url)}
                      alt={img.alt_text || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 16vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {/* Title & Rating */}
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-lg font-medium">{product.rating}</span>
                <span className="ml-1 text-yellow-500">★</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold">{currentPrice} сом</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-neutral-500 line-through">
                    {product.base_price} сом
                  </span>
                  <span className="rounded-full bg-red-100 px-2 py-1 text-sm font-semibold text-red-600">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Size Selection */}
            {product.available_sizes.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Available Size</span>
                  <span className="text-sm text-neutral-600">
                    {product.available_sizes.map(s => s.name).join(' — ')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.available_sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[60px] rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        selectedSize?.id === size.id
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

            {/* Color Selection */}
            {product.available_colors.length > 0 && (
              <div className="mt-6">
                <span className="mb-3 block text-sm font-medium">Available Color</span>
                <div className="flex flex-wrap gap-2">
                  {product.available_colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative h-10 w-10 rounded-full border-2 transition-transform ${
                        selectedColor?.id === color.id
                          ? 'border-black scale-110'
                          : 'border-neutral-300 hover:border-black'
                      }`}
                      title={color.name}
                    >
                      <div
                        className="h-full w-full rounded-full"
                        style={{ backgroundColor: color.code }}
                      />
                      {selectedColor?.id === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="h-5 w-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="mt-8 space-y-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Количество:</span>
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-2 hover:bg-neutral-100"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-neutral-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 hover:bg-neutral-100"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize || !selectedColor}
                className="w-full rounded-lg bg-black py-4 text-center font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Купить сейчас
              </button>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-3">
                <button
                  disabled={!selectedSize || !selectedColor}
                  className="flex-1 rounded-lg border border-black bg-white py-4 text-center font-medium text-black transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Добавить в корзину
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="rounded-lg border border-neutral-300 p-4 transition-colors hover:bg-neutral-50"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`h-6 w-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`}
                  />
                </button>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="mt-8 space-y-4 border-t pt-6">
              {/* Description & Fit */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection('description')}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">Описание и характеристики</span>
                  <span className="text-2xl">{expandedSection === 'description' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'description' && (
                  <div className="pb-4 text-sm text-neutral-700">
                    {product.description || product.short_description || 'Нет описания'}
                  </div>
                )}
              </div>

              {/* Materials & Care */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection('materials')}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="font-medium">Материалы и уход</span>
                  <span className="text-2xl">{expandedSection === 'materials' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'materials' && (
                  <div className="space-y-2 pb-4 text-sm text-neutral-700">
                    <p>• 100% хлопок, ответственный источник</p>
                    <p>• Машинная стирка холодной водой. Не отбеливать. Сушить при низкой температуре.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Похожие товары</h2>
              <Link href="/catalog" className="text-sm underline hover:text-neutral-600">
                Смотреть все
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}