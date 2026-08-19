import { menu, flattenMenuItems } from '../config/menu.js';

const paymentLabels = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão'
};

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function buildOrderPreview(orderInput) {
  const itemMap = new Map(flattenMenuItems().map((item) => [item.id, item]));

  const selectedItems = orderInput.items
    .filter((item) => item.quantity > 0)
    .map((item) => {
      const menuItem = itemMap.get(item.id);

      if (!menuItem) {
        throw new Error(`Item invalido: ${item.id}`);
      }

      const subtotal = menuItem.price * item.quantity;

      return {
        id: menuItem.id,
        name: menuItem.name,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        subtotal
      };
    });

  if (selectedItems.length === 0) {
    throw new Error('Selecione ao menos um item.');
  }

  const total = selectedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const paymentMethod = orderInput.paymentMethod || 'pix';

  const paymentLine = buildPaymentLine({
    paymentMethod,
    changeFor: orderInput.changeFor,
    pixKey: menu.pixKey
  });

  const lines = [
    `*NOVO PEDIDO - ${(menu.branding?.name || 'CARDÁPIO WEB').toUpperCase()}*`,
    `Cliente: ${orderInput.customerName?.trim() || 'Não informado'}`,
    orderInput.address ? `Endereço: ${orderInput.address}` : 'Endereço: A informar',
    '',
    '*Itens:*'
  ];

  selectedItems.forEach((item) => {
    lines.push(
      `- ${item.quantity}x ${item.name} (${formatCurrency(item.unitPrice)}) = ${formatCurrency(item.subtotal)}`
    );
  });

  lines.push('');
  lines.push(`*Total:* ${formatCurrency(total)}`);
  lines.push(`*Pagamento:* ${paymentLine}`);

  if (orderInput.notes?.trim()) {
    lines.push(`*Observações:* ${orderInput.notes.trim()}`);
  }

  return {
    selectedItems,
    total,
    formattedTotal: formatCurrency(total),
    paymentMethod,
    paymentLine,
    message: lines.join('\n')
  };
}

function buildPaymentLine({ paymentMethod, changeFor, pixKey }) {
  if (paymentMethod === 'pix') {
    return `${paymentLabels[paymentMethod]} | Chave: ${pixKey}`;
  }

  if (paymentMethod === 'dinheiro') {
    return `${paymentLabels[paymentMethod]} | Troco para: ${changeFor || 'nao informado'}`;
  }

  if (paymentMethod === 'cartao') {
    return `${paymentLabels[paymentMethod]} | Pagar no recebimento`;
  }

  throw new Error('Forma de pagamento invalida.');
}
