import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from './utils/io.js';

const gameId = 'genshin-impact';
const dataType = 'weapon';

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', gameId, `${dataType}.json`);
  const data = await readJson(file);

  for (const charData of Object.values(data)) {
    const { name, effects = [] } = charData;

    for (const [i, effect] of effects.entries()) {
      const { buff } = effect;
      if (!buff) continue;

      const toCheck = Array.isArray(buff) ? buff : [buff];

      for (const buffDef of toCheck) {
        if (buffDef.commands) {
          console.log(`Found: ${name} Effect ${i + 1}`);
        }
      }
    }
  }
}

await main();
