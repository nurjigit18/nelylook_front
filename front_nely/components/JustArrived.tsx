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
  subtitle = 'Pieces made to move with you: softly structured, consciously crafted.',
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
        <div className="mb-6">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{title}</h2>
        </div>

        {!products.length && (
          <div className="text-sm text-neutral-500">No products yet.</div>
        )}

        {!!products.length && (
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-0 bg-gradient-to-l from-white to-transparent" />

            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => doScroll(-1)}
              disabled={!canLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full border border-neutral-300 bg-white/90 p-2 shadow disabled:opacity-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => doScroll(1)}
              disabled={!canRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full border border-neutral-300 bg-white/90 p-2 shadow disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={scrollerRef}
              className="scroll-smooth overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
            >
              <ul className="flex gap-2 px-8 py-4">
                {products.map((p, i) => (
                  <li key={p.id} className="snap-start">
                    <ProductCard
                      href={p.href}
                      imageSrc={p.imageSrc}
                      imageAlt={p.imageAlt}
                      title={p.title}
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