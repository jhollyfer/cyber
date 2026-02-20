const fs = require('fs');
const path = require('path');

const target = process.env.VITE_API_BASE_URL;

if (!target) {
  console.log('VITE_API_BASE_URL not set, skipping replacement');
  process.exit(0);
}

console.log(`Replacing http://localhost:4000 -> ${target}`);

function replaceInDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(full);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('http://localhost:4000')) {
        fs.writeFileSync(
          full,
          content.replaceAll('http://localhost:4000', target),
        );
        console.log('  ->', entry.name);
      }
    }
  }
}

replaceInDir('/app/.output');
