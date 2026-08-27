import { getTotals } from '@/utils';
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

function findInefficientDay(dpsProgression, fit, dpsCeiling) {
  let today = 0;
  let todayDps = dpsProgression[0].mean;

  const getDps = (thisDay) => {
    if (thisDay > dpsProgression.at(-1).day) {
      return dpsCeiling - fit.A * thisDay ** -fit.q;
    }

    const datapoint = dpsProgression.find(({ day }) => day === thisDay);
    if (datapoint) {
      return datapoint.mean;
    }

    const hiIndex = dpsProgression.findIndex(({ day }) => day > thisDay);
    const hi = dpsProgression[hiIndex];
    const lo = dpsProgression[hiIndex - 1];

    const t = (thisDay - lo.day) / (hi.day - lo.day);
    return lo.mean + (hi.mean - lo.mean) * t;
  };

  while (true) {
    const tomorrowDps = getDps(today + 1);
    if ((tomorrowDps / todayDps) >= 1.01) {
      today++;
      todayDps = tomorrowDps;
      continue;
    }

    let daysForMoreThanOnePercentGain = 2;
    while (true) {
      const nextDps = getDps(today + daysForMoreThanOnePercentGain);
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

const findUserDay = (dpsProgression, dpsCeiling, fit, userDps) => {
  if (userDps > dpsProgression.at(-1).mean) {
    return (fit.A / (dpsCeiling - userDps)) ** (1 / fit.q);
  }

  const datapoint = dpsProgression.find(({ mean }) => mean === userDps);
  if (datapoint) {
    return datapoint.day;
  }

  const hiIndex = dpsProgression.findIndex(({ mean }) => mean > userDps);
  const hi = dpsProgression[hiIndex];
  const lo = dpsProgression[hiIndex - 1];

  const t = (userDps - lo.mean) / (hi.mean - lo.mean);
  return lo.day + (hi.day - lo.day) * t;
};

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

  const userDay = findUserDay(results.dpsProgression, results.dpsCeiling, results.fit, userDps);
  const { benchmarkDay, benchmarkDps } = findInefficientDay(results.dpsProgression, results.fit, results.dpsCeiling);
  const weaponResults = weaponTests(cache, equipMaps, cache.charId);

  self.postMessage({
    dpsProgression: results.dpsProgression,
    dpsCeiling: results.dpsCeiling,
    fit: results.fit,
    configMap: results.configMap,
    userSummary,
    userDay,
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
