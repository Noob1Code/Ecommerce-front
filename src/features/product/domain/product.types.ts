// --- NEW MARKETPLACE ENTITIES ---

export interface Seller {
  id: string;
  name: string;
  rating: number;
}

export interface Offer {
  id: string;
  seller: Seller;
  price: number;
  stock: number;
  condition: 'NEW' | 'USED' | 'REFURBISHED';
  isBuyBoxWinner: boolean;
}

// --- TRANSITIONAL DOMAIN MODEL ---

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category?: string;
  brand?: string;

  // New Marketplace Data
  offers: Offer[];
  bestOffer?: Offer;

  // Legacy Data (Kept for compatibility with existing UI and Cart)
  /** @deprecated Will be removed in Phase 2. Use bestOffer.price */
  price: number;
  /** @deprecated Will be removed in Phase 2. Use bestOffer.stock */
  stock: number;
}

// --- TRANSITIONAL API DTO ---

// Simulating how the backend will send data during the transition
export interface ApiProductDTO {
  id: string;
  name: string;
  description: string;
  price: number; // Legacy
  imageUrl: string;
  stock: number; // Legacy
  category?: string;
  
  // New nested data from backend
  offers?: {
    id: string;
    seller: { id: string; name: string; rating: number };
    price: number;
    stock: number;
    condition: 'NEW' | 'USED' | 'REFURBISHED';
    isBuyBoxWinner: boolean;
  }[];
}