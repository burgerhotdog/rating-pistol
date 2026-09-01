import { MISC } from '@/data';
import { getAttr } from '../getAttr';

export function computePenaltyTimeCoef(gameId, sourceStatMap, testStatMap) {
  const { energyAttr } = MISC[gameId];

  const energyReq = getAttr(energyAttr, sourceStatMap);
  const energyValue = getAttr(energyAttr, testStatMap);

  if (energyValue >= energyReq) {
    return 1;
  }

  return energyReq / energyValue;
}

// Scales dps down to account for the extra time needed to reach full energy on testStatMap
export function computeEnergyPenalty(gameId, rotationDuration, sourceDuration, sourceStatMap, testStatMap) {
  const timeCoef = computePenaltyTimeCoef(gameId, sourceStatMap, testStatMap);
  if (timeCoef === 1) return 1;

  const addedTime = sourceDuration * (timeCoef - 1);
  return rotationDuration / (rotationDuration + addedTime);
}

