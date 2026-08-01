import { GI, WW } from '@/data';
import { mergeEquipList } from '@/utils';
import { createRunRotation } from './rotation';
import { createTrialAdvancer } from './advanceTrial';
import { findGoodStats } from './stats/findGoodStats';
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

function createSummaryAcc() {
  return {
    acc: [],
    count: 0,
    add(summary) {
      this.count++;

      for (const [index, snapshot] of summary.entries()) {
        const snapshotAcc = this.acc[index];

        if (snapshotAcc) {
          for (const part of ['damage', 'healing', 'shield']) {
            if (!(part in snapshot)) continue;
            snapshotAcc[part] ??= 0;
            snapshotAcc[part] += snapshot[part] ?? 0;
          }
        } else {
          this.acc[index] = { ...snapshot };
        }
      }
    },
    getAvgSummary() {
      return this.acc.map((snapshot) => ({
        ...snapshot,
        ...('damage' in snapshot &&
          { damage: snapshot.damage / this.count }),
        ...('healing' in snapshot &&
          { healing: snapshot.healing / this.count }),
        ...('shield' in snapshot &&
          { shield: snapshot.shield / this.count }),
      }));
    },
  };
};

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
  for (let i = 0; i < MIN_TRIALS; i++) trials.push(createTrial());

  // Main trial loop
  let prevAvgScore = baseScore;
  for (let week = 1; week <= MAX_WEEKS; week++) {
    const weekScores = createScoreTracker();
    const weekSummaryAcc = createSummaryAcc();

    for (const trial of trials) {
      advanceTrial(trial);
      weekScores.add(trial.score);
      if (isMain) weekSummaryAcc.add(trial.summary);
    }

    while (week === 1 && trials.length < MAX_TRIALS) {
      if (weekScores.relativeError <= 0.005) break;
      const trial = createTrial();
      advanceTrial(trial);
      trials.push(trial);
      weekScores.add(trial.score);
      if (isMain) weekSummaryAcc.add(trial.summary);
    }

    const avgScore = weekScores.mean;
    const diff = (avgScore - prevAvgScore) / prevAvgScore;

    if (isMain) {
      self.postMessage({ week, diff });
      weeklySummaries.push(weekSummaryAcc.getAvgSummary());
    }

    if (diff < 0.01) break;

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

  return {
    cache,
    weeklySummaries,
    userSummary: runRotation(cache.member[currId].statMap),
    configMap: buildConfigStats(gameId, trials),
    userConfigKey: getMainConfig(gameId, cache.member[currId].equipList),
    userSubStats: getSubRollSums(gameId, cache.member[currId].equipList),
    runRotation,
  };
};
