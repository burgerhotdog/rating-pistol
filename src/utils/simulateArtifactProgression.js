import { GENERAL_LOOKUP } from '@/lookups';
import { createArtifact, upgradeArtifact, computeDamage } from '@/utils';

function simulateBuildAfterWeekOfFarming(gameId, buildEntry, buffs, criteriaIndex) {
  const { RESIN_PER_DAY, RESIN_PER_RUN, DROPS_PER_RUN, MAIN_STAT_TYPES } = GENERAL_LOOKUP[gameId];
  const [charId, charObj] = buildEntry;
  const { weaponId } = charObj;
  const dropsPerWeek = Math.floor(RESIN_PER_DAY / RESIN_PER_RUN * DROPS_PER_RUN * 7);

  let oldDmg = computeDamage(gameId, buildEntry, buffs, criteriaIndex);
  let iterBuild = charObj;
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

    const newDmg = computeDamage(gameId, [charId, { weaponId, equipList: newEquipList }], buffs, criteriaIndex);
    if (newDmg < oldDmg) continue;

    oldDmg = newDmg;
    iterBuild = { weaponId, equipList: newEquipList };
  }

  return [oldDmg, iterBuild];
}

export function simulateArtifactProgression(gameId, buildEntry, buffs = {}, criteriaIndex = 0) {
  const { NUM_MAINSTATS } = GENERAL_LOOKUP[gameId];
  const [charId, charData] = buildEntry;

  let iterBuild = {
    weaponId: charData.weaponId,
    equipList: Array(NUM_MAINSTATS).fill(null),
  };

  const weeklyDamages = [];
  let dmg = computeDamage(gameId, [charId, iterBuild], buffs, criteriaIndex);
  weeklyDamages.push(dmg);

  for (let i = 0; i < 20; i++) {
    [dmg, iterBuild] = simulateBuildAfterWeekOfFarming(gameId, [charId, iterBuild], buffs, criteriaIndex);
    weeklyDamages.push(dmg);
  }

  return { weeklyDamages, finalBuild: iterBuild };
}
