import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from './utils/io.js';

function toArr(value) {
  if (value == undefined) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

const gameId = 'genshin-impact';
const dataType = 'character';

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', gameId, `${dataType}.json`);
  const data = await readJson(file);

  for (const charData of Object.values(data)) {
    const { name, effects = [] } = charData;

    for (const [index, effect] of effects.entries()) {
      for (const apply of toArr(effect.apply)) {
        if (apply.filter) {
          console.log(`${name}: Effect Index: ${index + 1}`);
        }
      }
    }
  }
}

await main();
