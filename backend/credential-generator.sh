#!/bin/bash

openssl genrsa -out temp_private.pem 2048
openssl rsa -in temp_private.pem -pubout -out temp_public.pem

# Base64 encoding com suporte para macOS e Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    JWT_PRIVATE_KEY=$(base64 < temp_private.pem | tr -d '\n')
    JWT_PUBLIC_KEY=$(base64 < temp_public.pem | tr -d '\n')
else
    JWT_PRIVATE_KEY=$(base64 -w 0 temp_private.pem)
    JWT_PUBLIC_KEY=$(base64 -w 0 temp_public.pem)
fi

COOKIE_SECRET=$(openssl rand -hex 32)

# Arquivos de ambiente a serem atualizados
ENV_FILES=("./backend/.env" "./backend/.env.test")

update_env_file() {
    local file="$1"

    if [ ! -f "$file" ]; then
        touch "$file"
    fi

    remove_key() {
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "/^$1=/d" "$file"
        else
            sed -i "/^$1=/d" "$file"
        fi
    }

    remove_key "JWT_PRIVATE_KEY"
    remove_key "JWT_PUBLIC_KEY"
    remove_key "COOKIE_SECRET"

    echo "JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}" >> "$file"
    echo "JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}" >> "$file"
    echo "COOKIE_SECRET=${COOKIE_SECRET}" >> "$file"
}

# Atualizar todos os arquivos de ambiente
for env_file in "${ENV_FILES[@]}"; do
    if [ "$env_file" == "./backend/.env" ] || [ "$env_file" == "./backend/.env.test" ]; then
        update_env_file "$env_file"
        echo "✅ Chaves geradas em Base64 e salvas em $env_file"
    fi
done

rm temp_private.pem temp_public.pem
