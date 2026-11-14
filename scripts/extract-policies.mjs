// Converts the rendered legal pages into structured JSON blocks (src/data/policies.json).
// Usage: node scripts/extract-policies.mjs <dir-with-rendered-html>
import fs from 'fs';

const dir = process.argv[2];
const decode = s => s.replace(/<!--.*?-->/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const out = {};

for (const slug of ['privacy-policy', 'terms-and-conditions', 'cancellation-and-refund-policy']) {
  const html = fs.readFileSync(`${dir}/${slug}.html`, 'utf8').replace(/\n/g, '');
  const body = html.slice(html.indexOf('<header class="mb-10'), html.indexOf('<footer class="relative overflow-hidden bg-accent'));
  const title = decode(body.match(/<h1[^>]*>(.*?)<\/h1>/)[1]);
  const updated = decode(body.match(/Last updated:(.*?)<\/p>/)?.[1] || '');
  const intro = [];
  const sections = [];
  let current = null;
  let list = null;
  for (const m of body.slice(body.indexOf('</p>', body.indexOf('Last updated'))).matchAll(/<(h2|h3|p|li)\b[^>]*>(.*?)<\/\1>/g)) {
    const [, tag, inner] = m;
    const text = decode(inner);
    if (!text) continue;
    if (tag === 'h2') { current = { heading: text, blocks: [] }; sections.push(current); list = null; continue; }
    const target = current ? current.blocks : intro;
    if (tag === 'li') {
      if (!list) { list = { type: 'ul', items: [] }; target.push(list); }
      list.items.push(text);
    } else {
      list = null;
      target.push({ type: tag, text });
    }
  }
  out[slug] = { title, updated, intro, sections };
  console.log(slug, sections.length, 'sections');
}
fs.writeFileSync('src/data/policies.json', JSON.stringify(out, null, 1));
