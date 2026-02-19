#!/bin/sh
set -e

# Substitutes placeholder by real API URL at runtime
if [ -n "$VITE_API_BASE_URL" ] && [ "$VITE_API_BASE_URL" != "http://localhost:4000" ]; then
  echo "Configuring API URL: $VITE_API_BASE_URL"

  # Substitutes in all JS files of build
  find /app/.output \( -name "*.js" -o -name "*.mjs" \) -type f -exec sed -i "s|http://localhost:4000|$VITE_API_BASE_URL|g" {} +
fi

exec "$@"
