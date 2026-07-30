import { WW, CHARACTER } from '@/data';
import { toMergedObj } from '@/utils';
import { WW_TABLE } from './stats/assignSub';
import { WUWA_MAINSTAT_VALUES } from './stats/values';

export function getPrydwenBenchmark(gameId, charId, baseMap, configMap, runRotation) {
  const character = CHARACTER[gameId][charId];
  const prydwen = character.presets?.[0]?.prydwen ?? ['atk%', 'critRate%', 'critDmg%'];

  const prydwenMap = {};
  if (gameId === WW) {
    for (const stat of prydwen) {
      const low = WW_TABLE[stat][0];
      const high = WW_TABLE[stat].at(-1);
      prydwenMap[stat] = 5 * (low + high) / 2;
    }
  }

  const bestConfig = Object.entries(configMap).sort((a, b) => b.count - a.count)[0];
  const mainstats = bestConfig[0].split('|');
  for (const stat of mainstats) {
    prydwenMap[stat] ??= 0;
  }
  const [cost4, cost3a, cost3b, cost1a, cost1b] = mainstats;
  prydwenMap[cost4] += WUWA_MAINSTAT_VALUES[4][cost4];
  prydwenMap[cost3a] += WUWA_MAINSTAT_VALUES[3][cost3a];
  prydwenMap[cost3b] += WUWA_MAINSTAT_VALUES[3][cost3b];
  prydwenMap[cost1a] += WUWA_MAINSTAT_VALUES[1][cost1a];
  prydwenMap[cost1b] += WUWA_MAINSTAT_VALUES[1][cost1b];

  prydwenMap.atk ??= 0;
  prydwenMap.atk += 350;
  prydwenMap.hp ??= 0;
  prydwenMap.hp += 4560;

  const buildMap = toMergedObj(baseMap, prydwenMap);

  return runRotation(buildMap);
}
