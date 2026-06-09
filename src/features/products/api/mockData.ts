import type { 
  BackendProdutoAtributoResponseDTO, 
  BackendProdutoVariacaoResponseDTO 
} from '../domain/product.types';

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
        preco: 449.90,
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
        preco: 439.90,
        estoque: 0,
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
        preco: 489.90,
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
        preco: 299.00,
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
        preco: 319.90,
        estoque: 20,
        opcoes: [
          { id: 'o8', atributo: { id: 'attr-color', nome: 'Cor' }, valor: 'Branco' }
        ],
        imagens: [
          { id: 'img5', urlImagem: 'https://images.unsplash.com/photo-1625842268584-8f329043265c?w=500', ordem: 1, criadoEm: '2026-02-20T14:30:00Z' }
        ]
      }
    ]
  },
  {
    id: 'p3-gaming-monitor',
    nome: 'Monitor Gamer UltraWide 34 QHD',
    descricao: 'Monitor curvado de 34 polegadas com taxa de atualização de 165Hz e tempo de resposta de 1ms, ideal para imersão total.',
    ativo: true,
    criadoEm: '2026-03-05T09:15:00Z',
    atributos: [
      { id: 'a4', atributoId: 'attr-refresh-rate', atributoNome: 'Frequência' }
    ],
    variacoes: [
      {
        id: 'sku-monitor-144hz',
        sku: 'MON-UW-34-144',
        preco: 2199.00,
        estoque: 15,
        opcoes: [
          { id: 'o9', atributo: { id: 'attr-refresh-rate', nome: 'Frequência' }, valor: '144Hz' }
        ],
        imagens: [
          { id: 'img6', urlImagem: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', ordem: 1, criadoEm: '2026-03-05T09:15:00Z' }
        ]
      },
      {
        id: 'sku-monitor-165hz',
        sku: 'MON-UW-34-165',
        preco: 2499.90,
        estoque: 7,
        opcoes: [
          { id: 'o10', atributo: { id: 'attr-refresh-rate', nome: 'Frequência' }, valor: '165Hz' }
        ],
        imagens: [
          { id: 'img7', urlImagem: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=500', ordem: 1, criadoEm: '2026-03-05T09:15:00Z' }
        ]
      }
    ]
  },
  {
    id: 'p4-gaming-headset',
    nome: 'Headset Gamer Wireless 7.1 Surround',
    descricao: 'Headset sem fio com drivers de 50mm, isolamento acústico ativo e microfone retrátil com cancelamento de ruído.',
    ativo: true,
    criadoEm: '2026-03-12T16:45:00Z',
    atributos: [
      { id: 'a5', atributoId: 'attr-conector', atributoNome: 'Conectividade' }
    ],
    variacoes: [
      {
        id: 'sku-headset-wireless',
        sku: 'HDS-WRL-71',
        preco: 599.00,
        estoque: 25,
        opcoes: [
          { id: 'o11', atributo: { id: 'attr-conector', nome: 'Conectividade' }, valor: 'Wireless' }
        ],
        imagens: [
          { id: 'img8', urlImagem: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', ordem: 1, criadoEm: '2026-03-12T16:45:00Z' }
        ]
      },
      {
        id: 'sku-headset-bluetooth',
        sku: 'HDS-BT-50',
        preco: 499.90,
        estoque: 14,
        opcoes: [
          { id: 'o12', atributo: { id: 'attr-conector', nome: 'Conectividade' }, valor: 'Bluetooth' }
        ],
        imagens: [
          { id: 'img9', urlImagem: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', ordem: 1, criadoEm: '2026-03-12T16:45:00Z' }
        ]
      }
    ]
  }
];