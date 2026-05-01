import type { Product } from '../types';
import { mockProducts } from './mockData';

const DELAY_MS = 800;

export const fetchProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, DELAY_MS);
  });
};

// Removido o "| undefined" do retorno da Promise
export const fetchProductById = async (id: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find((p) => p.id === id);
      if (product) {
        resolve(product);
      } else {
        // Simula um erro 404 do backend
        reject(new Error('Product not found'));
      }
    }, DELAY_MS);
  });
};