export const mockProducts = [
  {
    id: '1',
    name: 'Óleo de Pequi Artesanal',
    description: 'Óleo extraído a frio, 100% puro do cerrado brasileiro. Rico em vitaminas A e E.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Food',
    price: 45.90,
    stock: 15,
    offers: [
      {
        id: 'off_1a',
        seller: { id: 'sel_1', name: 'Cerrado Natural', rating: 4.9 },
        price: 45.90,
        stock: 15,
        condition: 'NEW',
        isBuyBoxWinner: true
      },
      {
        id: 'off_1b',
        seller: { id: 'sel_2', name: 'Empório do Brasil', rating: 4.5 },
        price: 48.00,
        stock: 5,
        condition: 'NEW',
        isBuyBoxWinner: false
      },
      {
        id: 'off_1c',
        seller: { id: 'sel_7', name: 'Raízes do Cerrado', rating: 4.7 },
        price: 46.50,
        stock: 8,
        condition: 'NEW',
        isBuyBoxWinner: false
      }
    ]
  },

  {
    id: '2',
    name: 'Fone Bluetooth Noise Cancelling',
    description: 'Fones de ouvido sem fio com cancelamento ativo de ruído e bateria de 30 horas.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    price: 299.00,
    stock: 5,
    offers: [
      {
        id: 'off_2a',
        seller: { id: 'sel_3', name: 'Tech Store Oficial', rating: 4.8 },
        price: 299.00,
        stock: 5,
        condition: 'NEW',
        isBuyBoxWinner: true
      },
      {
        id: 'off_2b',
        seller: { id: 'sel_2', name: 'Empório do Brasil', rating: 4.5 },
        price: 310.00,
        stock: 3,
        condition: 'NEW',
        isBuyBoxWinner: false
      },
      {
        id: 'off_2c',
        seller: { id: 'sel_8', name: 'Audio Prime', rating: 4.6 },
        price: 289.90,
        stock: 7,
        condition: 'REFURBISHED',
        isBuyBoxWinner: false
      }
    ]
  },

  {
    id: '3',
    name: 'Câmera Mirrorless Alpha',
    description: 'Câmera digital mirrorless com sensor full-frame de 24.2 MP e gravação de vídeo 4K.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    price: 5499.00,
    stock: 2,
    offers: [
      {
        id: 'off_3a',
        seller: { id: 'sel_4', name: 'PhotoCenter', rating: 4.2 },
        price: 5499.00,
        stock: 2,
        condition: 'NEW',
        isBuyBoxWinner: true
      },
      {
        id: 'off_3b',
        seller: { id: 'sel_5', name: 'Vintage Câmeras', rating: 4.7 },
        price: 4800.00,
        stock: 1,
        condition: 'USED',
        isBuyBoxWinner: false
      },
      {
        id: 'off_3c',
        seller: { id: 'sel_3', name: 'Tech Store Oficial', rating: 4.8 },
        price: 5350.00,
        stock: 1,
        condition: 'NEW',
        isBuyBoxWinner: false
      }
    ]
  },

  {
    id: '4',
    name: 'Mochila Urbana Resistente à Água',
    description: 'Mochila de design minimalista, material impermeável e compartimento acolchoado para notebook de até 15.6 polegadas.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    price: 189.90,
    stock: 20,
    offers: [
      {
        id: 'off_4a',
        seller: { id: 'sel_6', name: 'Bag & Co', rating: 4.6 },
        price: 189.90,
        stock: 20,
        condition: 'NEW',
        isBuyBoxWinner: true
      },
      {
        id: 'off_4b',
        seller: { id: 'sel_7', name: 'Raízes do Cerrado', rating: 4.7 },
        price: 179.90,
        stock: 10,
        condition: 'NEW',
        isBuyBoxWinner: false
      },
      {
        id: 'off_4c',
        seller: { id: 'sel_9', name: 'Urban Gear', rating: 4.4 },
        price: 169.90,
        stock: 4,
        condition: 'USED',
        isBuyBoxWinner: false
      }
    ]
  },

  // NOVO PRODUTO
  {
    id: '5',
    name: 'Castanha de Baru Torrada',
    description: 'Castanhas selecionadas do cerrado, ricas em proteína e sabor intenso.',
    imageUrl: 'https://images.unsplash.com/photo-1604908177522-402f9c9d7e9d?auto=format&fit=crop&w=800&q=80',
    category: 'Food',
    price: 32.90,
    stock: 25,
    offers: [
      {
        id: 'off_5a',
        seller: { id: 'sel_1', name: 'Cerrado Natural', rating: 4.9 },
        price: 32.90,
        stock: 25,
        condition: 'NEW',
        isBuyBoxWinner: true
      },
      {
        id: 'off_5b',
        seller: { id: 'sel_7', name: 'Raízes do Cerrado', rating: 4.7 },
        price: 34.50,
        stock: 12,
        condition: 'NEW',
        isBuyBoxWinner: false
      }
    ]
  },

  // NOVO PRODUTO
  {
    id: '6',
    name: 'Teclado Mecânico RGB',
    description: 'Teclado gamer com switches azuis, iluminação RGB e estrutura em alumínio.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    price: 399.90,
    stock: 10,
    offers: [
      {
        id: 'off_6a',
        seller: { id: 'sel_3', name: 'Tech Store Oficial', rating: 4.8 },
        price: 399.90,
        stock: 10,
        condition: 'NEW',
        isBuyBoxWinner: true
      },
      {
        id: 'off_6b',
        seller: { id: 'sel_8', name: 'Audio Prime', rating: 4.6 },
        price: 379.90,
        stock: 6,
        condition: 'NEW',
        isBuyBoxWinner: false
      },
      {
        id: 'off_6c',
        seller: { id: 'sel_2', name: 'Empório do Brasil', rating: 4.5 },
        price: 410.00,
        stock: 3,
        condition: 'NEW',
        isBuyBoxWinner: false
      }
    ]
  }
];