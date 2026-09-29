import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson, writeJson } from './utils/io.js';
import { fetchJson } from './utils/fetch.js';

function getColoredText(str) {
  const text = str.match(/<color=[^>]+>(.*?)<\/color>/)?.[1];

  if (text?.includes('{LINK#')) {
    console.log('Found LINK text:', text);
  }

  return text
    ?.replace(/\{LINK#[^}]+\}/, '')
    .replace('{/LINK}', '')
    ?? null;
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

  const charDatas = Object.values(data);
  const length = charDatas.length;

  for (const [i, charData] of charDatas.entries()) {
    const { id, name, skills } = charData;
    console.log(`Modifying ${name} (${i + 1}/${length})`);
    const responseData = await fetchJson(`https://static.nanoka.cc/gi/7.1.51/en/character/${id}.json`);

    for (const [index, value] of responseData.skills.entries()) {
      const { promote } = value;
      if (Object.keys(promote).length !== 15) continue;
      const skillName = value.name;
      const skillId = skillIds[index];

      skills[skillId].name = skillName;
    }

    addRankModify(skills, responseData, 3);
    addRankModify(skills, responseData, 5);
  }

  await writeJson(file, data);
}

await main();
