import { SUBSTAT } from '@/data';
import { toMergedObj } from '@/utils';

export function testExtraSubstat(cache, equipMaps, currId, evaluateEquipMap) {
  const { gameId } = cache;
  const currMap = equipMaps[currId];

  const control = evaluateEquipMap(currMap).score;

  const results = {};

  for (const { stat, value } of Object.values(SUBSTAT[gameId])) {
    const equipMap = toMergedObj(currMap, { [stat]: value });
    const { score } = evaluateEquipMap(equipMap);
    results[stat] = score;
  }

  return { control, results };
}
