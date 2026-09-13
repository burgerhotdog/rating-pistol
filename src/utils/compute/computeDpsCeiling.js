import { WW, MAINSTAT, SUBSTAT } from '@/data';
import { buildEquipMap } from '../buildMap';

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
  evaluateEquipMap,
  equipMap,
  skippable,
  mainstatIds,
) {
  const substatPool = Object.keys(SUBSTAT[gameId]).filter((stat) => !skippable.has(stat));

  const substatsByEquip = mainstatIds.map(() => new Set());
  let currentScore = evaluateEquipMap(equipMap).score;

  // Stage 1: add 4 unique substats to each artifact.
  for (let step = 0; step < 20; step++) {
    let bestScore = currentScore;
    let bestStat;
    let bestEquip;

    for (const stat of substatPool) {
      for (let equipIndex = 0; equipIndex < mainstatIds.length; equipIndex++) {
        if (
          mainstatIds[equipIndex] === stat ||
          substatsByEquip[equipIndex].size >= 4 ||
          substatsByEquip[equipIndex].has(stat)
        ) continue;

        const { score } = evaluateEquipMap({
          ...equipMap,
          [stat]: (equipMap[stat] ?? 0) + SUBSTAT[gameId][stat].value,
        });

        if (score > bestScore) {
          bestScore = score;
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
    currentScore = bestScore;
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
    let bestScore = currentScore;
    let bestStat;

    for (const stat of substatPool) {
      if ((rollCounts[stat] ?? 0) >= maxUpgrades[stat]) continue;

      const trialEquipMap = {
        ...equipMap,
        [stat]: (equipMap[stat] ?? 0) + SUBSTAT[gameId][stat].value,
      };

      const { score } = evaluateEquipMap(trialEquipMap);

      if (score > bestScore) {
        bestScore = score;
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
    currentScore = bestScore;
  }

  return currentScore;
}

function greedyFillSubstatsWW(evaluateEquipMap, equipMap, skippable) {
  const substatPool = Object.keys(SUBSTAT[WW]);
  const counts = {};

  let currentScore = evaluateEquipMap(equipMap).score;

  for (let step = 0; step < 25; step++) {
    let bestScore = currentScore;
    let bestSubstat;

    for (const statId of substatPool) {
      if ((counts[statId] ?? 0) >= 5) continue;
      if (skippable.has(statId)) continue;

      const trialEquipMap = {
        ...equipMap,
        [statId]: (equipMap[statId] ?? 0) + SUBSTAT[WW][statId].value,
      };

      const { score } = evaluateEquipMap(trialEquipMap);

      if (score > bestScore) {
        bestScore = score;
        bestSubstat = statId;
      }
    }

    if (!bestSubstat) break;

    equipMap = {
      ...equipMap,
      [bestSubstat]: (equipMap[bestSubstat] ?? 0) + SUBSTAT[WW][bestSubstat].value,
    };

    counts[bestSubstat] = (counts[bestSubstat] ?? 0) + 1;
    currentScore = bestScore;
  }

  return currentScore;
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
      ? costPattern.map((cost, i) => toEquipWW(cost, combo[i]))
      : combo.map((mainstatId, i) => toEquip(gameId, i, mainstatId));

    const equipMap = buildEquipMap(equipList, true);
    const { score } = evaluateEquipMap(equipMap);

    rankedCombos.push({ combo, score });
  }

  rankedCombos.sort((a, b) => b.score - a.score);

  // Pass 2 (accurate): for each shortlisted combo, fully optimize substats,
  // then compare combos by their REAL final score - this is what actually
  // resolves the mainstat-vs-substat interaction correctly, since it's
  // asking evaluateEquipMap to judge the complete build, caps and all.
  let bestScore = 0;

  for (const { combo } of rankedCombos.slice(0, 10)) {
    const bareEquips = gameId === WW
      ? costPattern.map((cost, i) => toEquipWW(cost, combo[i]))
      : combo.map((mainstatId, i) => toEquip(gameId, i, mainstatId));

    const comboScore = gameId === WW
      ? greedyFillSubstatsWW(evaluateEquipMap, buildEquipMap(bareEquips, true), skippable.substats)
      : greedyFillSubstats(gameId, evaluateEquipMap, buildEquipMap(bareEquips, true), skippable.substats, combo);

    if (comboScore > bestScore) {
      bestScore = comboScore;
    }
  }

  return bestScore;
}
