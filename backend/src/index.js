import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { menu, restaurant } from './config/menu.js';
import { buildOrderPreview } from './services/orderMessageBuilder.js';
import { initializeWhatsAppClient, sendWhatsAppTextMessage, getWhatsAppStatus } from './services/whatsappWebClient.js';

const app = express();
const port = process.env.PORT || 3001;
const targetGroupName = process.env.WHATSAPP_TARGET_GROUP_NAME || 'Rascunho';
const allowSelfTest = process.env.WHATSAPP_ALLOW_SELF_TEST === 'true';
const menuWebUrl = process.env.WEB_MENU_URL || process.env.FRONTEND_URL || 'http://localhost:5173';

function normalizeGroupName(name) {
  return String(name || '')
    .trim()
    .toLowerCase();
}

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/menu', (_req, res) => {
  res.json(menu);
});

app.post('/api/orders/preview', (req, res) => {
  try {
    const { customerName, address, items, paymentMethod, changeFor, notes } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Campo items precisa ser uma lista.' });
    }

    if (paymentMethod === 'dinheiro' && !changeFor) {
      return res.status(400).json({ error: 'Informe troco para pagamento em dinheiro.' });
    }

    const preview = buildOrderPreview({
      customerName,
      address,
      items,
      paymentMethod,
      changeFor,
      notes
    });

    return res.json(preview);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/whatsapp/status', (_req, res) => {
  return res.json(getWhatsAppStatus());
});

app.post('/api/whatsapp/send-message', async (req, res) => {
  try {
    const { to, text } = req.body;

    if (!to || !text) {
      return res.status(400).json({ error: 'Campos to e text sao obrigatorios.' });
    }

    const response = await sendWhatsAppTextMessage({ to, body: text });

    return res.json({ success: true, response });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

function buildWelcomeText() {
  const lines = [
    'Ola! Seja bem-vindo(a).',
    `Obrigado por entrar em contato com a ${restaurant.branding.name}!`,
    '',
    `Cardapio online: ${menuWebUrl}`,
    '',
    'Aqui esta um resumo do cardapio:'
  ];

  for (const category of menu.categories) {
    lines.push('');
    lines.push(`*${category.name}*`);

    for (const item of category.items) {
      lines.push(`- ${item.name}: R$ ${item.price.toFixed(2).replace('.', ',')}`);
    }
  }

  lines.push('');
  lines.push('Para pedir online, acesse nosso cardapio web e finalize pelo WhatsApp.');

  return lines.join('\n');
}

initializeWhatsAppClient({
  onIncomingMessage: async (message) => {
    try {
      const chat = await message.getChat();
      const isTargetGroup = chat.isGroup && normalizeGroupName(chat.name) === normalizeGroupName(targetGroupName);
      const isPrivateChat = !chat.isGroup;

      if (!isPrivateChat && !isTargetGroup) {
        console.log(`Mensagem ignorada: grupo "${chat.name}" diferente de "${targetGroupName}".`);
        return;
      }

      if (message.fromMe) {
        if (!allowSelfTest) {
          console.log('Mensagem ignorada: enviada pela propria conta (fromMe).');
          return;
        }

        if (message.body?.trim().toLowerCase() !== '/menu') {
          console.log('Mensagem ignorada (self-test): use /menu para testar sem loop.');
          return;
        }
      }

      await sendWhatsAppTextMessage({
        to: message.from,
        body: buildWelcomeText()
      });

      console.log(`Resposta enviada no grupo "${chat.name}".`);
    } catch (error) {
      console.error('Erro ao responder mensagem recebida:', error.message);
    }
  }
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
