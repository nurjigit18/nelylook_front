'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export type ProductCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  sizeLabel?: string;           // e.g. "M – 2XL"
  priceFormatted: string;       // e.g. "$29.99"
  compareAtFormatted?: string;  // e.g. "$49.99"
  /** kept for backward-compat but unused now */
  rating?: number;
  
  // NEW: Required for wishlist functionality
  productId?: number;           // Product ID for API calls
  variantId?: number;           // Default variant ID (if known)
  
  initiallyWishlisted?: boolean;
  onToggleWishlist?: (next: boolean) => void;

  className?: string; // optional width override
  priority?: boolean;
};

export default function ProductCard({
  href,
  imageSrc,
  imageAlt,
  title,
  sizeLabel,
  priceFormatted,
  compareAtFormatted,
  productId,
  variantId,
  initiallyWishlisted = false,
  onToggleWishlist,
  className = 'w-[200px] sm:w-[230px] md:w-[260px] lg:w-[280px]',
  priority = false,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(initiallyWishlisted);
  const [loading, setLoading] = useState(false);
  const [defaultVariantId, setDefaultVariantId] = useState<number | null>(variantId || null);

  // Check wishlist status on mount if we have a variant ID
  useEffect(() => {
    if (defaultVariantId) {
      checkWishlistStatus(defaultVariantId);
    } else if (productId) {
      // If no variant ID provided, fetch the first variant
      fetchDefaultVariant();
    }
  }, [defaultVariantId, productId]);

  async function fetchDefaultVariant() {
    if (!productId) return;
    
    try {
      const res = await fetch(`/api/catalog/products/${productId}/variants`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const firstVariantId = data.results[0].id;
          setDefaultVariantId(firstVariantId);
        }
      }
    } catch (error) {
      console.error('Error fetching default variant:', error);
    }
  }

  async function checkWishlistStatus(vId: number) {
    try {
      const res = await fetch(`/api/wishlist/exists?variant=${vId}`);
      if (res.ok) {
        const data = await res.json();
        setWishlisted(data.exists || false);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  }

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();

    if (!defaultVariantId) {
      console.warn('No variant ID available for wishlist operation');
      alert('Не удалось добавить в избранное. Попробуйте позже.');
      return;
    }

    setLoading(true);

    try {
      if (wishlisted) {
        // Remove from wishlist
        const res = await fetch(`/api/wishlist/by-variant/${defaultVariantId}`, {
          method: 'DELETE',
        });

        if (res.ok || res.status === 204) {
          setWishlisted(false);
          onToggleWishlist?.(false);
          
          // Trigger a custom event to update header count
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ variant: defaultVariantId }),
        });

        if (res.ok) {
          setWishlisted(true);
          onToggleWishlist?.(true);
          
          // Trigger a custom event to update header count
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } else {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to add to wishlist');
        }
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      alert(error.message || 'Ошибка при обновлении избранного');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`group ${className}`}>
      {/* Image */}
      <div className="relative aspect-[4/6] w-full overflow-hidden bg-neutral-200">
        <NextLink href={href} aria-label={`${title} details`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(min-width:1536px) 280px, (min-width:1280px) 260px, (min-width:1024px) 240px, (min-width:768px) 230px, 200px"
          />
        </NextLink>

        {/* Wishlist */}
        <button
          type="button"
          onClick={toggleWishlist}
          disabled={loading || !defaultVariantId}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart 
            className="h-4 w-4 transition-colors" 
            fill={wishlisted ? '#ef4444' : 'transparent'} 
            color={wishlisted ? '#ef4444' : 'currentColor'}
          />
        </button>
      </div>

      {/* Meta */}
      <div className="mt-2.5 text-center">
        {/* Price — smaller but heavier */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-base font-bold tracking-tight">{priceFormatted}</span>
          <span className="text-base font-bold tracking-tight">с̲</span>
        </div>

        {/* Compare at price — lighter & smaller */}
        {compareAtFormatted && (
          <div className="mt-0.1 flex items-center justify-center gap-1 text-[11px] text-neutral-500 line-through">
            <span>{compareAtFormatted}</span>
            <span>с̲</span>
          </div>
        )}

        {/* Product Title — semi-bold (or switch to font-normal if you prefer) */}
        <NextLink href={href} className="block mt-1.0">
          <h3 className="text-sm font-light leading-snug tracking-tight hover:underline mb-10">
            {title}
          </h3>
        </NextLink>

        {/* Rating removed (no star / score) */}
      </div>
    </div>
  );
}