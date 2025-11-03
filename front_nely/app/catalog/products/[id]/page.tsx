// app/catalog/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import ProductDetailPage from '@/components/ProductDetailPage';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

async function getProduct(id: string) {
  try {
    console.log('🔍 Fetching product:', id);
    
    const response = await fetch(`${BACKEND_URL}/catalog/products/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    const product = data.data || data;

    // Transform product data
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      base_price: product.base_price,
      sale_price: product.sale_price,
      description: product.description,
      short_description: product.short_description,
      rating: product.rating || 4.5,
      category_name: product.category_name,
      season_display: product.season_display,
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      
      available_colors: (product.available_colors || []).map((color: any) => ({
        id: color.id,
        name: color.name,
        code: color.code || '#000000',
      })),
      
      available_sizes: (product.available_sizes || []).map((size: any) => ({
        id: size.id,
        name: size.name,
      })),
      
      images: (product.images || []).map((img: any) => ({
        id: img.id,
        url: img.url,
        alt_text: img.alt_text || product.name,
        is_primary: img.is_primary,
        display_order: img.display_order,
        color_id: img.color?.id,
      })),
    };
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(id: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/catalog/products/${id}/related/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const products = data.data || data.results || [];

    return products.slice(0, 4).map((p: any) => ({
      id: p.id,
      href: `/catalog/products/${p.id}`,
      imageSrc: p.images?.[0]?.url || '/placeholder.jpg',
      imageAlt: p.name,
      title: p.name,
      sizeLabel: p.available_sizes?.map((s: any) => s.name).join(' — ') || 'M — 2XL',
      priceFormatted: `${p.sale_price || p.base_price}`,
      compareAtFormatted: p.sale_price ? `${p.base_price}` : undefined,
      rating: 4.5,
    }));
  } catch (error) {
    console.error('⚠️ Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, relatedProducts] = await Promise.all([
    getProduct(params.id),
    getRelatedProducts(params.id),
  ]);

  if (!product) {
    notFound();
  }

  // Get WhatsApp number from environment or use default
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+996700123456';

  return (
    <ProductDetailPage
      product={product}
      relatedProducts={relatedProducts}
      whatsappNumber={whatsappNumber}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Товар не найден - Nely Look',
    };
  }

  return {
    title: `${product.name} - Nely Look`,
    description: product.short_description || product.description || `Купить ${product.name} в Nely Look`,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}