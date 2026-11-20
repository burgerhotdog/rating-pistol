import { MAINSTAT, SUBSTAT, MISC, WW } from '@/data';
import { buildEquipMap } from '@/utils';
import { buildSkippable } from './skippable';

const ROLLS_PER_SLOT = 6;   // 1 initial roll + 5 upgrades
const UPGRADE_BUDGET = 25;
const EPS = 1e-9;

function erRollsNeeded(gameId, equipMap, requiredEquipEr) {
  const needed = requiredEquipEr - (equipMap[MISC[gameId].energyAttr] ?? 0);
  if (needed <= EPS) return 0;
  return Math.ceil(needed / SUBSTAT[gameId][MISC[gameId].energyAttr].value - EPS);
}

// Returns every ER allocation worth trying for this combo.
// feasible=false => requirement can't be met; plans holds the best-effort allocation.
function getErPlans(gameId, equipMap, requiredEquipEr, mainstatIds) {
  const rolls = erRollsNeeded(gameId, equipMap, requiredEquipEr);
  if (rolls === 0) return { feasible: true, plans: [{ rolls: 0, slots: 0 }] };

  if (gameId === WW) {
    // WW model: max 5 rolls per stat, no per-equip structure
    return rolls <= 5
      ? { feasible: true, plans: [{ rolls, slots: 0 }] }
      : { feasible: false, plans: [{ rolls: 5, slots: 0 }] };
  }

  const eligible = mainstatIds.filter((id) => id !== MISC[gameId].energyAttr).length;
  const minSlots = Math.ceil(rolls / ROLLS_PER_SLOT);

  if (minSlots > eligible) {
    return {
      feasible: false,
      plans: [{ rolls: eligible * ROLLS_PER_SLOT, slots: eligible }],
    };
  }

  const plans = [];
  for (let slots = minSlots; slots <= Math.min(eligible, rolls); slots++) {
    plans.push({ rolls, slots });
  }
  return { feasible: true, plans };
}

const FLAT_STAT_BY_COST = {
  4: { mainstatSubId: 'atk', mainstatSubValue: 150 },
  3: { mainstatSubId: 'atk', mainstatSubValue: 100 },
  1: { mainstatSubId: 'hp', mainstatSubValue: 2280 },
};

const toEquip = (gameId, index, mainstatId, substats = []) => ({
  mainstatId,
  mainstatValue: MAINSTAT[gameId][index][mainstatId].value,
  substats: substats.map((id) => ({
    id,
    value: SUBSTAT[gameId][id].value,
  })),
});

const toEquipWW = (cost, mainstatId, substats = []) => ({
  cost,
  mainstatId,
  mainstatValue: MAINSTAT[WW][cost][mainstatId].value,
  ...FLAT_STAT_BY_COST[cost],
  substats: substats.map((id) => ({
    id,
    value: SUBSTAT[WW][id].value,
  })),
});

function greedyFillSubstats(
  gameId, equipMap, runEquipMap, skippable, mainstatIds,
  erRolls = 0, erSlots = 0,
) {
  const substatPool = Object.keys(SUBSTAT[gameId]).filter((stat) => !skippable.has(stat));
  const substatsByEquip = mainstatIds.map(() => new Set());
  const rollCounts = {};
  let stage1Steps = 20;
  let stage2Steps = UPGRADE_BUDGET;

  // NEW: preload ER onto the first `erSlots` equips that aren't ER mainstat
  if (erRolls > 0) {
    const eligibleIdx = mainstatIds
      .map((id, i) => (id !== MISC[gameId].energyAttr ? i : -1))
      .filter((i) => i >= 0);

    for (let k = 0; k < erSlots; k++) substatsByEquip[eligibleIdx[k]].add(MISC[gameId].energyAttr);

    const upgrades = erRolls - erSlots;
    equipMap = {
      ...equipMap,
      [MISC[gameId].energyAttr]: (equipMap[MISC[gameId].energyAttr] ?? 0) + erRolls * SUBSTAT[gameId][MISC[gameId].energyAttr].value,
    };
    rollCounts[MISC[gameId].energyAttr] = upgrades;
    stage1Steps -= erSlots;
    stage2Steps -= upgrades;
  }

  let finalResult = runEquipMap(equipMap);

  // Stage 1: add 4 unique substats to each artifact.
  for (let step = 0; step < stage1Steps; step++) {
    let bestResult = finalResult;
    let bestStat;
    let bestEquip;

    for (const stat of substatPool) {
      for (let equipIndex = 0; equipIndex < mainstatIds.length; equipIndex++) {
        if (
          mainstatIds[equipIndex] === stat ||
          substatsByEquip[equipIndex].size >= 4 ||
          substatsByEquip[equipIndex].has(stat)
        ) continue;

        const trialEquipMap = {
          ...equipMap,
          [stat]: (equipMap[stat] ?? 0) + SUBSTAT[gameId][stat].value,
        };

        const result = runEquipMap(trialEquipMap);

        if (result.score > bestResult.score) {
          bestResult = result;
          bestStat = stat;
          bestEquip = equipIndex;
        }
      }
    }

    if (!bestStat) break;

    equipMap = {
      ...equipMap,
      [bestStat]: (equipMap[bestStat] ?? 0) + SUBSTAT[gameId][bestStat].value,
    };

    substatsByEquip[bestEquip].add(bestStat);
    finalResult = bestResult;
  }

  // Stage 2: add up to 5 upgrade rolls for each existing substat.
  const maxUpgrades = Object.fromEntries(
    substatPool.map((stat) => [
      stat,
      5 * substatsByEquip.filter((substats) => substats.has(stat)).length,
    ]),
  );

  for (let step = 0; step < stage2Steps; step++) {
    let bestResult = finalResult;
    let bestStat;

    for (const stat of substatPool) {
      if ((rollCounts[stat] ?? 0) >= maxUpgrades[stat]) continue;

      const trialEquipMap = {
        ...equipMap,
        [stat]: (equipMap[stat] ?? 0) + SUBSTAT[gameId][stat].value,
      };

      const result = runEquipMap(trialEquipMap);

      if (result.score > bestResult.score) {
        bestResult = result;
        bestStat = stat;
      }
    }

    if (!bestStat) {
      console.log('greedy stuck');
      break;
    }

    equipMap = {
      ...equipMap,
      [bestStat]: (equipMap[bestStat] ?? 0) + SUBSTAT[gameId][bestStat].value,
    };

    rollCounts[bestStat] = (rollCounts[bestStat] ?? 0) + 1;
    finalResult = bestResult;
  }

  return finalResult;
}

