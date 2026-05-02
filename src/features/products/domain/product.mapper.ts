import type { ApiProductDTO, Product } from './product.types';
import { createProductEntity } from './product.entity';

export const mapApiToProduct = (apiData: ApiProductDTO): Product => {
  return createProductEntity({
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    price: apiData.price,
    imageUrl: apiData.imageUrl,
    stock: apiData.stock,
  });
};

export const mapApiToProductList = (apiDataList: ApiProductDTO[]): Product[] => {
  return apiDataList.map(mapApiToProduct);
};