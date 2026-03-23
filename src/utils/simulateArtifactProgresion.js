import { GENERAL_LOOKUP } from '@/lookups';
import { createArtifact, upgradeArtifact, computeDamage } from '@/utils';

function simulateBuildAfterWeekOfFarming(gameId, charId, buildObj) {
  const { RESIN_PER_DAY, RESIN_PER_RUN, DROPS_PER_RUN, MAIN_STAT_TYPES } = GENERAL_LOOKUP[gameId];
  const { weaponId } = buildObj;
  const dropsPerWeek = Math.floor(RESIN_PER_DAY / RESIN_PER_RUN * DROPS_PER_RUN * 7);

  let oldDmg = computeDamage(gameId, charId, buildObj);
  let iterBuild = buildObj;
  for (let i = 0; i < dropsPerWeek; i++) {
    const [slotIndex, newMainStat] = createArtifact(gameId);
    const newEquip = {
      mainStatId: newMainStat,
      mainStatValue: MAIN_STAT_TYPES[slotIndex][newMainStat].VALUE,
      subStatList: upgradeArtifact(gameId, newMainStat),
    };

    const newEquipList = iterBuild.equipList.map((equipObj, index) => {
      if (index !== slotIndex) return equipObj;
      return newEquip;
    });

    const newDmg = computeDamage(gameId, charId, { weaponId, equipList: newEquipList });
    if (newDmg < oldDmg) continue;

    oldDmg = newDmg;
    iterBuild = { weaponId, equipList: newEquipList };
  }

  return [oldDmg, iterBuild];
};

export function simulateArtifactProgresion(gameId, charId, charBuild) {
  const { NUM_MAINSTATS } = GENERAL_LOOKUP[gameId];

  let iterBuild = {
    weaponId: charBuild.weaponId,
    equipList: Array(NUM_MAINSTATS).fill().map(() => null),
  };

  let weeklyProgression = [];

  let dmg = computeDamage(gameId, charId, iterBuild)
  weeklyProgression.push([dmg, iterBuild]);

  for (let i = 0; i < 20; i++) {
    [dmg, iterBuild] = simulateBuildAfterWeekOfFarming(gameId, charId, iterBuild);
    weeklyProgression.push([dmg, iterBuild]);
  }

  return weeklyProgression;
};
