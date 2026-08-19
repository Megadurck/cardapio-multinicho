@echo off
setlocal enabledelayedexpansion

REM Script automatico para iniciar Bot local com whatsapp-web.js

color 0a
cls
echo =====================================
echo Bot WhatsApp Local - Setup Automatico
echo =====================================
echo.

REM Verificar se estamos na pasta correta
if not exist "backend\src\index.js" (
    color 0c
    echo Erro: Execute este script a partir da raiz do projeto!
    echo Verifique se voce nao moveu a pasta.
    pause
    exit /b 1
)

REM Verificar se o backend/.env existe
if not exist "backend\.env" (
    color 0e
    echo ==========================================
    echo AVISO: arquivo backend\.env nao encontrado!
    echo ==========================================
    echo.
    echo Passos para configurar:
    echo 1. Copie backend\.env.example para backend\.env
    echo 2. Abra backend\.env e preencha:
    echo    - WHATSAPP_SESSION_NAME
    echo    - WHATSAPP_HEADLESS
    echo    - PIX_KEY
    echo    - STORE_WHATSAPP_NUMBER
    echo.
    echo Depois execute este script novamente.
    echo.
    pause
    exit /b 1
)

REM Iniciar o backend em background
echo Iniciando Backend na porta 3001...
start "Bot Backend" npm run start --workspace backend
echo [OK] Backend iniciado!
echo.

color 0a
echo.
echo ==========================================
echo SISTEMA ATIVO!
echo ==========================================
echo.
echo Backend: http://localhost:3001
echo.
echo Escaneie o QR Code no terminal do backend.
echo Apos conectar, o bot respondera automaticamente.
echo.
echo Seu bot WhatsApp esta respondendo!
echo.
echo PARA DESLIGAR O BOT:
echo - Feche a janela do backend
echo.
pause
