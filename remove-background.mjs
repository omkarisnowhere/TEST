import { readFile, writeFile } from 'node:fs/promises';
import { removeBackground } from '@imgly/background-removal';

const source = await readFile('omkar-tupe.png');
const result = await removeBackground(new Blob([source], { type: 'image/png' }), {
  progress: (_key, _current, _total) => {},
});
await writeFile('omkar-tupe-cutout.png', Buffer.from(await result.arrayBuffer()));
