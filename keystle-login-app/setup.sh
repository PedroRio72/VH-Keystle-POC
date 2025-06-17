#!/bin/bash

# Script de configuração para o projeto Keystle Authentication Demo
echo "🚀 Configurando o ambiente para Keystle Authentication Demo"

# Diretório base
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BASE_DIR"

echo "📁 Diretório de trabalho: $(pwd)"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
  echo "❌ Node.js não encontrado! Por favor, instale o Node.js v16+ antes de continuar."
  exit 1
fi

echo "✅ Node.js encontrado: $(node -v)"

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
  echo "❌ npm não encontrado! Por favor, verifique sua instalação do Node.js."
  exit 1
fi

echo "✅ npm encontrado: $(npm -v)"

# Entrar no diretório do frontend
cd frontend
echo "📁 Entrando no diretório do frontend: $(pwd)"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se o Angular CLI está instalado (local ao projeto)
if ! ./node_modules/.bin/ng version &> /dev/null; then
  echo "📦 Angular CLI não encontrado, instalando localmente..."
  npm install @angular/cli
fi

echo "✅ Angular CLI configurado"

# Verificar se o Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
  echo "🔥 Firebase CLI não encontrado. Instalando localmente..."
  npm install -g firebase-tools || npm install firebase-tools
fi

echo "✅ Firebase CLI configurado"

# Mensagem final
echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  cd frontend"
echo "  npx ng serve"
echo ""
echo "Para fazer o build da aplicação:"
echo "  cd frontend"
echo "  npx ng build"
echo ""
echo "Para fazer o deploy no Firebase (após configuração inicial):"
echo "  cd frontend"
echo "  firebase login"
echo "  firebase init"
echo "  firebase deploy"
echo ""
echo "IMPORTANTE: Lembre-se de atualizar o clientId em src/app/auth.ts"
echo "com o Client ID registrado no portal do Keystle."
echo ""
