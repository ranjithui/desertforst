// Lists utility classes used in src/ that the original compiled stylesheet does not define.
// Usage: node scripts/check-classes.mjs
import fs from 'fs';
import path from 'path';

const css = ['src/styles/site.css', 'src/styles/extra.css'].map(f => fs.readFileSync(f, 'utf8')).join('\n');
// Tailwind escapes punctuation with a backslash, except commas which become "\2c ".
const esc = cls => cls.replace(/([^a-zA-Z0-9_,-])/g, '\\$1').replace(/,/g, '\\2c ');
// Classes the original site also emits without matching CSS (e.g. opacity modifiers on
// CSS-variable colours) are no-ops there too, so they are reported separately.
const ORIGINAL_NOOPS = new Set(fs.existsSync('scripts/raw/original-noop-classes.txt')
  ? fs.readFileSync('scripts/raw/original-noop-classes.txt', 'utf8').split(/\r?\n/).filter(Boolean) : []);
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : /\.(jsx|js)$/.test(f) && files.push(p); } })('src');

const missing = new Map();
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  // className="…", className={`…`}, and string constants that look like class lists
  const chunks = [...src.matchAll(/className=(?:"([^"]+)"|\{`([^`]+)`\})/g)].map(m => m[1] || m[2]);
  chunks.push(...[...src.matchAll(/'([^'\n]*(?:flex|px-|text-|rounded|border|bg-)[^'\n]*)'/g)].map(m => m[1]));
  for (const chunk of chunks) {
    for (let tok of chunk.replace(/\$\{[^}]*\}/g, ' ').split(/\s+/)) {
      tok = tok.trim();
      if (!tok || /[{}'"`$]/.test(tok) || !/^[!a-z0-9[\-@&:.]/.test(tok)) continue;
      if (!css.includes('.' + esc(tok)) && !ORIGINAL_NOOPS.has(tok)) {
        if (!missing.has(tok)) missing.set(tok, new Set());
        missing.get(tok).add(path.relative('src', f));
      }
    }
  }
}
for (const [tok, fs_] of [...missing].sort()) console.log(tok.padEnd(50), [...fs_].join(', '));
console.log(`\n${missing.size} classes not found in site.css/extra.css`);
