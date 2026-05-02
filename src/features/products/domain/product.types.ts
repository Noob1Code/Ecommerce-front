export interface ApiProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number; // <-- Adicionado
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number; // <-- Adicionado
  formattedPrice?: string; 
}