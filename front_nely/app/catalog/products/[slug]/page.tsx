// app/catalog/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductDetailPage from '@/components/ProductDetailPage';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  try {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    
    console.log('🔍 Fetching product with slug:', slug);
    
    // Try direct product endpoint first with slug lookup
    const directRes = await fetch(`${BACKEND_URL}/catalog/products/?slug=${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📥 Direct response status:', directRes.status);
    
    if (directRes.ok) {
      const data = await directRes.json();
      console.log('📦 Direct response data structure:', Object.keys(data));
      
      // Handle different response formats
      let product = null;
      
      // Check if data is wrapped in an envelope
      if (data.data) {
        console.log('📦 Data is wrapped in envelope');
        if (Array.isArray(data.data.results)) {
          product = data.data.results[0];
        } else if (Array.isArray(data.data)) {
          product = data.data[0];
        } else if (data.data.results) {
          product = data.data.results;
        } else {
          product = data.data;
        }
      } 
      // Check if data has results array (paginated)
      else if (data.results && Array.isArray(data.results)) {
        console.log('📦 Data has results array, count:', data.results.length);
        product = data.results[0];
      }
      // Direct product object
      else if (data.id) {
        console.log('📦 Data is direct product object');
        product = data;
      }
      
      if (product) {
        console.log('✅ Product found:', product.name || product.product_name);
        return product;
      }
    }
    
    console.log('❌ Product not found for slug:', slug);
    return null;
    
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(productId: number) {
  try {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    
    console.log('🔍 Fetching related products for product:', productId);
    
    const res = await fetch(`${BACKEND_URL}/catalog/products/${productId}/related/`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.log('⚠️ Related products not found or error:', res.status);
      return [];
    }
    
    const data = await res.json();
    console.log('📦 Related products response:', Object.keys(data));
    
    // Handle wrapped response
    let products = [];
    if (data.data) {
      products = Array.isArray(data.data) ? data.data : [data.data];
    } else if (data.results) {
      products = data.results;
    } else if (Array.isArray(data)) {
      products = data;
    }
    
    console.log('✅ Found related products:', products.length);
    return products;
    
  } catch (error) {
    console.error('❌ Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  console.log('🎯 ProductPage rendering for slug:', slug);
  
  const product = await getProduct(slug);
  
  if (!product) {
    console.log('❌ Product not found, returning 404');
    notFound();
  }
  
  console.log('✅ Product loaded:', product.name || product.product_name);
  
  // Get the product ID (handle both formats)
  const productId = product.id || product.product_id;
  
  const relatedProducts = await getRelatedProducts(productId);
  
  // Transform related products to match ProductCard interface
  const transformedRelated = relatedProducts.map((p: any) => {
    const productName = p.name || p.product_name;
    const productSlug = p.slug;
    const primaryImage = p.primary_image || p.images?.[0]?.url || p.images?.[0]?.image_url;
    const basePrice = p.base_price || p.price;
    const salePrice = p.sale_price;
    const categoryName = p.category_name || p.category?.category_name;
    
    return {
      id: p.id || p.product_id,
      href: `/catalog/products/${productSlug}`,
      imageSrc: primaryImage || '/placeholder-product.jpg',
      imageAlt: productName,
      title: productName,
      sizeLabel: categoryName || '',
      priceFormatted: `${salePrice || basePrice} сом`,
      compareAtFormatted: salePrice ? `${basePrice} сом` : undefined,
      rating: p.rating || 4.5,
    };
  });
  
  // Normalize product data to match ProductDetailPage interface
  const normalizedProduct = {
    id: productId,
    name: product.name || product.product_name,
    slug: product.slug,
    base_price: product.base_price || product.price,
    sale_price: product.sale_price,
    description: product.description,
    short_description: product.short_description,
    available_colors: product.available_colors || [],
    available_sizes: product.available_sizes || [],
    images: product.images || [],
    category_name: product.category_name || product.category?.category_name,
    season_display: product.season_display || product.season,
    is_featured: product.is_featured || false,
    is_new_arrival: product.is_new_arrival || product.is_new || false,
    rating: product.rating || 4.5,
  };
  
  console.log('🎨 Rendering ProductDetailPage with:', {
    name: normalizedProduct.name,
    imagesCount: normalizedProduct.images.length,
    colorsCount: normalizedProduct.available_colors.length,
    sizesCount: normalizedProduct.available_sizes.length,
    relatedCount: transformedRelated.length,
  });
  
  return (
    <ProductDetailPage 
      product={normalizedProduct}
      relatedProducts={transformedRelated}
      whatsappNumber="+996700123456"
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found | Nely Look',
    };
  }
  
  const productName = product.name || product.product_name;
  const description = product.short_description || product.description || '';
  
  return {
    title: `${productName} | Nely Look`,
    description: description.substring(0, 160), // SEO best practice
    openGraph: {
      title: productName,
      description: description,
      images: product.images?.[0]?.url || product.images?.[0]?.image_url 
        ? [{
            url: product.images[0].url || product.images[0].image_url,
            alt: productName,
          }]
        : [],
    },
  };
}