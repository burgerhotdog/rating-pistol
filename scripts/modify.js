import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from './utils/io.js';
import { fetchJson } from './utils/fetch.js';
import { getVersion } from './utils/getVersion.js';
import { skills } from './utils/parsers/zzzCharacter.js';

const gameId = 'zenless-zone-zero';
const gameUrl = 'zzz';
const dataType = 'weapon';

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', gameId, `${dataType}.json`);
  const data = await readJson(file);

  const version = await getVersion(gameUrl);
  const base = `https://static.nanoka.cc/${gameUrl}/${version}/en/${dataType}/`;

  /*
  const charDatas = Object.values(data);
  for (const [i, charData] of charDatas.entries()) {
    console.log(`(${i + 1}/${charDatas.length}) Modifying ${charData.name}`);

    const raw = await fetchJson(`${base}${charData.id}.json`);
    charData.skills = skills(raw);
  }
  */

  const weapDatas = Object.values(data);
  for (const [i, weapData] of weapDatas.entries()) {
    console.log(`(${i + 1}/${weapDatas.length}) Modifying ${weapData.name}`);

    const raw = await fetchJson(`${base}${weapData.id}.json`);
    const value = Math.floor(raw.base_property.value * 14.87);

    if (weapData.type === 'armorer') {
      weapData.stats.baseDef = value;
    } else {
      weapData.stats.baseAtk = value;
    }
  }

  await writeJson(file, data);
}

await main();
