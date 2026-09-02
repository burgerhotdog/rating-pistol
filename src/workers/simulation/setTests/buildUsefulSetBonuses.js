import { SET } from '@/data';

export function buildUsefulSetBonuses(gameId, maxEquips, baselineDps, runTest) {
  const setBonusDpsIfUseful = {};
  const usefulSetBonuses = {};

  for (let tier = 1; tier <= maxEquips; tier++) {
    const usefulSetIds = new Set();

    for (const { id, effects, bonuses } of Object.values(SET[gameId])) {
      if (!bonuses.includes(tier)) continue;

      const { dps } = runTest([{
        rawEffects: effects,
        pieceCount: tier,
        sourceId: id,
      }], { testEcho: false });

      const prevDps = setBonusDpsIfUseful[id] ?? baselineDps;

      if (dps > prevDps) {
        setBonusDpsIfUseful[id] = dps;
        usefulSetIds.add(id);
      }
    }
 
    usefulSetBonuses[tier] = usefulSetIds;
  }

  return usefulSetBonuses;
}
