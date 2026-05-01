import type { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-canceling wireless headphones with 30 hours of battery life.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    stock: 15,
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with tactile switches for precision gaming and typing.',
    price: 129.50,
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=500&q=80',
    stock: 8,
  },
  {
    id: '3',
    name: 'Artisan Pequi Oil',
    description: 'Pure, cold-pressed pequi oil. Perfect for traditional culinary dishes and skin care.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=500&q=80',
    stock: 50,
  },
  {
    id: '4',
    name: '4K Ultra HD Smart TV',
    description: '55-inch 4K Smart TV with vibrant colors and built-in streaming apps.',
    price: 599.00,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80',
    stock: 3,
  }
];