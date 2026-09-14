import { getAttr } from '@/utils';

export const getDmgAmpMult = (statMap, dmgTypes) => {
  let dmgAmpMultiplier = 1 + getAttr('dmgAmp%', statMap);

  for (const type of dmgTypes) {
    dmgAmpMultiplier += getAttr(`${type}DmgAmp%`, statMap);
  }

  return dmgAmpMultiplier;
};
