// types/product.ts
// Shared product types across the application

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

// Django API response types
export type DjangoProduct = {
  id: number;
  code: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category: number;
  category_name: string;
  clothing_type?: number;
  clothing_type_name?: string;
  season: string;
  season_display: string;
  base_price: string;
  sale_price?: string;
  cost_price?: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  stock_quantity: number;
  status: string;
  status_display: string;
  created_at: string;
  updated_at: string;
  // Extended fields (from ProductDetailSerializer)
  variants?: ProductVariant[];
  images?: ProductImage[];
  available_colors?: Color[];
  available_sizes?: Size[];
  price_info?: PriceInfo;
};

export type ProductVariant = {
  id: number;
  sku: string;
  size?: Size;
  color?: Color;
  stock_quantity: number;
  status: string;
  is_available: boolean;
  is_low_stock: boolean;
};

export type ProductImage = {
  id: number;
  color?: Color;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  image_type: string;
};

export type Color = {
  id: number;
  name: string;
  code?: string;
  family?: string;
  is_active: boolean;
};

export type Size = {
  id: number;
  name: string;
  category?: string;
  group?: string;
  sort_order?: number;
  is_active: boolean;
};

export type PriceInfo = {
  base_price: string;
  sale_price?: string;
  discount_percentage: number;
  on_sale: boolean;
};

// Transform Django product to frontend product
export function transformProduct(djangoProduct: DjangoProduct): Product {
  const primaryImage = 
    djangoProduct.images?.find(img => img.is_primary) || 
    djangoProduct.images?.[0];
  
  const basePrice = parseFloat(djangoProduct.base_price);
  const salePrice = djangoProduct.sale_price ? parseFloat(djangoProduct.sale_price) : null;
  
  return {
    id: djangoProduct.id,
    href: `/product/${djangoProduct.slug}`,
    imageSrc: primaryImage?.url || '/placeholder.jpg',
    imageAlt: primaryImage?.alt_text || djangoProduct.name,
    title: djangoProduct.name,
    sizeLabel: djangoProduct.available_sizes
      ?.map(s => s.name)
      .join(' — ') || undefined,
    priceFormatted: `${salePrice || basePrice}`,
    compareAtFormatted: salePrice ? `${basePrice}` : undefined,
    rating: undefined, // Add if you have ratings in your system
  };
}