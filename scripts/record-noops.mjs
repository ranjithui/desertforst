// Records classes that appear in the original rendered pages but have no rule in the original CSS
// (they are no-ops on ksbakers.com too, so the port keeps them for fidelity).
// Usage: node scripts/record-noops.mjs <file-with-one-class-per-line>
import fs from 'fs';

const css = fs.readFileSync('src/styles/site.css', 'utf8');
const esc = c => c.replace(/([^a-zA-Z0-9_,-])/g, '\\$1').replace(/,/g, '\\2c ');
const toks = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter(Boolean);
const noop = toks.filter(t => !css.includes('.' + esc(t)));
fs.writeFileSync('scripts/raw/original-noop-classes.txt', noop.join('\n'));
console.log('original no-op classes:', noop.length);
console.log(noop.join(' '));
