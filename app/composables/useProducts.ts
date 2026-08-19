// app/composables/useProducts.ts
import type { Product } from '../../types/index';

const fallbackProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30-hour battery life.',
    category: 'Audio',
    price: 79.99,
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&h=600&auto=format&fit=crop',
  },
  {
    id: 'prod-002',
    name: 'Smart Watch Pro',
    description: 'AMOLED display, heart-rate tracking, 7-day battery.',
    category: 'Wearables',
    price: 129,
    stock: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&h=600&auto=format&fit=crop',
  },
  {
    id: 'prod-003',
    name: 'Bluetooth Speaker',
    description: '360° sound, IPX7 waterproof, 12h playtime.',
    category: 'Audio',
    price: 49.5,
    stock: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&h=600&auto=format&fit=crop',
  },
  {
    id: 'prod-004',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit, hot-swappable switches, USB-C.',
    category: 'Accessories',
    price: 95,
    stock: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&h=600&auto=format&fit=crop',
  },
  {
    id: 'prod-005',
    name: '4K Action Camera',
    description: '4K60 video, waterproof case, gyro stabilization.',
    category: 'Cameras',
    price: 199.99,
    stock: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&h=600&auto=format&fit=crop',
  },
  {
    id: 'prod-006',
    name: 'USB-C Fast Charger',
    description: '65W GaN charger, dual port, foldable plug.',
    category: 'Accessories',
    price: 24.99,
    stock: 30,
    imageUrl:
      'https://images.pexels.com/photos/3921630/pexels-photo-3921630.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  },
];

export const useProducts = () => {
  const products = useState<Product[]>('catalog-products', () => []);
  const pending = useState<boolean>('catalog-pending', () => false);
  const loaded = useState<boolean>('catalog-loaded', () => false);
  const apiError = useState<string>('catalog-error', () => '');

  const load = async (force = false) => {
    if (loaded.value && !force) return;

    pending.value = true;

    try {
      const data = await $fetch<Product[]>('/api/products');

      products.value = Array.isArray(data) && data.length > 0 ? data : fallbackProducts;

      apiError.value = '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'API unavailable';

      console.error('Failed to load products:', errorMessage);

      apiError.value = errorMessage;
      products.value = fallbackProducts;
    } finally {
      loaded.value = true;
      pending.value = false;
    }
  };

  const findById = (id: string) => products.value.find(p => p.id === id) ?? null;

  const getByCategory = (category: string) => products.value.filter(p => p.category === category);

  const getInStock = () => products.value.filter(p => p.stock > 0);

  return {
    products,
    pending,
    loaded,
    apiError,
    load,
    findById,
    getByCategory,
    getInStock,
  };
};
