#!/bin/bash
# Script de configuração inicial para 3D Management Desktop
# Initial setup script for 3D Management Desktop

set -e  # Exit on error

echo "========================================"
echo "3D Management Desktop - Setup"
echo "========================================"
echo ""

# Check Node.js version
echo "Verificando versão do Node.js..."
echo "Checking Node.js version..."
node_version=$(node -v 2>/dev/null || echo "")
if [ -z "$node_version" ]; then
    echo "❌ ERRO: Node.js não está instalado!"
    echo "❌ ERROR: Node.js is not installed!"
    echo ""
    echo "Por favor, instale Node.js v18 ou superior:"
    echo "Please install Node.js v18 or higher:"
    echo "https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $node_version detectado"
echo "✅ Node.js $node_version detected"
echo ""

# Check npm version
echo "Verificando versão do npm..."
echo "Checking npm version..."
npm_version=$(npm -v)
echo "✅ npm $npm_version detectado"
echo "✅ npm $npm_version detected"
echo ""

# Install dependencies
echo "========================================"
echo "Passo 1: Instalando dependências..."
echo "Step 1: Installing dependencies..."
echo "========================================"
npm install
echo ""
echo "✅ Dependências instaladas com sucesso!"
echo "✅ Dependencies installed successfully!"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "========================================"
    echo "Passo 2: Criando arquivo .env.local..."
    echo "Step 2: Creating .env.local file..."
    echo "========================================"
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado!"
    echo "✅ .env.local file created!"
    echo ""
    echo "ℹ️  Você pode editar .env.local para configurar:"
    echo "ℹ️  You can edit .env.local to configure:"
    echo "   - GEMINI_API_KEY (opcional / optional)"
    echo "   - DB_PATH (opcional / optional)"
    echo ""
else
    echo "ℹ️  Arquivo .env.local já existe, pulando..."
    echo "ℹ️  .env.local file already exists, skipping..."
    echo ""
fi

# Run database migrations
echo "========================================"
echo "Passo 3: Inicializando banco de dados..."
echo "Step 3: Initializing database..."
echo "========================================"
npm run migrate
echo ""
echo "✅ Banco de dados inicializado!"
echo "✅ Database initialized!"
echo ""

# Verify database was created
if [ -f "src/db/3d-management.sqlite" ]; then
    db_size=$(du -h src/db/3d-management.sqlite | cut -f1)
    echo "✅ Banco de dados criado: src/db/3d-management.sqlite ($db_size)"
    echo "✅ Database created: src/db/3d-management.sqlite ($db_size)"
    echo ""
fi

# Success message
echo "========================================"
echo "✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!"
echo "✅ SETUP COMPLETED SUCCESSFULLY!"
echo "========================================"
echo ""
echo "Para executar o programa:"
echo "To run the program:"
echo ""
echo "  npm run dev"
echo ""
echo "Para gerar executável Windows:"
echo "To generate Windows executable:"
echo ""
echo "  npm run build:win"
echo ""
echo "Para mais informações, consulte:"
echo "For more information, see:"
echo "  - COMO_EXECUTAR.md (Português)"
echo "  - README.md (English)"
echo ""
echo "========================================"
