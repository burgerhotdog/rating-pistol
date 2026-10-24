import { runSetBonusTests } from './runSetBonusTests';
import { runWeaponTests } from './swap-weapon';
import { createVariantDurationGetter } from '../duration';

export function runComparisonTests(cache, equipMaps, bonusEnergy) {
  const { charId } = cache;

  const durationGetter = createVariantDurationGetter(cache, equipMaps, bonusEnergy);

  const weaponResults = runWeaponTests(cache, equipMaps, charId, durationGetter);

  const setResults = runSetBonusTests(cache, equipMaps, charId, durationGetter);

  return {
    weaponResults,
    setResults,
  };
}
