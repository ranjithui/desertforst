// Crops the same region from orig + local screenshots side by side: node tests/crop.mjs <base> x y w h out.png
import fs from 'fs';
import { PNG } from 'pngjs';
const [,, base, x, y, w, h, out] = process.argv.map((v, i) => (i >= 3 && i <= 6 ? +v : v));
const A = PNG.sync.read(fs.readFileSync(`${base}.orig.png`)), B = PNG.sync.read(fs.readFileSync(`${base}.local.png`));
const o = new PNG({ width: w * 2 + 10, height: h }); o.data.fill(255);
PNG.bitblt(A, o, x, y, Math.min(w, A.width - x), Math.min(h, A.height - y), 0, 0);
PNG.bitblt(B, o, x, y, Math.min(w, B.width - x), Math.min(h, B.height - y), w + 10, 0);
fs.writeFileSync(out, PNG.sync.write(o));
