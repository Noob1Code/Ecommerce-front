import type { 
  BackendProdutoAtributoResponseDTO, 
  BackendProdutoVariacaoResponseDTO 
} from '../domain/product.types';

// Interface que representa exatamente o ProdutoDetalhadoResponseDTO com as variações embutidas
export interface BackendProdutoDetalhadoPayload {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
  variacoes: BackendProdutoVariacaoResponseDTO[];
  atributos: BackendProdutoAtributoResponseDTO[];
}

export const mockBackendProducts: BackendProdutoDetalhadoPayload[] = [
  {
    id: 'p1-mechanical-keyboard',
    nome: 'Teclado Mecânico Premium RGB',
    descricao: 'Teclado mecânico de alta performance com switches intercambiáveis e iluminação RGB customizável.',
    ativo: true,
    criadoEm: '2026-01-15T10:00:00Z',
    atributos: [
      { id: 'a1', atributoId: 'attr-color', atributoNome: 'Cor' },
      { id: 'a2', atributoId: 'attr-switch', atributoNome: 'Switch' }
    ],
    variacoes: [
      {
        id: 'sku-keyboard-black-red',
        sku: 'TEC-RGB-BLK-RED',
        preco: 149.99,
        estoque: 10,
        opcoes: [
          { id: 'o1', atributo: { id: 'attr-color', nome: 'Cor' }, valor: 'Preto' },
          { id: 'o2', atributo: { id: 'attr-switch', nome: 'Switch' }, valor: 'Red' }
        ],
        imagens: [
          { id: 'img1', urlImagem: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', ordem: 1, criadoEm: '2026-01-15T10:00:00Z' }
        ]
      },
      {
        id: 'sku-keyboard-black-blue',
        sku: 'TEC-RGB-BLK-BLU',
        preco: 144.99,
        estoque: 0, // Fora de estoque para testarmos lógica de indisponibilidade
        opcoes: [
          { id: 'o3', atributo: { id: 'attr-color', nome: 'Cor' }, valor: 'Preto' },
          { id: 'o4', atributo: { id: 'attr-switch', nome: 'Switch' }, valor: 'Blue' }
        ],
        imagens: [
          { id: 'img2', urlImagem: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500', ordem: 1, criadoEm: '2026-01-15T10:00:00Z' }
        ]
      },
      {
        id: 'sku-keyboard-white-red',
        sku: 'TEC-RGB-WHT-RED',
        preco: 159.99,
        estoque: 8,
        opcoes: [
          { id: 'o5', atributo: { id: 'attr-color', nome: 'Cor' }, valor: 'Branco' },
          { id: 'o6', atributo: { id: 'attr-switch', nome: 'Switch' }, valor: 'Red' }
        ],
        imagens: [
          { id: 'img3', urlImagem: 'https://images.unsplash.com/photo-1626958390898-162d3577f593?w=500', ordem: 1, criadoEm: '2026-01-15T10:00:00Z' }
        ]
      }
    ]
  },
  {
    id: 'p2-wireless-mouse',
    nome: 'Mouse Gamer Wireless Pro',
    descricao: 'Mouse sem fio ultra leve com sensor de 26000 DPI e bateria de longa duração.',
    ativo: true,
    criadoEm: '2026-02-20T14:30:00Z',
    atributos: [
      { id: 'a3', atributoId: 'attr-color', atributoNome: 'Cor' }
    ],
    variacoes: [
      {
        id: 'sku-mouse-black',
        sku: 'MS-WRL-BLK',
        preco: 79.99,
        estoque: 42,
        opcoes: [
          { id: 'o7', atributo: { id: 'attr-color', nome: 'Cor' }, valor: 'Preto' }
        ],
        imagens: [
          { id: 'img4', urlImagem: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', ordem: 1, criadoEm: '2026-02-20T14:30:00Z' }
        ]
      },
      {
        id: 'sku-mouse-white',
        sku: 'MS-WRL-WHT',
        preco: 84.99,
        estoque: 20,
        opcoes: [
          { id: 'o8', atributo: { id: 'attr-color', nome: 'Cor' }, valor: 'Branco' }
        ],
        imagens: [
          { id: 'img5', urlImagem: 'https://images.unsplash.com/photo-1625842268584-8f329043265c?w=500', ordem: 1, criadoEm: '2026-02-20T14:30:00Z' }
        ]
      }
    ]
  }
];