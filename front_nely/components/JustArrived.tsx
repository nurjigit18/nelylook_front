// components/JustArrived.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export type Product = {
  id: string | number;
  href: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  sizeLabel?: string;
  priceFormatted: string;
  compareAtFormatted?: string;
  rating?: number;
};

type Props = {
  title?: string;
  subtitle?: string;
  products?: Product[];
};

export default function JustArrivedCarousel({
  title = 'Новинки',
  subtitle,
  products = [],
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      setCanLeft(el.scrollLeft > 0);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  const scrollStep = useMemo(() => {
    const el = scrollerRef.current;
    return el ? Math.max(320, Math.floor(el.clientWidth * 0.9)) : 800;
  }, [scrollerRef.current]);

  const doScroll = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (scrollStep || 800), behavior: 'smooth' });
  };

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 max-w-7xl xl:max-w-[1800px] 2xl:max-w-[2000px]">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>
          )}
        </div>

        {/* Empty state */}
        {!products.length && (
          <div className="text-sm text-neutral-500">Нет доступных товаров.</div>
        )}

        {!!products.length && (
          <div className="relative">
            {/* Edge fades */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Left arrow */}
            <button
              type="button"
              aria-label="Пролистать влево"
              onClick={() => doScroll(-1)}
              disabled={!canLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full border border-neutral-300 bg-white/90 p-2 shadow disabled:opacity-20 hover:bg-white transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right arrow */}
            <button
              type="button"
              aria-label="Пролистать вправо"
              onClick={() => doScroll(1)}
              disabled={!canRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full border border-neutral-300 bg-white/90 p-2 shadow disabled:opacity-40 hover:bg-white transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Scroller */}
            <div
              ref={scrollerRef}
              className="scroll-smooth overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <ul className="flex gap-4 px-2 py-4">
                {products.map((p, i) => (
                  <li key={p.id} className="snap-start">
                    <ProductCard
                      href={p.href}
                      imageSrc={p.imageSrc}
                      imageAlt={p.imageAlt}
                      title={p.title}
                      sizeLabel={p.sizeLabel}
                      priceFormatted={p.priceFormatted}
                      compareAtFormatted={p.compareAtFormatted}
                      rating={p.rating}
                      priority={i < 2}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}