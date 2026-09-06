import { SET, MISC } from '@/data';

export function buildUsefulSetBonuses(gameId, baselineDps, runTest) {
  const { maxEquips } = MISC[gameId];
  const setDatasList = Object.values(SET[gameId]);

  const setBonusDpsIfUseful = {};
  const usefulSetBonuses = {};

  for (let bonusTier = 1; bonusTier <= maxEquips; bonusTier++) {
    const usefulSetIds = new Set();

    for (const { id, effects, bonuses } of setDatasList) {
      if (!bonuses.includes(bonusTier)) continue;

      const { dps } = runTest([{
        rawEffects: effects,
        pieceCount: bonusTier,
        sourceId: id,
      }], { testEcho: false });

      const prevDps = setBonusDpsIfUseful[id] ?? baselineDps;

      if (dps > prevDps) {
        setBonusDpsIfUseful[id] = dps;
        usefulSetIds.add(id);
      }
    }
 
    usefulSetBonuses[bonusTier] = usefulSetIds;
  }

  return usefulSetBonuses;
}
