import { WW, MAINSTAT, SUBSTAT } from '@/data';
import { buildEquipMap } from '../buildMap';

const FLAT_STAT_BY_COST = {
  4: { mainstatSubId: 'atk', mainstatSubValue: 150 },
  3: { mainstatSubId: 'atk', mainstatSubValue: 100 },
  1: { mainstatSubId: 'hp', mainstatSubValue: 2280 },
};

const toEquip = (cost, mainstat, substats = []) => ({
  cost,
  mainstatId: mainstat,
  mainstatValue: MAINSTAT[WW][cost][mainstat].value,
  ...FLAT_STAT_BY_COST[cost],
  substats: substats.map((id) => ({
    id,
    value: SUBSTAT[WW][id].value,
  })),
});

const toEquipI = (gameId, index, mainstat, substats = []) => ({
  mainstatId: mainstat,
  mainstatValue: MAINSTAT[gameId][index][mainstat].value,
  substats: substats.map((id) => ({
    id,
    value: SUBSTAT[gameId][id].value,
  })),
});

// Greedily fill substats onto a fixed set of equips (mainstats already chosen).
// At each step, try every legal (equip slot, unused-on-that-equip substat type)
// pair and keep whichever single addition improves score the most.
function greedyFillSubstats(evaluateEquipMap, equips) {
  const substatPool = Object.keys(SUBSTAT[WW]);
  const chosen = equips.map(() => []); // substat names per equip
  const totalSlots = equips.length * 5;

  for (let step = 0; step < totalSlots; step++) {
    let bestDps = 0;
    let best;

    for (let e = 0; e < equips.length; e++) {
      if (chosen[e].length >= 5) continue;

      for (const substat of substatPool) {
        if (chosen[e].includes(substat)) continue; // no dupes on one equip

        const trialEquips = equips.map((eq, i) => i === e
          ? toEquip(eq.cost, eq.mainstatId, [...chosen[i], substat])
          : eq
        );

        const { totals, actualRotationTime } = evaluateEquipMap(buildEquipMap(trialEquips, true));
        const dps = totals.damage / actualRotationTime * 1000;

        if (dps > bestDps) {
          bestDps = dps;
          best = { equipIndex: e, substat };
        }
      }
    }

    if (!best) break; // no legal moves left (shouldn't happen before totalSlots)
    chosen[best.equipIndex] = [...chosen[best.equipIndex], best.substat];
    equips[best.equipIndex] = toEquip(equips[best.equipIndex].cost, equips[best.equipIndex].mainstatId, chosen[best.equipIndex]);
  }

  return equips;
}

function getMainstatCombos(optionsPerSlot) {
  const combos = [];
  const idxs = new Array(optionsPerSlot.length).fill(0);

  while (true) {
    combos.push(optionsPerSlot.map((opts, i) => opts[idxs[i]]));

    let pos = idxs.length - 1;

    while (pos >= 0) {
      idxs[pos]++;

      if (idxs[pos] < optionsPerSlot[pos].length) break;

      idxs[pos] = 0;
      pos--;
    }

    if (pos < 0) break;
  }

  return combos;
}

function getOptionsPerSlot(gameId, evalId, skippable) {
  if (gameId !== WW) {
    return MAINSTAT[gameId].map((mainstatDatas, i) =>
      Object.keys(mainstatDatas)
        .filter((statId) => !skippable[i].has(statId))
    );
  }

  const costPattern = evalId === 1409
    ? [4, 4, 1, 1, 1]
    : [4, 3, 3, 1, 1];

  return costPattern.map((cost) =>
    Object.keys(MAINSTAT[WW][cost])
      .filter((statId) => !skippable[cost].has(statId))
  );
}

export function computeDpsCeiling(gameId, evaluateEquipMap, currId, skippable) {
  const costPattern = currId === 1409
    ? [4, 4, 1, 1, 1]
    : [4, 3, 3, 1, 1];

  const optionsPerSlot = getOptionsPerSlot(gameId, currId, skippable.mainstats);

  const rankedCombos = [];

  for (const combo of getMainstatCombos(optionsPerSlot)) {
    const equipList = gameId === WW
      ? costPattern.map((cost, i) => toEquip(cost, combo[i]))
      : combo.map((mainstatId, i) => toEquipI(gameId, i, mainstatId));

    const equipMap = buildEquipMap(equipList, true);
    const { score } = evaluateEquipMap(equipMap);

    rankedCombos.push({ combo, score });
  }

  rankedCombos.sort((a, b) => b.score - a.score);

  // Pass 2 (accurate): for each shortlisted combo, fully optimize substats,
  // then compare combos by their REAL final score - this is what actually
  // resolves the mainstat-vs-substat interaction correctly, since it's
  // asking evaluateEquipMap to judge the complete build, caps and all.
  let bestDps = 0;

  for (const { combo } of rankedCombos.slice(0, 10)) {
    const bareEquips = gameId === WW
      ? costPattern.map((cost, i) => toEquip(cost, combo[i]))
      : combo.map((mainstatId, i) => toEquipI(gameId, i, mainstatId));

    const equipList = greedyFillSubstats(evaluateEquipMap, bareEquips);
    const equipMap = buildEquipMap(equipList, true);
    const { score } = evaluateEquipMap(equipMap);

    if (score > bestDps) {
      bestDps = score;
    }
  }

  return bestDps;
}
