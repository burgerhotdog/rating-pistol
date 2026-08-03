import { WW, CHARACTER, MAINSTAT, SUBSTAT } from '@/data';
import { toMergedObj } from '@/utils';

export function getPrydwenBenchmark(gameId, charId, baseMap, configMap, runRotation) {
  const character = CHARACTER[gameId][charId];
  const prydwen = character.presets?.[0]?.prydwen ?? ['atk%', 'critRate%', 'critDmg%'];

  const prydwenMap = {};
  if (gameId === WW) {
    for (const stat of prydwen) {
      const { rollValues } = SUBSTAT[WW][stat];

      const min = rollValues[0];
      const max = rollValues.at(-1);
      const middle = (min + max) / 2;

      prydwenMap[stat] = middle * 5;
    }
  }

  const bestConfig = Object.entries(configMap).sort((a, b) => b.count - a.count)[0];
  const mainstats = bestConfig[0].split('|');
  for (const stat of mainstats) prydwenMap[stat] ??= 0;
  const [cost4, cost3a, cost3b, cost1a, cost1b] = mainstats;

  prydwenMap[cost4] += MAINSTAT[WW][4][cost4].value;
  prydwenMap[cost3a] += MAINSTAT[WW][3][cost3a].value;
  prydwenMap[cost3b] += MAINSTAT[WW][3][cost3b].value;
  prydwenMap[cost1a] += MAINSTAT[WW][1][cost1a].value;
  prydwenMap[cost1b] += MAINSTAT[WW][1][cost1b].value;

  prydwenMap.atk ??= 0;
  prydwenMap.atk += 350;
  prydwenMap.hp ??= 0;
  prydwenMap.hp += 4560;

  const buildMap = toMergedObj(baseMap, prydwenMap);

  return runRotation(buildMap);
}