function greedyFillSubstatsWW(equipMap, runEquipMap, skippable, erRolls = 0) {
  const substatPool = Object.keys(SUBSTAT[WW]);
  const counts = {};
  let steps = 25;

  if (erRolls > 0) {
    equipMap = {
      ...equipMap,
      [MISC[WW].energyAttr]: (equipMap[MISC[WW].energyAttr] ?? 0) + erRolls * SUBSTAT[WW][MISC[WW].energyAttr].value,
    };
    counts[MISC[WW].energyAttr] = erRolls;
    steps -= erRolls;
  }

  let finalResult = runEquipMap(equipMap);

  for (let step = 0; step < steps; step++) {
    let bestResult = finalResult;
    let bestSubstat;

    for (const statId of substatPool) {
      if ((counts[statId] ?? 0) >= 5) continue;
      if (skippable.has(statId)) continue;

      const trialEquipMap = {
        ...equipMap,
        [statId]: (equipMap[statId] ?? 0) + SUBSTAT[WW][statId].value,
      };

      const result = runEquipMap(trialEquipMap);

      if (result.score > bestResult.score) {
        bestResult = result;
        bestSubstat = statId;
      }
    }

    if (!bestSubstat) break;

    equipMap = {
      ...equipMap,
      [bestSubstat]: (equipMap[bestSubstat] ?? 0) + SUBSTAT[WW][bestSubstat].value,
    };

    counts[bestSubstat] = (counts[bestSubstat] ?? 0) + 1;
    finalResult = bestResult;
  }

  return finalResult;
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

export function getCeil(gameId, runEquipMap, currId, requiredEquipEr = 0) {
  const skippable = buildSkippable(gameId, runEquipMap);

  // Never skip ER when it's required.
  // (If buildSkippable returns a cached object, copy it before mutating.)
  if (requiredEquipEr > 0) {
    skippable.substats.delete(MISC[gameId].energyAttr);
    for (const set of Object.values(skippable.mainstats)) set.delete(MISC[gameId].energyAttr);
  }

  const costPattern = currId === 1409 ? [4, 4, 1, 1, 1] : [4, 3, 3, 1, 1];
  const optionsPerSlot = getOptionsPerSlot(gameId, currId, skippable.mainstats);

  const makeEquipMap = (combo) =>
    buildEquipMap(
      gameId === WW
        ? costPattern.map((cost, i) => toEquipWW(cost, combo[i]))
        : combo.map((mainstatId, i) => toEquip(gameId, i, mainstatId)),
      true,
    );

  // Pass 1: rank combos by bare score and flag infeasible ER
  const rankedCombos = [];

  for (const combo of getMainstatCombos(optionsPerSlot)) {
    const equipMap = makeEquipMap(combo);
    const score = runEquipMap(equipMap).score;
    const { feasible } = getErPlans(gameId, equipMap, requiredEquipEr, combo);

    rankedCombos.push({
      combo,
      score,
      flagged: !feasible,
      hasEr: requiredEquipEr > 0 && combo.includes(MISC[gameId].energyAttr),
    });
  }

  rankedCombos.sort((a, b) => (a.flagged - b.flagged) || (b.score - a.score));

  // Shortlist: all unflagged ER-mainstat combos, then the 10 best of the rest
  const erCombos = rankedCombos.filter((c) => !c.flagged && c.hasEr);
  const others = rankedCombos.filter((c) => c.flagged || !c.hasEr);
  const shortlist = [...erCombos, ...others.slice(0, 10)];

  // Pass 2: full substat fill, trying each ER slot allocation
  let best = null; // { result, met }

  for (const { combo, flagged } of shortlist) {
    const bareEquipMap = makeEquipMap(combo);
    const { plans } = getErPlans(gameId, bareEquipMap, requiredEquipEr, combo);
    const met = !flagged;

    for (const { rolls, slots } of plans) {
      const result = gameId === WW
        ? greedyFillSubstatsWW(bareEquipMap, runEquipMap, skippable.substats, rolls)
        : greedyFillSubstats(
            gameId, bareEquipMap, runEquipMap, skippable.substats, combo, rolls, slots,
          );

      // met results always beat unmet ones; otherwise higher score wins
      if (
        !best ||
        (met && !best.met) ||
        (met === best.met && result.score > best.result.score)
      ) {
        best = { result, met };
      }
    }
  }

  if (requiredEquipEr > 0 && !best?.met) {
    console.log(
      `getCeil: could not reach required ER (${requiredEquipEr}) for ${currId}; returning best effort`,
    );
  }

  return best?.result ?? { fullScore: 0, score: 0 };
}
