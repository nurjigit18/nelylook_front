'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title?: string;
  blurb?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function CollectionBanner({
  title = "Весеннее вдохновление\nКоллекция '25",
  blurb = 'Light layers. Relaxed structure. A new era of everyday luxury.',
  ctaLabel = 'Смотреть коллекцию',
  ctaHref,
  imageSrc = '/banners/DSC05202.jpg',
  imageAlt = 'Soft tailoring blazer set by a window',
}: Props) {
  const CTA = () =>
    ctaHref ? (
      <Link
        href={ctaHref}
        className="inline-flex items-center bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-neutral-900 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
        aria-label={ctaLabel}
      >
        {ctaLabel}
      </Link>
    ) : (
      <button
        type="button"
        className="inline-flex items-center bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-neutral-900 opacity-95 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
        aria-label={ctaLabel}
      >
        {ctaLabel}
      </button>
    );

  return (
    <section className="relative w-full">
      {/* Fluid container that scales with viewport width */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-7xl xl:max-w-[1800px] 2xl:max-w-[2000px]">
        {/* Responsive 12-col grid: image (lg:9 cols), text (lg:3 cols) */}
        <div className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-14 lg:gap-x-8">
          {/* Image side */}
          <div className="lg:col-span-9">
            <div className="overflow-hidden bg-neutral-200">
              <div className="relative w-full">
                <div className="relative aspect-[16/9] lg:aspect-[21/9] xl:aspect-[19/15]">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width:1536px) 80vw, (min-width:1280px) 75vw, (min-width:1024px) 65vw, 100vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text + CTA */}
          <div className="lg:col-span-3">
            <h2 className="whitespace-pre-wrap text-3xl font-semibold leading-tight tracking-tight md:text-4xl xl:text-[40px] 2xl:text-[44px]">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              {blurb}
            </p>
            <div className="mt-6">
              <CTA />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
