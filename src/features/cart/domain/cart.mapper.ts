import type { CartStoreItem } from '../store/useCartStore';
import type { BackendCarrinhoResponseDTO, EnrichedCartItem } from './cart.types';

export const CartMapper = {

    formatarMoeda(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    },

    parseDetalhesAtributos(detalhes: string): { attributeName: string; value: string }[] {
        if (!detalhes) return [];

        return detalhes.split('|').map((parte) => {
            const [chave, valor] = parte.split(':');
            return {
                attributeName: chave?.trim() || 'Especificação',
                value: valor?.trim() || 'Padrão'
            };
        });
    },

    toEnrichedItemsFromServer(dto: BackendCarrinhoResponseDTO | undefined): EnrichedCartItem[] {
        if (!dto || !dto.itens) return [];

        return dto.itens
            .filter((item) => item.produto !== null)
            .map((item) => {
                const prod = item.produto!;
                const subtotal = prod.preco * item.quantidade;

                return {
                    id: prod.variacaoId,
                    skuId: prod.variacaoId,
                    quantity: item.quantidade,
                    product: {
                        id: prod.variacaoId,
                        name: prod.nomeProduto,
                    },
                    selectedSku: {
                        skuCode: prod.sku,
                        price: prod.preco,
                        stock: prod.estoque,
                        images: [],
                        options: CartMapper.parseDetalhesAtributos(prod.detalhes),
                    },
                    precoFormatado: CartMapper.formatarMoeda(prod.preco),
                    subtotalFormatado: CartMapper.formatarMoeda(subtotal),
                };
            });
    },

    toCartStoreItems(dto: BackendCarrinhoResponseDTO | undefined): CartStoreItem[] {
        if (!dto || !dto.itens) return [];

        return dto.itens.map((item) => ({
            skuId: item.produto?.variacaoId || item.id,
            quantity: item.quantidade,
        }));
    }
};