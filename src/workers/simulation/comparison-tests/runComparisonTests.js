import { LANG } from '@/data';
import { runSetBonusTests } from './runSetBonusTests';
import { runWeaponTests } from './runWeaponTests';

export function runComparisonTests(cache, equipMaps) {
  const { gameId, charId } = cache;
  const langData = LANG[gameId];

  self.postMessage({ title: `Running ${langData.Weapon} Tests` });
  const weaponResults = runWeaponTests(cache, equipMaps, charId);

  self.postMessage({ title: `Running ${langData.Equip} Set Bonus Tests` });
  const setResults = runSetBonusTests(cache, equipMaps, charId);

  return {
    weaponResults,
    setResults,
  };
}
