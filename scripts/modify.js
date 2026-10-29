import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from './utils/io.js';
import { fetchJson } from './utils/fetch.js';
import { getVersion } from './utils/getVersion.js';
import { skills } from './utils/parsers/zzzCharacter.js';

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', 'zenless-zone-zero', 'character.json');
  const data = await readJson(file);

  const version = await getVersion('zzz');
  const base = `https://static.nanoka.cc/zzz/${version}/en/character/`;

  const entries = Object.entries(data).filter(([, charData]) => charData.disabled);
  const length = entries.length;

  for (const [i, [id, charData]] of entries.entries()) {
    console.log(`Rescraping ${charData.name} (${i + 1}/${length})`);

    const raw = await fetchJson(`${base}${charData.id ?? id}.json`);
    charData.skills = skills(raw);
  }

  await writeJson(file, data);
}

await main();
