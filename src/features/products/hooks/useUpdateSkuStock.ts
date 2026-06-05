import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../services/api/queryKeys';
import { updateSkuStockInApi } from '../api/productsApi';

export const useUpdateSkuStock = () => {
  const queryClient = useQueryClient();

  const { mutate: updateStock, isPending } = useMutation({
    mutationFn: ({ skuId, newStock }: { skuId: string; newStock: number }) =>
      updateSkuStockInApi(skuId, newStock),
    onSuccess: () => {
      // Globally invalidates both catalog listing and single dynamic product detail query caches
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.products.all,
      });
    },
  });

  return {
    updateStock,
    isLoading: isPending,
  };
};