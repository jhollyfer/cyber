#!/bin/sh
set -e

if [ -n "$VITE_API_BASE_URL" ] && [ "$VITE_API_BASE_URL" != "http://localhost:4000" ]; then
  node /app/replace-env.js
fi

exec "$@"
