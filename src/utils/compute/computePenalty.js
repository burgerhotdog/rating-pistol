import { MISC } from '@/data';
import { getAttr } from '../getAttr';

export function computePenaltyTimeCoef(gameId, energyReq, testStatMap) {
  const { energyAttr } = MISC[gameId];

  const energyValue = getAttr(energyAttr, testStatMap);

  if (energyValue >= energyReq) {
    return 1;
  }

  return energyReq / energyValue;
}

// Scales dps down to account for the extra time needed to reach full energy on testStatMap
export function computeEnergyPenalty(gameId, rotationDuration, sourceDuration, energyReq, testStatMap) {
  const timeCoef = computePenaltyTimeCoef(gameId, energyReq, testStatMap);
  if (timeCoef === 1) return 1;

  const addedTime = sourceDuration * (timeCoef - 1);
  return rotationDuration / (rotationDuration + addedTime);
}
