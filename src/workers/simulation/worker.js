import { buildEquipMap, getTotals } from '@/utils';
import { runRotation } from './rotation';
import { compileCache } from './cache';
import { runTrials, runTrialsParallel } from './runTrials';
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
    const rollMap = getSubRollSums(gameId, trial.equipList, true);
    for (const [stat, rolls] of Object.entries(rollMap)) {
      subDist[stat] = (subDist[stat] ?? 0) + rolls;
    }
  }

  for (const { count, subDist } of Object.values(configMap)) {
    for (const [stat, rolls] of Object.entries(subDist)) {
      subDist[stat] = rolls / count;
    }
  }

  return configMap;
};

function generateEquipMap(cache, memberId) {
  self.postMessage({ status: `Generating trial build for ${memberId}` });

  const equipMaps = resolveEquipMaps(cache, 'allowBlank');
  const { trials } = runTrials(cache, equipMaps, memberId);

  return trials.reduce((acc, { equipList }) => {
    const equipMap = buildEquipMap(equipList, true);
    for (const stat in equipMap) {
      const value = equipMap[stat] / trials.length;
      acc[stat] = (acc[stat] ?? 0) + value;
    }
    return acc;
  }, {});
}

function resolveEquipMaps(cache, allowBlank) {
  const equipMaps = {};

  for (const member of Object.values(cache.member)) {
    if ('equipList' in member) {
      equipMaps[member.id] = member.equipMap;
      continue;
    }

    equipMaps[member.id] = allowBlank
      ? {}
      : generateEquipMap(cache, member.id);
  }

  return equipMaps;
}

self.onmessage = async ({ data }) => {
  const cache = compileCache(data);
  const equipMaps = resolveEquipMaps(cache);

  self.postMessage({ status: 'Running simulation' });

  // Sanity check
  const userSummary = runRotation(cache, equipMaps);
  const userDps = getTotals(userSummary).damage / cache.rotationDuration * 1000
  if (Number.isNaN(userDps)) {
    console.log(userDps);
    self.postMessage({ errorLog: cache.effects });
    throw new Error('error');
  }

  console.time('runTrials');
  const results = runTrials(cache, equipMaps, cache.charId, true);
  console.timeEnd('runTrials');

  console.time('runTrialsParallel');
  const resultsParallel = await runTrialsParallel(cache, equipMaps, cache.charId, true);
  console.timeEnd('runTrialsParallel');

  const configMap = buildConfigStats(cache.gameId, results.trials);
  const benchmarkDps = results.dpsProgression.at(-1);
  const weaponResults = weaponTests(cache, equipMaps, cache.charId);

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
    userConfigKey: getMainConfig(cache.gameId, cache.member[cache.charId].equipList),
    userSubStats: getSubRollSums(cache.gameId, cache.member[cache.charId].equipList),
    memberIds: cache.memberIds,
    weaponResults,
    userMember: {
      weaponId: cache.member[cache.charId].weaponId,
      weaponRank: cache.member[cache.charId].weaponRank,
    },
  });
};
