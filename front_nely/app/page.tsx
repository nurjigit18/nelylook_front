// app/page.tsx (HOMEPAGE)
import Hero from "@/components/Hero";
import EditorialTiles from "@/components/EditorialTiles";
import CollectionBanner from "@/components/CollectionBanner";
import JustArrivedCarousel, { type Product } from '@/components/JustArrived';

// Sample products for homepage - replace with actual data fetch if needed
const products: Product[] = [
  {
    id: 1,
    href: '/product/relaxed-cotton-blazer',
    imageSrc: '/catalog/DSC05068.jpg',
    imageAlt: 'Relaxed Cotton Blazer in camel',
    title: 'Relaxed Cotton Blazer',
    priceFormatted: '2999 сом',
    compareAtFormatted: '4999 сом',
    rating: 4.9,
  },
  {
    id: 2,
    href: '/product/wool-coat',
    imageSrc: '/catalog/DSC06087.jpg',
    imageAlt: 'Wool Coat stone color',
    title: 'Wool Coat',
    priceFormatted: '12900 сом',
    compareAtFormatted: '17900 сом',
    rating: 4.7,
  },
  {
    id: 3,
    href: '/product/wool-coat-2',
    imageSrc: '/catalog/DSC06087.jpg',
    imageAlt: 'Wool Coat stone color',
    title: 'Premium Wool Coat Collection',
    priceFormatted: '12900 сом',
    compareAtFormatted: '17900 сом',
    rating: 4.7,
  },
  {
    id: 4,
    href: '/product/wool-coat-3',
    imageSrc: '/catalog/DSC06087.jpg',
    imageAlt: 'Wool Coat stone color',
    title: 'Elegant Winter Wool Coat',
    priceFormatted: '12900 сом',
    compareAtFormatted: '17900 сом',
    rating: 4.7,
  },
  {
    id: 5,
    href: '/product/wool-coat-4',
    imageSrc: '/catalog/DSC06087.jpg',
    imageAlt: 'Wool Coat stone color',
    title: 'Classic Wool Coat',
    priceFormatted: '12900 сом',
    compareAtFormatted: '17900 сом',
    rating: 4.7,
  },
  {
    id: 6,
    href: '/product/wool-coat-5',
    imageSrc: '/catalog/DSC06087.jpg',
    imageAlt: 'Wool Coat stone color',
    title: 'Designer Wool Coat',
    priceFormatted: '12900 сом',
    compareAtFormatted: '17900 сом',
    rating: 4.7,
  },
  {
    id: 7,
    href: '/product/wool-coat-6',
    imageSrc: '/catalog/DSC06087.jpg',
    imageAlt: 'Wool Coat stone color',
    title: 'Luxury Wool Coat',
    priceFormatted: '12900 сом',
    compareAtFormatted: '17900 сом',
    rating: 4.7,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        slides={[
          {
            id: 1,
            imageSrc: '/banners/carousel1.jpg',
            title: 'Элегантность вечера',
            blurb:
              'Насладись красотой наших товаров в изысканной форме.',
            ctaLabel: 'Перейти',
            ctaHref: '/collections/pegasus',
          },
          {
            id: 2,
            imageSrc: '/DSC05068.jpg',
            title: 'Любовь к свободе',
            blurb: 'Легкий, гибкий, и готовый к движению.',
            ctaLabel: 'Узнать больше',
            ctaHref: '/collections/flyknit',
          },
        ]}
      />

      <EditorialTiles />
      <CollectionBanner />
      <JustArrivedCarousel products={products} />
    </>
  );
}