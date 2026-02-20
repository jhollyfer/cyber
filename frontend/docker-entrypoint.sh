#!/bin/sh
set -e

if [ -n "$VITE_API_BASE_URL" ] && [ "$VITE_API_BASE_URL" != "http://localhost:4000" ]; then
  echo "Configurando API URL: $VITE_API_BASE_URL"

  node -e "
    const fs = require('fs');
    const path = require('path');

    function replaceInDir(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          replaceInDir(full);
        } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
          const content = fs.readFileSync(full, 'utf8');
          if (content.includes('http://localhost:4000')) {
            fs.writeFileSync(full, content.replaceAll('http://localhost:4000', process.env.VITE_API_BASE_URL));
            console.log('  ->', entry.name);
          }
        }
      }
    }

    replaceInDir('/app/.output');
  "
fi

exec "$@"
