import { GI, WW, MISC } from '@/data';
import { mergeEquipList, getTotals } from '@/utils';
import { compileRotation } from './rotation';
import { createTrialAdvancer } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { compilePenalty } from './penalty';

const MIN_TRIALS = 50;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

const createScoreTracker = () => {
  let n = 0, mean = 0, M2 = 0;
  return {
    add(x) {
      n++;
      const delta = x - mean;
      mean += delta / n;
      M2 += delta * (x - mean);
    },
    get relativeError() {
      if (n < 2) return Infinity;
      const stdErr = Math.sqrt(M2 / (n - 1) / n);
      return stdErr / Math.max(Math.abs(mean), 1e-8);
    },
    get mean() { return mean; },
  };
};

const getConfigKey = (gameId, equipList) => {
  if (gameId === GI) {
    const sands = equipList[2]?.mainStatId ?? 'none';
    const goblet = equipList[3]?.mainStatId ?? 'none';
    const circlet = equipList[4]?.mainStatId ?? 'none';

    return {
      key: `${sands}|${goblet}|${circlet}`,
      sands,
      goblet,
      circlet,
    };
  }

  const result = {
    4: [],
    3: [],
    1: [],
  };

  for (const equip of equipList) {
    if (!equip) continue;

    const { cost, mainStatId } = equip;
    result[cost].push(mainStatId);
  }

  const four = result["4"][0];
  const three = result["3"];
  const one = result["1"];

  return {
    key: `${four}|${three.join('+')}|${one.join('+')}`,
    four,
    three,
    one,
  };
};

const buildConfigStats = (gameId, trials) => {
  const configMap = {};

  for (const trial of trials) {
    const { key, four, three, one } = getConfigKey(gameId, trial.equipList);

    if (!configMap[key]) {
      configMap[key] = {
        count: 0,
        four,
        three,
        one,
        subStatSums: {},
      };
    }

    const entry = configMap[key];
    entry.count++;

    const { subStatSums } = entry;
    for (const equip of trial.equipList) {
      if (!equip) continue;

      const { subStatList = [] } = equip;
      for (const line of subStatList) {
        const { subStatId, subStatValue } = line;
        if (!subStatId) continue;

        subStatSums[subStatId] = (subStatSums[subStatId] ?? 0) + subStatValue;
      }
    }
  }

  for (const key in configMap) {
    const { count, subStatSums } = configMap[key];

    for (const statId in subStatSums) {
      const avg = subStatSums[statId] / count;
      const maxRoll = MISC[gameId].SUB_STAT_TYPES[statId].VALUE;
      subStatSums[statId] = avg / maxRoll;
    }
  }

  return configMap;
};

const normalizeSummarySums = (sums, n) =>
  Object.fromEntries(
    Object.entries(sums).map(([key, footprint]) => {
      const { type } = footprint;
      return [key, { ...footprint, [type]: footprint[type] / n }];
    })
  );

const buildFinalStats = (trials) => {
  const n = trials.length;
  const statSums = {};
  for (const trial of trials) {
    const merged = mergeEquipList(trial.equipList);
    for (const stat in merged) {
      statSums[stat] = (statSums[stat] ?? 0) + merged[stat] / n;
    }
  }
  return statSums;
};

function addSummaryToSums(sums, summary) {
  for (const [key, footprint] of Object.entries(summary)) {
    const { type } = footprint;

    if (!sums[key]) sums[key] = { ...footprint, [type]: 0 };
    sums[key][type] += footprint[type] ?? 0;
  }
}

export const runTrials = (cache, currId, team, isPrimary = false) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const simulateRotation = compileRotation(cache, currId, team);
  const getPenalty = compilePenalty(cache, currId);
  const equipListLength = gameId === GI || gameId === WW ? 5 : 6;
  const baseSummary = simulateRotation(baseMap);
  const baseTotals = getTotals(baseSummary);
  const basePenalty = getPenalty(baseMap);
  const baseScore = baseTotals.damage * basePenalty;

  const createTrial = () => ({
    equipList: new Array(equipListLength).fill(null),
    summary: baseSummary,
    totals: baseTotals,
    penalty: basePenalty,
    score: baseScore,
  });

  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) trials.push(createTrial());

  const preferredMainStats = findPreferred(cache, baseTotals.damage, currId, simulateRotation);

  const weeklySummaries = isPrimary ? [baseSummary] : null;

  const advanceTrial = createTrialAdvancer(cache, currId, preferredMainStats, simulateRotation, getPenalty);

  let prevAvgScore = baseScore;

  for (let week = 1; week <= MAX_WEEKS; week++) {
    const weekSummarySums = isPrimary ? {} : null;
    const weekTotals = isPrimary ? [] : null;
    const weekScores = createScoreTracker();

    for (const trial of trials) {
      advanceTrial(trial);
      weekScores.add(trial.score);

      if (isPrimary) {
        addSummaryToSums(weekSummarySums, trial.summary);
        weekTotals.push(trial.totals);
      }
    }

    while (week === 1 && trials.length < MAX_TRIALS) {
      if (weekScores.relativeError <= 0.005) break;

      const trial = createTrial();
      advanceTrial(trial);
      trials.push(trial);

      weekScores.add(trial.score);
      if (isPrimary) {
        addSummaryToSums(weekSummarySums, trial.summary);
        weekTotals.push(trial.totals);
      }
    }

    const avgScore = weekScores.mean;
    const diff = (avgScore - prevAvgScore) / prevAvgScore;

    if (isPrimary) {
      const weeklySummary = normalizeSummarySums(weekSummarySums, trials.length);

      weeklySummaries.push(weeklySummary);

      self.postMessage({ type: 'progress', week, diff });
    }

    if (diff < 0.01) break;
    prevAvgScore = avgScore;
  }

  const finalStatMap = buildFinalStats(trials);
  if (!isPrimary) return { finalStatMap };

  const userSummary = simulateRotation(cache.member[currId].statMap);

  const configMap = buildConfigStats(gameId, trials);
  const { key: userConfigKey } = getConfigKey(gameId, cache.member[currId].equipList);
  const userSubStats = {};
  for (const equip of cache.member[currId].equipList) {
    if (!equip) continue;
    for (const { subStatId, subStatValue } of equip.subStatList) {
      const maxRoll = MISC[gameId].SUB_STAT_TYPES[subStatId].VALUE;
      userSubStats[subStatId] = (userSubStats[subStatId] ?? 0) + subStatValue / maxRoll;
    }
  }
  
  self.postMessage({
    type: 'done',
    cache,
    finalStatMap,
    weeklySummaries,
    userSummary,
    configMap,
    userConfigKey,
    userSubStats,
  });
};
