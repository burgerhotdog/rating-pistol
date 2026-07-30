import { GI, WW, CHARACTER } from '@/data';
import { mergeEquipList, toMergedObj } from '@/utils';
import { createRunRotation } from './rotation';
import { createTrialAdvancer } from './advanceTrial';
import { findGoodStats } from './stats/findGoodStats';
import { WW_TABLE } from './stats/assignSub';
import { WUWA_MAINSTAT_VALUES } from './stats/values';
import { createGetPenalty } from './penalty';
import { getSubRollSums, getScore, getMainConfig } from './utils';

const MIN_TRIALS = 100;
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

const buildConfigStats = (gameId, trials) => {
  const configMap = {};

  for (const trial of trials) {
    const key = getMainConfig(gameId, trial.equipList);

    if (!configMap[key]) {
      configMap[key] = {
        count: 0,
        subRollSums: {},
      };
    }

    const entry = configMap[key];
    entry.count++;

    const { subRollSums } = entry;
    const rollMap = getSubRollSums(gameId, trial.equipList);
    for (const [statId, rolls] of Object.entries(rollMap)) {
      subRollSums[statId] ??= 0;
      subRollSums[statId] += rolls;
    }
  }

  for (const { count, subRollSums } of Object.values(configMap)) {
    for (const [statId, rolls] of Object.entries(subRollSums)) {
      subRollSums[statId] = rolls / count;
    }
  }

  return configMap;
};

const normalizeSummarySums = (sums, n) =>
  Object.fromEntries(
    Object.entries(sums).map(([snapshotKey, result]) => [
      snapshotKey,
      {
        ...result,
        damage: result.damage / n,
        healing: result.healing / n,
        shield: result.shield / n,
      },
    ])
  );

function addSummaryToSums(sums, snapshots) {
  for (const [snapshotKey, snapshot] of Object.entries(snapshots)) {
    const acc = sums[snapshotKey];
    if (acc) {
      for (const part of ['damage', 'healing', 'shield']) {
        acc[part] += snapshot[part] ?? 0;
      }
    } else {
      sums[snapshotKey] ??= { ...snapshot };
    }
  }
}

export const runTrials = (cache, equipMaps, currId, isMain = false) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];
  const runRotation = createRunRotation(cache, equipMaps, currId);
  const getPenalty = createGetPenalty(cache, currId);

  const baseSummary = runRotation(baseMap);
  const basePenalty = getPenalty(baseMap);
  const baseScore = getScore(baseSummary, currId, basePenalty);

  const weeklySummaries = [baseSummary];
  const goodStats = findGoodStats(cache, baseScore, currId, runRotation, getPenalty);
  const advanceTrial = createTrialAdvancer(cache, currId, goodStats, runRotation, getPenalty);

  // Init trials
  const equipListLength = (gameId === GI || gameId === WW) ? 5 : 6;
  const createTrial = () => ({
    equipList: new Array(equipListLength).fill(null),
    summary: baseSummary,
    score: baseScore,
  });
  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) {
    trials.push(createTrial());
  }

  // Main trial loop
  let prevAvgScore = baseScore;
  for (let week = 1; week <= MAX_WEEKS; week++) {
    const weekScores = createScoreTracker();
    const weekSummarySums = {};

    for (const trial of trials) {
      advanceTrial(trial);
      weekScores.add(trial.score);

      if (isMain) addSummaryToSums(weekSummarySums, trial.summary);
    }

    while (week === 1 && trials.length < MAX_TRIALS) {
      if (weekScores.relativeError <= 0.005) {
        break;
      }

      const trial = createTrial();
      advanceTrial(trial);
      trials.push(trial);

      weekScores.add(trial.score);
      if (isMain) addSummaryToSums(weekSummarySums, trial.summary);
    }

    const avgScore = weekScores.mean;
    const diff = (avgScore - prevAvgScore) / prevAvgScore;

    if (isMain) {
      self.postMessage({ week, diff });
      const weeklySummary = normalizeSummarySums(weekSummarySums, trials.length);
      weeklySummaries.push(weeklySummary);
    }

    if (diff < 0.01) {
      break;
    }

    prevAvgScore = avgScore;
  }

  if (!isMain) {
    const avgEquipMap = {};
    for (const { equipList } of trials) {
      const equipMap = mergeEquipList(equipList);
      for (const [stat, value] of Object.entries(equipMap)) {
        avgEquipMap[stat] ??= 0;
        avgEquipMap[stat] += value / trials.length;
      }
    }
    return avgEquipMap;
  }

  const message = {
    cache,
    weeklySummaries,
    userSummary: runRotation(cache.member[currId].statMap),
    configMap: buildConfigStats(gameId, trials),
    userConfigKey: getMainConfig(gameId, cache.member[currId].equipList),
    userSubStats: getSubRollSums(gameId, cache.member[currId].equipList),
  };

  message.prydwenSummary = getPrydwenBenchmark(gameId, currId, cache.member[currId].baseMap, message.configMap, runRotation);

  self.postMessage(message);
};

function getPrydwenBenchmark(gameId, charId, baseMap, configMap, runRotation) {
  const character = CHARACTER[gameId][charId];
  const prydwen = character.presets?.[0]?.prydwen ?? ['atk%', 'critRate%', 'critDmg%'];

  const prydwenMap = {};
  if (gameId === WW) {
    for (const stat of prydwen) {
      const low = WW_TABLE[stat][0];
      const high = WW_TABLE[stat].at(-1);
      prydwenMap[stat] = 5 * (low + high) / 2;
    }
  }

  const bestConfig = Object.entries(configMap).sort((a, b) => b.count - a.count)[0];
  const mainstats = bestConfig[0].split('|');
  for (const stat of mainstats) {
    prydwenMap[stat] ??= 0;
  }
  const [cost4, cost3a, cost3b, cost1a, cost1b] = mainstats;
  prydwenMap[cost4] += WUWA_MAINSTAT_VALUES[4][cost4];
  prydwenMap[cost3a] += WUWA_MAINSTAT_VALUES[3][cost3a];
  prydwenMap[cost3b] += WUWA_MAINSTAT_VALUES[3][cost3b];
  prydwenMap[cost1a] += WUWA_MAINSTAT_VALUES[1][cost1a];
  prydwenMap[cost1b] += WUWA_MAINSTAT_VALUES[1][cost1b];

  prydwenMap.atk ??= 0;
  prydwenMap.atk += 350;
  prydwenMap.hp ??= 0;
  prydwenMap.hp += 4560;

  const buildMap = toMergedObj(baseMap, prydwenMap);

  return runRotation(buildMap);
}
