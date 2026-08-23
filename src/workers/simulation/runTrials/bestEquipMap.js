import { WW, MAINSTAT, SUBSTAT } from '@/data';
import { buildEquipMap } from '@/utils';

const COST_PATTERN = [4, 3, 3, 1, 1];

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

// Greedily fill substats onto a fixed set of equips (mainstats already chosen).
// At each step, try every legal (equip slot, unused-on-that-equip substat type)
// pair and keep whichever single addition improves score the most.
function greedyFillSubstats(evaluateEquipMap, equips) {
  const substatPool = Object.keys(SUBSTAT[WW]);
  const chosen = equips.map(() => []); // substat names per equip
  const totalSlots = equips.length * 5;

  for (let step = 0; step < totalSlots; step++) {
    let best = null;

    for (let e = 0; e < equips.length; e++) {
      if (chosen[e].length >= 5) continue;

      for (const substat of substatPool) {
        if (chosen[e].includes(substat)) continue; // no dupes on one equip

        const trialEquips = equips.map((eq, i) =>
          i === e
            ? toEquip(eq.cost, eq.mainstatId, [...chosen[i], substat])
            : eq);
        const { score } = evaluateEquipMap(buildEquipMap(trialEquips, true));

        if (!best || score > best.score) best = { score, equipIndex: e, substat };
      }
    }

    if (!best) break; // no legal moves left (shouldn't happen before totalSlots)
    chosen[best.equipIndex] = [...chosen[best.equipIndex], best.substat];
    equips[best.equipIndex] = toEquip(equips[best.equipIndex].cost, equips[best.equipIndex].mainstatId, chosen[best.equipIndex]);
  }

  return equips;
}

// Cartesian product of mainstat choices across the 5 slots.
function* mainstatCombos(costPattern) {
  const optionsPerSlot = costPattern.map((cost) => Object.keys(MAINSTAT[WW][cost]));
  const idxs = new Array(optionsPerSlot.length).fill(0);

  while (true) {
    yield optionsPerSlot.map((opts, i) => opts[idxs[i]]);

    let pos = idxs.length - 1;
    while (pos >= 0) {
      idxs[pos]++;
      if (idxs[pos] < optionsPerSlot[pos].length) break;
      idxs[pos] = 0;
      pos--;
    }
    if (pos < 0) break;
  }
}

export function findBestPossibleEquipMap(evaluateEquipMap) {
  const rankedCombos = [];
  for (const combo of mainstatCombos(COST_PATTERN)) {
    const equipList = COST_PATTERN.map((cost, i) => toEquip(cost, combo[i]));
    const { score } = evaluateEquipMap(buildEquipMap(equipList, true));
    rankedCombos.push({ combo, score });
  }
  rankedCombos.sort((a, b) => b.score - a.score);

  // Pass 2 (accurate): for each shortlisted combo, fully optimize substats,
  // then compare combos by their REAL final score - this is what actually
  // resolves the mainstat-vs-substat interaction correctly, since it's
  // asking evaluateEquipMap to judge the complete build, caps and all.
  let best = null;
  const SHORTLIST_SIZE = 15;
  for (const { combo } of rankedCombos.slice(0, SHORTLIST_SIZE)) {
    const bareEquips = COST_PATTERN.map((cost, i) => toEquip(cost, combo[i]));
    const equipList = greedyFillSubstats(evaluateEquipMap, bareEquips);
    const { score, totals } = evaluateEquipMap(buildEquipMap(equipList, true));

    if (!best || score > best.score) best = { score, equipList, totals };
  }

  // console.log
  for (const e of best.equipList) {
    const lines = [];
    lines.push(`\nMain\n${e.mainstatId}: ${e.mainstatValue}`);
    lines.push(`\nMainSub\n${e.mainstatSubId}: ${e.mainstatSubValue}`);

    for (const ss of e.substats) {
      lines.push(`\nSub\n${ss.id}: ${ss.value}`);
    }

    // console.log(lines.join());
  }

  return { equipList: best.equipList, totals: best.totals };
}
