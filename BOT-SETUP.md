# Setup do Bot WhatsApp Local

Guia completo para deixar o bot respondendo no WhatsApp, rodando localmente no seu PC.

## Requisitos

- Node.js 20+ instalado
- npm 10+
- Internet ativa
- WhatsApp no celular para escanear QR Code

## Passo 1: Configurar arquivos de ambiente

1. Copie `backend/.env.example` para `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

2. Preencha no `backend/.env`:

```env
PORT=3001
WHATSAPP_SESSION_NAME=cardapio-web-bot
WHATSAPP_HEADLESS=true
PIX_KEY=000.000.000-00
STORE_WHATSAPP_NUMBER=5511999999999
```

## Passo 2: Iniciar o bot

### Opção A: Script simples (recomendado)

Apenas inicia o backend com o cliente do WhatsApp Web.

**Linux/macOS:**
```bash
./start-bot-auto.sh
```

**Windows:**
- Clique duplo em `start-bot-auto.bat`

**PowerShell:**
```bash
.\start-bot-auto.ps1
```

### Opção C: Comando manual

```bash
npm run start --workspace backend
```

## Passo 3: Escanear QR Code

Ao iniciar o backend, um QR Code vai aparecer no terminal.

1. Abra o WhatsApp no celular
2. Va em **Dispositivos conectados**
3. Toque em **Conectar um dispositivo**
4. Escaneie o QR Code exibido no terminal

Quando conectar, o backend exibira mensagem de pronto.

## Passo 4: Testar o Bot

1. Abra WhatsApp
2. Envie uma mensagem para o numero conectado no bot
3. Seu bot deveria responder com saudação + cardápio

## Como funciona

- **Bot ligado**: enquanto o backend estiver rodando → bot responde
  - Backend ativo na porta 3001
  - Cliente WhatsApp Web autenticado
  
- **Bot desligado**: fecha o script → bot não responde mais
  - Sessao fica salva localmente para reconexao nas proximas vezes

## Resumo: Do zero ao bot respondendo

1. **Copie** `backend/.env.example` → `backend/.env`
2. **Preencha** as variáveis (sessao, pix, numero da loja)
3. **Inicie** com `./start-bot-auto.sh` no Linux/macOS ou `start-bot-auto.bat` no Windows
4. **Escaneie** o QR Code no terminal
5. **Pronto!** Bot respondendo no WhatsApp

Tudo local, sem Meta Cloud API e sem ngrok.

## Troubleshooting

### "Backend rodando mas nenhuma mensagem chegando"

- [ ] O QR Code foi escaneado com sucesso?
- [ ] O backend exibiu "WhatsApp Web conectado e pronto"?
- [ ] O WhatsApp no celular ainda esta com internet?
- [ ] Tente reiniciar o backend e reescanear o QR Code

## Próximos passos

Após validar que o bot responde:

1. **Melhorar cardápio**: edite `backend/src/config/menu.js`
2. **Customizar resposta**: edite `backend/src/index.js` função `buildWelcomeText()`
3. **Persistência**: futuramente você pode adicionar banco de dados

---

**Dúvidas?** Verifique o README.md para contexto geral do projeto.
