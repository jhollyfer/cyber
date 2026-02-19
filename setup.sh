#!/bin/bash

# Script de configuracao inicial do projeto CyberGuardian
# Automatiza a criacao de arquivos .env e geracao de credenciais

set -e

echo "Configurando projeto CyberGuardian..."
echo ""

# Verificar se estamos na raiz do projeto
if [ ! -f "docker-compose.yml" ]; then
    echo "Execute este script na raiz do projeto (onde esta o docker-compose.yml)"
    exit 1
fi

echo "1. Configurando Backend..."

if [ ! -f "./backend/.env.example" ]; then
    echo "Arquivo ./backend/.env.example nao encontrado"
    exit 1
fi

cp ./backend/.env.example ./backend/.env
echo "   Arquivo ./backend/.env criado"

if [ -f "./backend/.env.test.example" ]; then
    cp ./backend/.env.test.example ./backend/.env.test
    echo "   Arquivo ./backend/.env.test criado"
fi

if [ ! -f "./backend/credential-generator.sh" ]; then
    echo "Arquivo ./backend/credential-generator.sh nao encontrado"
    exit 1
fi

chmod +x ./backend/credential-generator.sh
echo "   Gerando credenciais JWT..."
./backend/credential-generator.sh

echo ""
echo "2. Configurando Frontend..."

if [ ! -f "./frontend/.env.example" ]; then
    echo "   Arquivo ./frontend/.env.example nao encontrado"
    exit 1
fi

cp ./frontend/.env.example ./frontend/.env
echo "   Arquivo ./frontend/.env criado"

echo ""
echo "3. Configurando .env na raiz para Docker Compose..."

if [ -f ".env" ]; then
    rm .env
    echo "   Arquivo .env antigo removido"
fi

echo "# Backend Configuration" >> .env
cat ./backend/.env >> .env

echo "" >> .env
echo "# Frontend Configuration" >> .env
cat ./frontend/.env >> .env

echo "   Arquivo .env da raiz configurado"

echo ""
echo "Configuracao concluida com sucesso!"
echo ""
echo "Proximos passos:"
echo "   1. Execute: docker compose up --build"
echo "   2. Em outro terminal: docker exec cyberguardian-backend npx prisma db seed"
echo ""
echo "Acessos:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Docs:     http://localhost:4000/documentation"
echo ""
