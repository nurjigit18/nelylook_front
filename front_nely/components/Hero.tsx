'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

type Slide = {
  id: string | number;
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  blurb?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type Props = {
  slides: Slide[];
  autoPlayMs?: number; // set to 0 to disable autoplay
};

export default function HeroCarousel({ slides, autoPlayMs = 7000 }: Props) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  // Ref for container width
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);

  // Motion value for sliding
  const x = useMotionValue(0);

  // Smooth slide animation on index change
  useEffect(() => {
    const target = -index * width;
    const controls = animate(x, target, {
      type: 'spring',
      stiffness: 300,
      damping: 35,
    });
    return controls.stop;
  }, [index, width, x]);

  // Autoplay
  useEffect(() => {
    if (!autoPlayMs) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), autoPlayMs);
    return () => clearInterval(timer);
  }, [count, autoPlayMs]);

  const goTo = (i: number) => setIndex((i + count) % count);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  // Decide slide based on drag distance
  const onDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = info.offset.x + info.velocity.x * 0.35; // inertia
    if (swipe > 100) prev();
    else if (swipe < -100) next();
    else goTo(index); // snap back
  };

  return (
    <section className="w-full select-none">
      <div ref={containerRef} className="relative flex h-full w-full flex-col overflow-hidden bg-black">
        {/* Slide track */}
        <motion.div
          className="flex h-full"
          style={{ x }}
          drag="x"
          dragElastic={0.06}
          dragConstraints={{ left: -width * (count - 1), right: 0 }}
          onDragEnd={onDragEnd}
          aria-roledescription="carousel"
        >
          {slides.map((s, i) => (
            <div key={s.id} className="flex w-full shrink-0 flex-col">
              {/* IMAGE */}
              <div className="relative aspect-[16/9] w-full md:aspect-[21/9] lg:aspect-[24/9]">
                <Image
                  src={s.imageSrc}
                  alt={s.imageAlt ?? ''}
                  fill
                  priority={i === index}
                  sizes="100vw"
                  className="pointer-events-none object-cover"
                />
              </div>

              {/* TEXT + CTA */}
              <div className="flex flex-1 flex-col items-center bg-white py-10 text-center">
                {s.title && (
                  <h2 className="px-6 text-3xl font-extrabold uppercase tracking-tight md:text-5xl">
                    {s.title}
                  </h2>
                )}
                {s.blurb && (
                  <p className="mt-3 max-w-2xl px-6 text-neutral-700 md:text-lg">
                    {s.blurb}
                  </p>
                )}
                {s.ctaHref && s.ctaLabel && (
                  <Link
                    href={s.ctaHref}
                    className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
                  >
                    {s.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ARROWS */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex gap-2 md:bottom-6 md:right-6">
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black text-xl leading-none text-white shadow hover:bg-neutral-800"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black text-xl leading-none text-white shadow hover:bg-neutral-800"
          >
            ›
          </button>
        </div>
      </div>

      {/* BULLETS */}
      <div className="flex items-center justify-center gap-3 bg-white py-6">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === index
                ? 'w-8 bg-neutral-900'
                : 'w-2.5 bg-neutral-300 hover:bg-neutral-500'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Helper Hook ---------------- */
function useContainerWidth<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, [ref]);

  return w;
}