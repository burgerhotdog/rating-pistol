import { createVariantDurationGetter } from '../duration';
import { runWeaponTests } from './weapon';
import { runSetBonusTests } from './runSetBonusTests';

export function runLabTests(cache, equipMaps, bonusEnergy) {
  const { charId } = cache;

  const durationGetter = createVariantDurationGetter(cache, equipMaps, bonusEnergy);

  const weaponResults = runWeaponTests(cache, equipMaps, charId, durationGetter);
  const setResults = runSetBonusTests(cache, equipMaps, charId, durationGetter);

  return {
    weaponResults,
    setResults,
  };
}
