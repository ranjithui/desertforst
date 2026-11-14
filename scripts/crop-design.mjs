// Crops photos out of the design mockups into public/media/ksbakers/design/ (WebP).
// Usage: node scripts/crop-design.mjs <mockup-dir>
//   expects bestsellers mockup "4.webp" (1671×941) and full-page mockup "6.webp" (823×1911).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const dir = process.argv[2];
const out = 'public/media/ksbakers/design';
fs.mkdirSync(out, { recursive: true });

// [source, name, x, y, w, h] in source pixels
const CROPS = [
  ['4.webp', 'bestseller-butterscotch', 55, 336, 400, 272],
  ['4.webp', 'bestseller-black-forest', 470, 346, 370, 256],
  ['4.webp', 'bestseller-almond-delight', 845, 352, 370, 252],
  ['4.webp', 'bestseller-choco-truffle', 1220, 354, 400, 250],
  ['6.webp', 'custom-floral-cake', 28, 1150, 300, 172],
  ['6.webp', 'stores-brownies', 30, 1466, 438, 140],
];

const b = await chromium.launch();
const p = await b.newPage();
for (const [src, name, x, y, w, h] of CROPS) {
  const data = fs.readFileSync(path.join(dir, src)).toString('base64');
  const url = await p.evaluate(async ({ data, x, y, w, h }) => {
    const img = new Image();
    img.src = `data:image/webp;base64,${data}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, x, y, w, h, 0, 0, w, h);
    return c.toDataURL('image/webp', 0.95);
  }, { data, x, y, w, h });
  fs.writeFileSync(path.join(out, `${name}.webp`), Buffer.from(url.split(',')[1], 'base64'));
  console.log(name, `${w}×${h}`);
}
await b.close();
