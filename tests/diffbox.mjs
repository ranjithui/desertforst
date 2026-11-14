// Prints bounding boxes of differing regions in a diff PNG (red pixels), grouped in 100px bands.
import fs from 'fs';
import { PNG } from 'pngjs';
const img = PNG.sync.read(fs.readFileSync(process.argv[2]));
const bands = new Map();
for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
  const i = (y * img.width + x) * 4;
  if (img.data[i] > 200 && img.data[i + 1] < 80 && img.data[i + 2] < 80) {
    const b = Math.floor(y / 100);
    const r = bands.get(b) || { x0: x, x1: x, y0: y, y1: y, n: 0 };
    r.x0 = Math.min(r.x0, x); r.x1 = Math.max(r.x1, x); r.y1 = y; r.n++;
    bands.set(b, r);
  }
}
for (const [, r] of [...bands].sort((a, b) => a[0] - b[0])) console.log(`y ${r.y0}-${r.y1}  x ${r.x0}-${r.x1}  px ${r.n}`);
