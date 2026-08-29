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
