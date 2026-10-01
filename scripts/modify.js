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
    const { id, name } = charData;
    if (name === 'Skirk' || name === 'Mavuika') continue;
    console.log(`Modifying ${name} (${i + 1}/${length})`);
    const responseData = await fetchJson(`https://static.nanoka.cc/gi/7.1.51/en/character/${id}.json`);

    const burstSkill = responseData.skills
      .filter(({ promote }) => Object.keys(promote).length === 15)
      .map((dataSkill, i) => ({ ...dataSkill, type: skillIds[i] }))
      .find(({ type }) => type === 'elementalBurst');

    const { promote } = burstSkill;
    const { desc, param } = promote[0];
    const energyDescStr = desc.find((str) => str.startsWith('Energy Cost'));
    const matches = [...energyDescStr.matchAll(/\{param(\d+):[^}]+\}/g)];
    const energyParamIndex = Number(matches[0][1]) - 1;
    const energy = param[energyParamIndex];
    charData.energy = energy;
  }

  await writeJson(file, data);
}

await main();
