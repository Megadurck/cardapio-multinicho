#!/usr/bin/env bash

set -euo pipefail

if [[ ! -f "backend/src/index.js" ]]; then
  echo "Erro: execute este script a partir da raiz do projeto." >&2
  exit 1
fi

if [[ ! -f "backend/.env" ]]; then
  echo "Erro: backend/.env nao encontrado." >&2
  echo "Crie-o com: cp backend/.env.example backend/.env" >&2
  exit 1
fi

echo "Iniciando o backend na porta 3001..."
echo "Escaneie o QR Code exibido neste terminal."
exec npm run start --workspace backend