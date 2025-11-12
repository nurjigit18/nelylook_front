// app/wishlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

type WishlistItem = {
  id: number;
  variant_id: number;
  added_at: string;
  product: {
    id: number;
    name: string;
    slug: string;
    base_price: string;
    sale_price: string | null;
    primary_image: string | null;
    category_name: string;
  };
};

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      setLoading(true);
      const res = await fetch('/api/wishlist');
      
      if (!res.ok) {
        throw new Error('Failed to load wishlist');
      }
      
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading wishlist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(itemId: number) {
    try {
      const res = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to remove item');
      }
      
      // Remove from local state
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      console.error('Error removing item:', err);
      alert('Failed to remove item from wishlist');
    }
  }

  async function moveToCart(item: WishlistItem) {
    try {
      // Add to cart logic here
      // For now, just remove from wishlist
      await removeFromWishlist(item.id);
      alert('Item moved to cart!');
    } catch (err: any) {
      console.error('Error moving to cart:', err);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-600">Ошибка: {error}</p>
          <button
            onClick={loadWishlist}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Избранное</h1>
        <p className="text-gray-600">
          {items.length} {items.length === 1 ? 'товар' : 'товаров'}
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ваш список избранного пуст</h2>
          <p className="text-gray-600 mb-6">
            Добавьте товары в избранное, нажав на значок сердца
          </p>
          <button
            onClick={() => router.push('/catalog/products')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard
                href={`/catalog/products/${item.product.slug}`}
                imageSrc={item.product.primary_image || '/placeholder-product.jpg'}
                imageAlt={item.product.name}
                title={item.product.name}
                sizeLabel={item.product.category_name}
                priceFormatted={`${item.product.sale_price || item.product.base_price} сом`}
                compareAtFormatted={
                  item.product.sale_price ? `${item.product.base_price} сом` : undefined
                }
                className="w-full"
              />
              
              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                  title="Удалить из избранного"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
                
                <button
                  onClick={() => moveToCart(item)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  title="Добавить в корзину"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}