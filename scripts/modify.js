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
    const filteredActions = naActions.filter(
      (action) => action.name !== 'Plunge Collision'
    );

    if (filteredActions.length !== naActions.length) {
      charData.skills.normalAttack.actions = filteredActions;
      console.log(`Removed Plunge Collision actions for ${charData.name}`);
    }
  }

  await writeJson(file, data);
}

await main();
