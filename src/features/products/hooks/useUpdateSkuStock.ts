import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSkuStockInApi } from '../api/productsApi';
import { PRODUCTS_QUERY_KEYS } from '../api/productsQueryKeys';

export const useUpdateSkuStock = () => {
  const queryClient = useQueryClient();

  const { mutate: updateStock, isPending } = useMutation({
    mutationFn: ({ skuId, newStock }: { skuId: string; newStock: number }) =>
      updateSkuStockInApi(skuId, newStock),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEYS.all,
      });
    },
  });

  return {
    updateStock,
    isLoading: isPending,
  };
};