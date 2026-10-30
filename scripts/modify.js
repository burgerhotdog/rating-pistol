import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from './utils/io.js';
import { fetchJson } from './utils/fetch.js';
import { getVersion } from './utils/getVersion.js';

const gameId = 'wuthering-waves';
const gameUrl = 'ww';
const dataType = 'character';

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', gameId, `${dataType}.json`);
  const data = await readJson(file);

  const version = await getVersion(gameUrl);
  const base = `https://static.nanoka.cc/${gameUrl}/${version}/en/${dataType}/`;

  const charDatas = Object.values(data);
  for (const [i, charData] of charDatas.entries()) {
    console.log(`(${i + 1}/${charDatas.length}) Modifying ${charData.name}`);

    for (const skill of Object.values(charData.skills)) {
      for (const action of Object.values(skill.actions)) {
        if (action.damage) {
          for (const hit of action.damage.multipliers) {
            if ('times' in hit && Object.keys(hit).at(-1) !== 'times') {
              const times = hit.times;
              delete hit.times;
              hit.times = times;
            }
          }
        }

        if (action.healing) {
          for (const hit of action.healing.multipliers) {
            if ('times' in hit && Object.keys(hit).at(-1) !== 'times') {
              const times = hit.times;
              delete hit.times;
              hit.times = times;
            }
          }
        }

        if (action.shield) {
          for (const hit of action.shield.multipliers) {
            if ('times' in hit && Object.keys(hit).at(-1) !== 'times') {
              const times = hit.times;
              delete hit.times;
              hit.times = times;
            }
          }
        }
      }
    }
  }

  await writeJson(file, data);
}

await main();
