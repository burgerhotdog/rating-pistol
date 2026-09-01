import {
  computeDps,
  estimateDps,
  estimateDay,
} from '@/utils';
import { compileCache } from './cache';
import { runRotation } from './rotation';
import { runTrials } from './runTrials';
import { getSubRollSums, getMainConfig } from './utils';
import { weaponTests } from './weaponTests';
import { setTests } from './setTests';

async function resolveEquipMaps(cache, allowBlank = false) {
  const equipMaps = {};

  for (const member of Object.values(cache.member)) {
    if (member.equipList) {
      equipMaps[member.id] = member.equipMap;
      continue;
    }

    if (allowBlank) {
      equipMaps[member.id] = {};
      continue;
    }

    self.postMessage({ status: `Generating trial build for ${member.id}` });

    const trialEquipMaps = await resolveEquipMaps(cache, true);
    equipMaps[member.id] = await runTrials(cache, trialEquipMaps, member.id);
  }

  return equipMaps;
}

self.onmessage = async ({ data }) => {
  self.postMessage({ status: 'Starting simulation' });

  self.postMessage({ status: 'Compiling cache' });
  const cache = compileCache(data);
  const equipMaps = await resolveEquipMaps(cache);

  // Sanity check
  self.postMessage({ status: 'Checking rotation' });
  const userSnapshots = runRotation(cache, equipMaps);
  const concertoExtraTime = cache.member[cache.charId].concertoPenalty
    ? ((100 / 92) * cache.member[cache.charId].duration - cache.member[cache.charId].duration)
    : 0;
  const userDps = computeDps(userSnapshots, cache.rotationDuration + concertoExtraTime);
  if (Number.isNaN(userDps)) {
    console.log(userDps);
    self.postMessage({ errorLog: cache.effects });
    throw new Error('error');
  }

  const results = await runTrials(cache, equipMaps, cache.charId, true);

  const { benchmarkDay, benchmarkDps } = findBenchmark(results.dpsProgression, results.fit, results.dpsCeiling);
  const weaponResults = weaponTests(cache, equipMaps, cache.charId);
  const setResults = setTests(cache, equipMaps, cache.charId);

  self.postMessage({
    dpsProgression: results.dpsProgression,
    dpsCeiling: results.dpsCeiling,
    fit: results.fit,
    configMap: results.configMap,
    userSnapshots,
    userDay: estimateDay(userDps, results.dpsCeiling, results.dpsProgression, results.fit),
    userDps,
    benchmarkDay,
    benchmarkDps,
    userConfigKey: getMainConfig(cache.gameId, cache.member[cache.charId].equipList),
    userSubStats: getSubRollSums(cache.gameId, cache.member[cache.charId].equipList),
    memberIds: cache.memberIds,
    weaponResults,
    setResults,
    userMember: {
      weaponId: cache.member[cache.charId].weaponId,
      weaponRank: cache.member[cache.charId].weaponRank,
    },
  });
};

function findBenchmark(dpsProgression, fit, dpsCeiling) {
  let today = 0;
  let todayDps = dpsProgression[0].mean;

  while (true) {
    const tomorrowDps = estimateDps(today + 1, dpsCeiling, dpsProgression, fit);
    if ((tomorrowDps / todayDps) >= 1.01) {
      today++;
      todayDps = tomorrowDps;
      continue;
    }

    let daysForMoreThanOnePercentGain = 2;
    while (true) {
      const nextDps = estimateDps(today + daysForMoreThanOnePercentGain, dpsCeiling, dpsProgression, fit);
      if ((nextDps / todayDps) >= 1.05) {
        break;
      }
      daysForMoreThanOnePercentGain++;
    }

    if (daysForMoreThanOnePercentGain > today) {
      return { benchmarkDay: today, benchmarkDps: todayDps };
    }

    today++;
    todayDps = tomorrowDps;
  }
}
