import { toEquipMap, getTotals } from '@/utils';
import { createRunRotation } from './rotation';
import { compileCache } from './cache';
import { runTrials } from './runTrials';
import { getSubRollSums, getMainConfig } from './utils';

const buildConfigStats = (gameId, trials) => {
  const configMap = {};

  for (const trial of trials) {
    const key = getMainConfig(gameId, trial.equipList);

    if (!configMap[key]) {
      configMap[key] = {
        count: 0,
        subDist: {},
      };
    }

    const entry = configMap[key];
    entry.count++;

    const { subDist } = entry;
    const rollMap = getSubRollSums(gameId, trial.equipList);
    for (const [stat, rolls] of Object.entries(rollMap)) {
      subDist[stat] ??= 0;
      subDist[stat] += rolls;
    }
  }

  for (const { count, subDist } of Object.values(configMap)) {
    for (const [stat, rolls] of Object.entries(subDist)) {
      subDist[stat] = rolls / count;
    }
  }

  return configMap;
};

function generateEquipMap(cache, team, memberId) {
  self.postMessage({ status: `Generating trial build for ${memberId}` });

  const equipMaps = resolveEquipMaps(cache, team, true);
  const runRotation = createRunRotation(cache, equipMaps, memberId);
  const { trials } = runTrials(cache, runRotation, memberId);

  return trials.reduce((acc, { equipList }) => {
    const equipMap = toEquipMap(equipList);
    for (const stat in equipMap) {
      const value = equipMap[stat] / trials.length;
      acc[stat] = (acc[stat] ?? 0) + value;
    }
    return acc;
  }, {});
}

function resolveEquipMaps(cache, team, allowBlank) {
  const equipMaps = {};
  for (const member of team) {
    if ('build' in member) {
      equipMaps[member.id] = cache.member[member.id].equipMap;
    } else if (allowBlank) {
      equipMaps[member.id] = {};
    } else {
      equipMaps[member.id] = generateEquipMap(cache, team, member.id);
    }
  }
  return equipMaps;
}

self.onmessage = ({ data }) => {
  const { gameId, charId, team } = data;
  const cache = compileCache(gameId, team);
  const equipMaps = resolveEquipMaps(cache, team);

  self.postMessage({ status: 'Running simulation' });
  const runRotation = createRunRotation(cache, equipMaps, charId);
  const userSummary = runRotation(cache.member[charId].statMap);
  const userDps = cache.getDps(getTotals(userSummary).damage);
  if (Number.isNaN(userDps)) {
    console.log(userDps);
    self.postMessage({ errorLog: cache.effects });
    throw new Error('error');
  }
  const { trials, dpsProgression, dpsCeiling, thresholdWeeks, fit } = runTrials(cache, runRotation, charId, true);
  const configMap = buildConfigStats(gameId, trials);

  const benchmarkDps = dpsProgression.at(-1).mean;

  self.postMessage({
    dpsProgression,
    dpsCeiling,
    thresholdWeeks,
    // fit's predict/weekForRemaining closures can't cross postMessage, only q/A are needed downstream
    fit: fit ? { q: fit.q, A: fit.A } : null,
    configMap,
    userSummary,
    userDps,
    benchmarkDps,
    userConfigKey: getMainConfig(gameId, cache.member[charId].equipList),
    userSubStats: getSubRollSums(gameId, cache.member[charId].equipList),
    memberIds: cache.memberIds,
  });
};
