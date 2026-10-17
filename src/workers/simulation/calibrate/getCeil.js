import { MAINSTAT, SUBSTAT, WW } from '@/data';
import { buildEquipMap } from '@/utils';

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
  gameId,
  equipMap,
  runEquipMap,
  skippable,
  mainstatIds,
) {
  const substatPool = Object.keys(SUBSTAT[gameId]).filter((stat) => !skippable.has(stat));

  const substatsByEquip = mainstatIds.map(() => new Set());

  let finalResult = runEquipMap(equipMap);

  // Stage 1: add 4 unique substats to each artifact.
  for (let step = 0; step < 20; step++) {
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

  const rollCounts = {};

  for (let step = 0; step < 25; step++) {
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

function greedyFillSubstatsWW(equipMap, runEquipMap, skippable) {
  const substatPool = Object.keys(SUBSTAT[WW]);
  const counts = {};

  let finalResult = runEquipMap(equipMap);

  for (let step = 0; step < 25; step++) {
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

export function getCeil(gameId, runEquipMap, currId, skippable) {
  const costPattern = currId === 1409
    ? [4, 4, 1, 1, 1]
    : [4, 3, 3, 1, 1];

  const optionsPerSlot = getOptionsPerSlot(gameId, currId, skippable.mainstats);

  const rankedCombos = [];

  for (const combo of getMainstatCombos(optionsPerSlot)) {
    const equipList = gameId === WW
      ? costPattern.map((cost, i) => toEquipWW(cost, combo[i]))
      : combo.map((mainstatId, i) => toEquip(gameId, i, mainstatId));

    const equipMap = buildEquipMap(equipList, true);
    const score = runEquipMap(equipMap).score;

    rankedCombos.push({ combo, score });
  }

  rankedCombos.sort((a, b) => b.score - a.score);

  // Pass 2 (accurate): for each shortlisted combo, fully optimize substats,
  // then compare combos by their REAL final score - this is what actually
  // resolves the mainstat-vs-substat interaction correctly, since it's
  // asking evaluateEquipMap to judge the complete build, caps and all.
  let bestResult = { fullScore: 0, score: 0 };

  for (const { combo } of rankedCombos.slice(0, 10)) {
    const bareEquips = gameId === WW
      ? costPattern.map((cost, i) => toEquipWW(cost, combo[i]))
      : combo.map((mainstatId, i) => toEquip(gameId, i, mainstatId));

    const bareEquipMap = buildEquipMap(bareEquips, true);

    const result = gameId === WW
      ? greedyFillSubstatsWW(bareEquipMap, runEquipMap, skippable.substats)
      : greedyFillSubstats(gameId, bareEquipMap, runEquipMap, skippable.substats, combo);

    if (result.score > bestResult.score) {
      bestResult = result;
    }
  }

  return bestResult;
}
