'use client';

import Image from 'next/image';
import NextLink from 'next/link';

type Tile = {
  title: string;
  blurb: string;
  imageSrc: string;
  imageAlt: string;
  href?: string; // optional
};

export default function EditorialTiles({
  items = [
    {
      title: 'Весна 2025',
      blurb:
        'Начните день с лёгкостью. Лёгкие хлопковые модели идеально подойдут для пробежек за кофе и ведения дневника.',
      imageSrc: '/tiles/DSC05068.JPG',
      imageAlt: 'Woman in soft loungewear drinking coffee by the window',
    },
    {
      title: 'В трендах',
      blurb:
        'Минималистский пошив поможет вам сохранять собранность и собранность, где бы ни находился ваш офис.',
      imageSrc: '/tiles/DSC05424.JPG',
      imageAlt: 'Cream blazer set at a desk',
    },
    {
      title: 'Все для вечера',
      blurb:
        'Легкие слои с подходящим лаком для походов в галерею или неторопливых ужинов в ресторане.',
      imageSrc: '/tiles/DSC06087.JPG',
      imageAlt: 'Black satin set in a warm-lit corridor',
    },
    {
      title: 'На каждый день',
      blurb:
        'Вещи, которые не будут лишними, и которые всегда с вами. Для магазинов, книг и поздних завтраков.',
      imageSrc: '/tiles/DSC06197.JPG',
      imageAlt: 'Cozy reading at home in a sweatshirt set',
    },
  ],
}: {
  items?: Tile[];
}) {
  const SeeMore = ({ href }: { href?: string }) =>
    href ? (
      <NextLink
        href={href}
        className="mt-6 inline-block text-sm underline underline-offset-4 hover:opacity-80"
        aria-label="See more"
      >
        See More
      </NextLink>
    ) : (
      <span className="mt-6 inline-block cursor-default text-sm underline underline-offset-4 opacity-60">
        Узнать больше
      </span>
    );

  const CardImage = ({ it, idx }: { it: Tile; idx: number }) => {
    const img = (
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={it.imageSrc}
          alt={it.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          // 4-up xl ≈ 25vw, 2-up md ≈ 50vw
          sizes="(min-width:1536px) 25vw, (min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
          priority={idx === 0}
        />
      </div>
    );
    return it.href ? (
      <NextLink href={it.href} aria-label={`${it.title} – details`}>
        {img}
      </NextLink>
    ) : (
      img
    );
  };

  return (
    <section className="relative">
      {/* Fluid container that scales up on ultrawide screens */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-16 py-16 lg:py-24 max-w-7xl xl:max-w-[1800px] 2xl:max-w-[2000px]">
        {/* 1 col (mobile), 2 col (md), 3 col (lg), 4 col (xl) */}
        <div className="grid grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it, idx) => (
            <article key={idx} className="group">
              {/* Image */}
              <div className="overflow-hidden bg-neutral-200">
                <CardImage it={it} idx={idx} />
              </div>

              {/* Text block */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold tracking-tight">{it.title}</h3>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                  {it.blurb}
                </p>
                <SeeMore href={it.href} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
