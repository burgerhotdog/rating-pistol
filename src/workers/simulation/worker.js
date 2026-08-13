import { toEquipMap, getTotals } from '@/utils';
import { runRotation } from './rotation';
import { compileCache } from './cache';
import { runTrials } from './runTrials';
import { getSubRollSums, getMainConfig } from './utils';
import { weaponTests } from './weaponTests';

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
  const { trials } = runTrials(cache, equipMaps, memberId);

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

  const userSummary = runRotation(cache, equipMaps);
  const userDps = cache.getDps(getTotals(userSummary).damage);
  if (Number.isNaN(userDps)) {
    console.log(userDps);
    self.postMessage({ errorLog: cache.effects });
    throw new Error('error');
  }

  const results = runTrials(cache, equipMaps, charId, true);

  const configMap = buildConfigStats(gameId, results.trials);
  const benchmarkDps = results.dpsProgression.at(-1).mean;
  const weaponResults = weaponTests(cache, equipMaps, charId);

  self.postMessage({
    dpsProgression: results.dpsProgression,
    dpsCeiling: results.dpsCeiling,
    thresholdWeeks: results.thresholdWeeks,
    // fit's predict/weekForRemaining closures can't cross postMessage, only q/A are needed downstream
    fit: results.fit ? { q: results.fit.q, A: results.fit.A } : null,
    configMap,
    userSummary,
    userDps,
    benchmarkDps,
    userConfigKey: getMainConfig(gameId, cache.member[charId].equipList),
    userSubStats: getSubRollSums(gameId, cache.member[charId].equipList),
    memberIds: cache.memberIds,
    weaponResults,
    userMember: { weaponId: cache.member[charId].weaponId, weaponRank: cache.member[charId].weaponRank },
  });
};
