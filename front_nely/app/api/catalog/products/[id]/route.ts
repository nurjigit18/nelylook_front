// app/api/catalog/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    console.log('🔍 Fetching product detail:', productId);
    
    // Fetch product details from Django
    const response = await fetch(
      `${BACKEND_URL}/catalog/products/${productId}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      console.error('❌ Django API error:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const product = data.data || data;
    
    console.log('✅ Product fetched:', product.name);

    // Fetch related products
    let relatedProducts = [];
    try {
      const relatedResponse = await fetch(
        `${BACKEND_URL}/catalog/products/${productId}/related/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );
      
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        relatedProducts = (relatedData.data || relatedData.results || []).map((p: any) => ({
          id: p.id,
          href: `/catalog/products/${p.slug || p.id}`,
          imageSrc: p.images?.[0]?.url || '/placeholder.jpg',
          imageAlt: p.name,
          title: p.name,
          sizeLabel: p.available_sizes?.map((s: any) => s.name).join(' — ') || '',
          priceFormatted: `${p.sale_price || p.base_price} сом`,
          compareAtFormatted: p.sale_price ? `${p.base_price} сом` : undefined,
          rating: p.rating || 4.5,
        }));
      }
    } catch (error) {
      console.warn('⚠️ Failed to fetch related products:', error);
    }

    // Transform product data for frontend
    const transformedProduct = {
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
      
      // Available colors
      available_colors: (product.available_colors || []).map((color: any) => ({
        id: color.id,
        name: color.name,
        code: color.code || '#000000',
      })),
      
      // Available sizes
      available_sizes: (product.available_sizes || []).map((size: any) => ({
        id: size.id,
        name: size.name,
      })),
      
      // Images
      images: (product.images || []).map((img: any) => ({
        id: img.id,
        url: img.url,
        alt_text: img.alt_text || product.name,
        is_primary: img.is_primary,
        display_order: img.display_order,
        color_id: img.color?.id,
      })),
      
      // Variants for stock checking
      variants: product.variants || [],
    };

    return NextResponse.json({
      product: transformedProduct,
      relatedProducts,
    });

  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}