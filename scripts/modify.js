import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from './utils/io.js';
import { fetchJson } from './utils/fetch.js';

const skillIds = ['normalAttack', 'elementalSkill', 'elementalBurst'];

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', 'genshin-impact', 'character.json');
  const data = await readJson(file);

  const charDatas = Object.values(data);
  const length = charDatas.length;

  for (const [i, charData] of charDatas.entries()) {
    console.log(`Modifying ${charData.name} (${i + 1}/${length})`);

    if (!charData.disabled) continue;

    const naActions = charData.skills.normalAttack.actions;

    const lastThree = naActions.slice(-3);

    if (
      lastThree[0]?.name === 'Plunge Collision' &&
      lastThree[1]?.name === 'Plunging Attack: Low' &&
      lastThree[2]?.name === 'Plunging Attack: High'
    ) {
      const [collision] = naActions.splice(-3, 1);
      naActions.push(collision);

      console.log(`Reordered plunge actions for ${charData.name}`);
    }
  }

  await writeJson(file, data);
}

await main();
