# Script automatico para iniciar o bot local com whatsapp-web.js
# Executa com: .\start-bot-auto.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Bot WhatsApp Local - Setup Automatico" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos na pasta correta
if (-Not (Test-Path "backend\src\index.js")) {
    Write-Host "Erro: Execute este script a partir da raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Verificar se o backend/.env existe
if (-Not (Test-Path "backend\.env")) {
    Write-Host "AVISO: arquivo backend\.env nao encontrado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Passos para configurar:" -ForegroundColor Yellow
    Write-Host "1. Copie backend\.env.example para backend\.env" -ForegroundColor Yellow
    Write-Host "2. Abra backend\.env e preencha:" -ForegroundColor Yellow
    Write-Host "   - WHATSAPP_SESSION_NAME" -ForegroundColor Yellow
    Write-Host "   - WHATSAPP_HEADLESS" -ForegroundColor Yellow
    Write-Host "   - PIX_KEY" -ForegroundColor Yellow
    Write-Host "   - STORE_WHATSAPP_NUMBER" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione ENTER depois de configurar"
    exit 1
}

# Iniciar o backend
Write-Host "Iniciando Backend na porta 3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start --workspace backend"
Write-Host "[OK] Backend iniciado!" -ForegroundColor Green
Write-Host ""

Write-Host "Escaneie o QR Code que aparecer no terminal do backend." -ForegroundColor Cyan
Write-Host "Depois de conectado, o bot respondera automaticamente no WhatsApp." -ForegroundColor Cyan

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "SISTEMA ATIVO!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Seu bot WhatsApp esta respondendo!" -ForegroundColor Green
Write-Host ""
Write-Host "PARA DESLIGAR O BOT:" -ForegroundColor Yellow
Write-Host "- Feche a janela do backend" -ForegroundColor Yellow
Write-Host ""

Read-Host "Pressione ENTER para sair"
