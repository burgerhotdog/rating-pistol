import { LANG } from '@/data';
import { runSetBonusTests } from './runSetBonusTests';
import { runWeaponTests } from './runWeaponTests';
import { createVariantDurationGetter } from '../duration';

export function runComparisonTests(cache, equipMaps) {
  const { gameId, charId } = cache;
  const langData = LANG[gameId];

  const durationGetter = createVariantDurationGetter(cache, equipMaps);

  self.postMessage({ title: `Running ${langData.Weapon} Tests` });
  const weaponResults = runWeaponTests(cache, equipMaps, charId, durationGetter);

  self.postMessage({ title: `Running ${langData.Equip} Set Bonus Tests` });
  const setResults = runSetBonusTests(cache, equipMaps, charId, durationGetter);

  return {
    weaponResults,
    setResults,
  };
}
