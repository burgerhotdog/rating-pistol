import { MISC } from '@/data';
import { getAttr } from './getAttr';

export function getEnergyLevel(gameId, statMap) {
  const { energyAttr } = MISC[gameId];
  return getAttr(energyAttr, statMap);
}
