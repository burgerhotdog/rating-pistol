import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from './utils/io.js';
import { fetchJson } from './utils/fetch.js';
import { getVersion } from './utils/getVersion.js';

const gameId = 'genshin-impact';
const gameUrl = 'gi';
const dataType = 'character';

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', gameId, `${dataType}.json`);
  const data = await readJson(file);

  const version = await getVersion(gameUrl);
  const base = `https://static.nanoka.cc/${gameUrl}/${version}/en/${dataType}/`;

  for (const charData of Object.values(data)) {
    const { id, name } = charData;
    console.log(`Modifying ${name}`);

    const scraped = await fetchJson(`${base}${id}.json`);
    charData.region = scraped.chara_info.region.replace(/^ASSOC_TYPE_/, '').toLowerCase();
  }

  await writeJson(file, data);
}

await main();
