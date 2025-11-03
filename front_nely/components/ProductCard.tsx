'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { Heart } from 'lucide-react';
import { useState } from 'react';

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
  initiallyWishlisted = false,
  onToggleWishlist,
  className = 'w-[200px] sm:w-[230px] md:w-[260px] lg:w-[280px]',
  priority = false,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(initiallyWishlisted);

  function toggleWishlist() {
    const next = !wishlisted;
    setWishlisted(next);
    onToggleWishlist?.(next);
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
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
        >
          <Heart className="h-4 w-4" fill={wishlisted ? 'currentColor' : 'transparent'} />
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
