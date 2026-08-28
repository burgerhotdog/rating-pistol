import { getTotals, estimateDps, estimateDay } from '@/utils';
import { runRotation } from './rotation';
import { compileCache } from './cache';
import { runTrials } from './runTrials';
import { getSubRollSums, getMainConfig } from './utils';
import { weaponTests } from './weaponTests';

async function generateEquipMap(cache, memberId) {
  self.postMessage({ status: `Generating trial build for ${memberId}` });

  const equipMaps = resolveEquipMaps(cache, 'allowBlank');
  const meanEquipMap = await runTrials(cache, equipMaps, memberId);
  return meanEquipMap;
}

async function resolveEquipMaps(cache, allowBlank) {
  const equipMaps = {};

  for (const member of Object.values(cache.member)) {
    if ('equipList' in member) {
      equipMaps[member.id] = member.equipMap;
      continue;
    }

    equipMaps[member.id] = allowBlank
      ? {}
      : await generateEquipMap(cache, member.id);
  }

  return equipMaps;
}

self.onmessage = async ({ data }) => {
  const cache = compileCache(data);
  const equipMaps = await resolveEquipMaps(cache);

  self.postMessage({ status: 'Running simulation' });

  // Sanity check
  const userSummary = runRotation(cache, equipMaps);
  const userDps = getTotals(userSummary).damage / cache.rotationDuration * 1000
  if (Number.isNaN(userDps)) {
    console.log(userDps);
    self.postMessage({ errorLog: cache.effects });
    throw new Error('error');
  }

  const results = await runTrials(cache, equipMaps, cache.charId, true);

  const { benchmarkDay, benchmarkDps } = findBenchmark(results.dpsProgression, results.fit, results.dpsCeiling);
  const weaponResults = weaponTests(cache, equipMaps, cache.charId);

  self.postMessage({
    dpsProgression: results.dpsProgression,
    dpsCeiling: results.dpsCeiling,
    fit: results.fit,
    configMap: results.configMap,
    userSummary,
    userDay: estimateDay(userDps, results.dpsCeiling, results.dpsProgression, results.fit),
    userDps,
    benchmarkDay,
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
