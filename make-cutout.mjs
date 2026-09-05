import sharp from 'sharp';

const image = sharp('101.jpg');
const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const visited = new Uint8Array(width * height);
const queue = [];

function isCheckerboard(index) {
  const r = data[index], g = data[index + 1], b = data[index + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max - min < 18 && max > 150;
}

function visit(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const point = y * width + x;
  if (visited[point]) return;
  visited[point] = 1;
  const index = point * channels;
  if (!isCheckerboard(index)) return;
  data[index + 3] = 0;
  queue.push([x, y]);
}

for (let x = 0; x < width; x++) { visit(x, 0); visit(x, height - 1); }
for (let y = 0; y < height; y++) { visit(0, y); visit(width - 1, y); }
for (let i = 0; i < queue.length; i++) {
  const [x, y] = queue[i];
  visit(x + 1, y); visit(x - 1, y); visit(x, y + 1); visit(x, y - 1);
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile('omkar-tupe-cutout.png');
