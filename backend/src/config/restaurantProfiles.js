const hamburgerCategories = [
  {
    id: 'lanches',
    name: 'Lanches',
    items: [
      { id: 'x-burguer', name: 'X-Burguer', price: 18.9 },
      { id: 'x-salada', name: 'X-Salada', price: 20.9 },
      { id: 'x-bacon', name: 'X-Bacon', price: 23.9 }
    ]
  },
  {
    id: 'porcoes',
    name: 'Porções',
    items: [
      { id: 'batata-p', name: 'Batata Frita P', price: 16.0 },
      { id: 'batata-g', name: 'Batata Frita G', price: 24.0 },
      { id: 'calabresa-cebola', name: 'Calabresa com Cebola', price: 28.0 }
    ]
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    items: [
      { id: 'coca-lata', name: 'Coca-Cola Lata', price: 6.5 },
      { id: 'guarana-lata', name: 'Guaraná Lata', price: 6.0 },
      { id: 'agua-sem-gas', name: 'Água sem gás', price: 3.5 }
    ]
  }
];

const crepsCategories = [
  {
    id: 'creps',
    name: 'Creps',
    items: [
      { id: 'crep-frango-catupiry', name: 'Crep de Frango com Catupiry', price: 9.0 },
      { id: 'crep-frango-molho-casa', name: 'Crep de Frango ao Molho da Casa', price: 12.0 },
      { id: 'crep-carne-desfiada', name: 'Crep de Carne Desfiada', price: 10.0 },
      { id: 'crep-carne-premium', name: 'Crep de Carne Premium com Queijo', price: 15.0 },
      { id: 'crep-misto-premium', name: 'Crep Misto Premium', price: 20.0 }
    ]
  },
  {
    id: 'sucos',
    name: 'Sucos e vitaminas',
    items: [
      { id: 'suco-goiaba', name: 'Suco de Goiaba', price: 6.0 },
      { id: 'suco-acerola', name: 'Suco de Acerola', price: 6.0 },
      { id: 'suco-laranja', name: 'Suco de Laranja', price: 6.0 },
      { id: 'suco-cupuacu', name: 'Suco de Cupuaçu', price: 7.0 },
      { id: 'vitamina-abacate', name: 'Vitamina de Abacate', price: 8.0 },
      { id: 'vitamina-banana', name: 'Vitamina de Banana', price: 8.0 }
    ]
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    items: [
      { id: 'coca-normal', name: 'Coca-Cola Normal', price: 6.0 },
      { id: 'coca-zero', name: 'Coca-Cola Zero', price: 6.0 },
      { id: 'guarana', name: 'Guaraná', price: 6.0 },
      { id: 'fanta-laranja', name: 'Fanta Laranja', price: 6.0 },
      { id: 'fanta-uva', name: 'Fanta Uva', price: 6.0 }
    ]
  }
];

export const restaurantProfiles = {
  hamburgueria: {
    id: 'hamburgueria',
    pixKey: '000.000.000-00',
    branding: {
      name: 'Durck-Burgues',
      shortName: 'Durck-Burgues',
      logoLetter: 'D',
      theme: 'burger',
      eyebrow: 'Hambúrguer artesanal online',
      heroTitle: 'O melhor lanche da cidade.',
      heroDescription: 'Escolha seus favoritos, monte seu pedido e envie direto para o WhatsApp com rapidez e praticidade.',
      popularLabel: 'Mais pedido',
      orderTitle: 'Monte seu lanche agora',
      highlightTitle: 'Pedidos que fazem sucesso'
    },
    categories: hamburgerCategories
  },
  biacreps: {
    id: 'biacreps',
    pixKey: '123456789',
    branding: {
      name: 'BiaCREPS',
      shortName: 'BiaCREPS',
      logoLetter: 'B',
      theme: 'creps',
      eyebrow: 'Creps feitos para o seu momento',
      heroTitle: 'Seu crep favorito, do seu jeito.',
      heroDescription: 'Escolha seu crep, combine com uma bebida e envie o pedido direto para o WhatsApp com rapidez e praticidade.',
      popularLabel: 'Favoritos da casa',
      orderTitle: 'Monte seu crep agora',
      highlightTitle: 'Creps que fazem sucesso'
    },
    categories: crepsCategories
  }
};
