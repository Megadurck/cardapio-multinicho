import WhatsAppWeb from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = WhatsAppWeb;

let client;
let isReady = false;
let lastQrCode = null;
let lastError = null;

function printQrCode(qr) {
  const qrCompact = process.env.WHATSAPP_QR_COMPACT !== 'false';

  qrcode.generate(qr, { small: true }, (rendered) => {
    if (!qrCompact) {
      console.log(rendered);
      return;
    }

    // Compacta horizontalmente para ocupar menos colunas no terminal.
    const compactRendered = rendered
      .split('\n')
      .map((line) => line.replace(/ {2}/g, ' '))
      .join('\n');

    console.log(compactRendered);
    console.log('Se ficar dificil de escanear, defina WHATSAPP_QR_COMPACT=false no backend/.env.');
  });
}

function toChatId(to) {
  if (!to) {
    throw new Error('Numero de destino nao informado.');
  }

  if (String(to).includes('@')) {
    return String(to);
  }

  const digits = String(to).replace(/\D/g, '');

  if (!digits) {
    throw new Error('Numero de destino invalido.');
  }

  return `${digits}@c.us`;
}

export function initializeWhatsAppClient({ onIncomingMessage } = {}) {
  if (client) {
    return client;
  }

  client = new Client({
    authStrategy: new LocalAuth({
      clientId: process.env.WHATSAPP_SESSION_NAME || 'cardapio-web-bot'
    }),
    puppeteer: {
      headless: process.env.WHATSAPP_HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on('qr', (qr) => {
    isReady = false;
    lastQrCode = qr;
    lastError = null;

    console.log('Escaneie o QR Code abaixo para conectar o WhatsApp:');
    printQrCode(qr);
  });

  client.on('authenticated', () => {
    console.log('WhatsApp autenticado com sucesso.');
  });

  client.on('ready', () => {
    isReady = true;
    lastQrCode = null;
    lastError = null;
    console.log('WhatsApp Web conectado e pronto para enviar/responder mensagens.');
  });

  client.on('auth_failure', (message) => {
    isReady = false;
    lastError = message || 'Falha de autenticacao no WhatsApp Web.';
    console.error('Falha de autenticacao:', lastError);
  });

  client.on('disconnected', (reason) => {
    isReady = false;
    console.warn('WhatsApp desconectado:', reason);
  });

  if (onIncomingMessage) {
    client.on('message', onIncomingMessage);
  }

  client.initialize().catch((error) => {
    lastError = error.message;
    console.error('Erro ao inicializar WhatsApp Web:', error.message);
  });

  return client;
}

export function getWhatsAppStatus() {
  return {
    ready: isReady,
    hasPendingQr: Boolean(lastQrCode),
    lastError
  };
}

export async function sendWhatsAppTextMessage({ to, body }) {
  if (!client) {
    throw new Error('Cliente WhatsApp nao inicializado.');
  }

  if (!isReady) {
    throw new Error('WhatsApp ainda nao esta pronto. Escaneie o QR Code e aguarde conectar.');
  }

  const chatId = toChatId(to);
  return client.sendMessage(chatId, body);
}
