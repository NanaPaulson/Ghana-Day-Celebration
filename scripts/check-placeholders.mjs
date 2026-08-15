import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const patterns = [
  'TIME_PLACEHOLDER',
  'CONTACT_EMAIL',
  'VENDOR_FORM_URL',
  'SPONSOR_PDF_URL',
  'MAILERLITE_ENDPOINT',
  'DEADLINE_PLACEHOLDER',
  '$PRICE',
];

const skipDirs = new Set(['node_modules', 'dist', '.git', '.astro']);

/** @param {string} dir @param {string[]} files */
function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (skipDirs.has(entry)) continue;
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

const filesToCheck = [
  join(root, 'src', 'constants.ts'),
  join(root, 'src', 'components', 'Vendors.astro'),
  join(root, 'src', 'components', 'Sponsors.astro'),
  ...walk(join(root, 'src', 'content')),
];

const hits = [];

for (const file of filesToCheck) {
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('isPlaceholder')) return;
    for (const pattern of patterns) {
      if (line.includes(pattern)) {
        hits.push({ file: relative(root, file), line: index + 1, pattern });
      }
    }
  });
}

if (hits.length === 0) {
  console.log('No launch placeholders found.');
  process.exit(0);
}

console.log('Launch placeholders still present:\n');
for (const hit of hits) {
  console.log(`  ${hit.pattern} → ${hit.file}:${hit.line}`);
}

console.log(`\n${hits.length} placeholder reference(s) found.`);
console.log('Update src/constants.ts and content files before going live.');
process.exit(1);
