import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from './utils/io';
import { fetchJson } from './utils/fetch';

function getColoredText(str) {
  return str.match(/<color=[^>]+>(.*?)<\/color>/)?.[1] ?? null;
}

function addRankModify(result, data, rank) {
  const talentName = getColoredText(data.constellations[rank - 1].desc);

  const key = ['elementalBurst', 'elementalSkill', 'normalAttack']
    .find((key) => result[key].name === talentName)
    ?? 'normalAttack';

  const { actions, ...rest } = result[key];

  result[key] = {
    ...rest,
    rankModify: rank,
    actions,
  };
}

const skillIds = [
  'normalAttack',
  'elementalSkill',
  'elementalBurst',
  'elementalBurst',
];

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = path.join(root, 'src/data', 'genshin-impact', 'character.json');
  const data = await readJson(file);

  for (const charData of Object.values(data)) {
    const { id, skills } = charData;
    const responseData = fetchJson(`https://static.nanoka.cc/gi/7.1.51/en/character/${id}.json`);

    for (const [index, value] of responseData.skills.entries()) {
      const { promote } = value;
      if (Object.keys(promote).length !== 15) continue;
      const { name } = value;
      const skillId = skillIds[index];

      skills[skillId].name = name;
    }

    addRankModify(skills, responseData, 3);
    addRankModify(skills, responseData, 5);
  }

  await writeJson(file, data);
}

await main();
