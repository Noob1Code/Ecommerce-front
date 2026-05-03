import type { ApiProductDTO, Product, Offer } from './product.types';

export const mapApiToProduct = (apiData: ApiProductDTO): Product => {
  // 1. Mapear as novas ofertas, se existirem (segurança extra com fallback para array vazio)
  const mappedOffers: Offer[] = (apiData.offers || []).map(offer => ({
    id: offer.id,
    seller: {
      id: offer.seller.id,
      name: offer.seller.name,
      rating: offer.seller.rating,
    },
    // Forçamos a conversão para número para evitar erros de renderização na interface
    price: Number(offer.price) || 0, 
    stock: Number(offer.stock) || 0,
    condition: offer.condition,
    isBuyBoxWinner: Boolean(offer.isBuyBoxWinner),
  }));

  // 2. Identificar a "Buy Box" (A oferta principal/vencedora)
  const bestOffer = mappedOffers.find(o => o.isBuyBoxWinner) || mappedOffers[0];

  // 3. Garantir os valores legados (fallback blindado)
  const legacyPrice = bestOffer ? bestOffer.price : (Number(apiData.price) || 0);
  const legacyStock = bestOffer ? bestOffer.stock : (Number(apiData.stock) || 0);

  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    imageUrl: apiData.imageUrl,
    category: apiData.category,
    // Linha 'brand' removida para corrigir o erro do TypeScript
    
    // Novos Campos do Marketplace
    offers: mappedOffers,
    bestOffer: bestOffer,

    // Campos legados restaurados de forma segura
    price: legacyPrice,
    stock: legacyStock,
  };
};

export const mapApiToProductList = (apiData: ApiProductDTO[]): Product[] => {
  // Proteção extra: se a API falhar e não devolver um array, devolvemos um array vazio
  if (!Array.isArray(apiData)) return [];
  return apiData.map(mapApiToProduct);
};