// app/catalog/[category_slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';  // ✅ Add this import
import Link from 'next/link';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_name?: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  sale_price?: string;
  primary_image?: string;
};

async function getCategory(slug: string): Promise<Category | null> {
  try {
    // Fetch all categories and find by slug
    const res = await fetch(`${BACKEND_URL}/catalog/categories/`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    const categories = data.data || data;
    
    if (!Array.isArray(categories)) return null;
    
    // Find category by slug
    const category = categories.find((cat: Category) => cat.slug === slug);
    return category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryProducts(categoryId: number): Promise<Product[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/catalog/products/?category=${categoryId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.data?.results || data.results || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { category_slug: string };
}) {
  const category = await getCategory(params.category_slug);

  if (!category) {
    notFound();
  }

  const products = await getCategoryProducts(category.id);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-black">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalog/products" className="hover:text-black">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 max-w-3xl">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {products.length} {products.length === 1 ? 'товар' : 'товаров'}
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const displayPrice = product.sale_price || product.base_price;
            const originalPrice = product.sale_price ? product.base_price : null;

            return (
              <ProductCard
                key={product.id}
                href={`/catalog/products/${product.slug}`}
                imageSrc={product.primary_image || '/placeholder-product.jpg'}
                imageAlt={product.name}
                title={product.name}
                priceFormatted={`${displayPrice} сом`}
                compareAtFormatted={
                  originalPrice ? `${originalPrice} сом` : undefined
                }
                className="w-full"
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">В этой категории пока нет товаров</p>
          <Link
            href="/catalog/products"
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Посмотреть все товары
          </Link>
        </div>
      )}
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { category_slug: string };
}) {
  const category = await getCategory(params.category_slug);

  if (!category) {
    return {
      title: 'Категория не найдена | NelyLook',
    };
  }

  return {
    title: `${category.name} | NelyLook`,
    description: category.description || `Купить ${category.name} в NelyLook`,
    openGraph: {
      title: `${category.name} | NelyLook`,
      description: category.description || `Купить ${category.name} в NelyLook`,
    },
  };
}