import {
  computeConcertoExtraTime,
  computeDps,
  estimateDay,
  estimateDps,
  getMainstatConfigKey,
  sumSubstatRolls,
} from '@/utils';
import { compileCache } from './cache';
import { runRotation } from './rotation';
import { runTrials } from './runTrials';
import { weaponTests } from './weaponTests';
import { setTests } from './setTests';
import { skillLevelTests } from './skillLevelTests';

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
  self.postMessage({ status: 'Compiling cache' });

  console.time('compileCache');
  const cache = compileCache(data);
  console.timeEnd('compileCache');

  const equipMaps = await resolveEquipMaps(cache);

  // Sanity check
  self.postMessage({ status: 'Checking rotation' });
  const userSnapshots = runRotation(cache, equipMaps);
  const concertoExtraTime = computeConcertoExtraTime(cache.member[cache.charId]);
  const userDps = computeDps(userSnapshots, cache.rotationDuration + concertoExtraTime);
  if (Number.isNaN(userDps)) {
    console.log(userDps);
    self.postMessage({ errorLog: cache.effects });
    throw new Error('error');
  }

  console.time('runTrials');
  const results = await runTrials(cache, equipMaps, cache.charId, true);
  console.timeEnd('runTrials');

  const { benchmarkDay, benchmarkDps } = findBenchmark(results.dpsProgression, results.fit, results.dpsCeiling);

  console.time('weaponTests');
  const weaponResults = weaponTests(cache, equipMaps, cache.charId);
  console.timeEnd('weaponTests');

  console.time('setTests');
  const setResults = setTests(cache, equipMaps, cache.charId);
  console.timeEnd('setTests');

  console.time('skillLevelTests');
  const skillLevelResults = skillLevelTests(cache, equipMaps, cache.charId);
  console.timeEnd('skillLevelTests');
  

  self.postMessage({
    dpsProgression: results.dpsProgression,
    dpsCeiling: results.dpsCeiling,
    fit: results.fit,
    equipListConfigs: results.equipListConfigs,
    userSnapshots,
    userDay: estimateDay(userDps, results.dpsCeiling, results.dpsProgression, results.fit),
    userDps,
    benchmarkDay,
    benchmarkDps,
    userMainstatConfigKey: getMainstatConfigKey(cache.gameId, cache.member[cache.charId].equipList),
    userSubstatRolls: sumSubstatRolls(cache.gameId, cache.member[cache.charId].equipList),
    memberIds: cache.memberIds,
    weaponResults,
    setResults,
    skillLevelResults,
    userMember: {
      weaponId: cache.member[cache.charId].weaponId,
      weaponRank: cache.member[cache.charId].weaponRank,
      setCounts: cache.member[cache.charId].setCounts,
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
