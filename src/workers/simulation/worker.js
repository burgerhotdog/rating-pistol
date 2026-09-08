import { MISC } from '@/data';
import { computeActualRotationTime, estimateDps, getTotals } from '@/utils';
import { buildCache } from './cache';
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

  console.time('buildCache');
  const cache = buildCache(data);
  console.timeEnd('buildCache');

  const equipMaps = await resolveEquipMaps(cache);

  self.postMessage({ status: 'Checking rotation' });
  const userSnapshots = runRotation(cache, equipMaps);
  const userDamage = getTotals(userSnapshots).damage;
  const userRotationTime = computeActualRotationTime(cache, equipMaps);
  const userDps = userDamage / userRotationTime * 1000;

  console.time('runTrials');
  const results = await runTrials(cache, equipMaps, cache.charId, true);
  console.timeEnd('runTrials');

  const {
    dps: benchmarkDps,
    day: benchmarkDay,
  } = findBenchmark(cache.gameId, results.dpsCeiling, results.dpsProgression, results.fit);

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
    userMember: { ...cache.member[cache.charId] },
    userSnapshots,
    userRotationTime,
    userDps,
    dpsCeiling: results.dpsCeiling,
    dpsProgression: results.dpsProgression,
    fit: results.fit,
    benchmarkDps,
    benchmarkDay,
    equipListConfigs: results.equipListConfigs,
    memberIds: cache.memberIds,
    weaponResults,
    setResults,
    skillLevelResults,
  });
};

function findBenchmark(gameId, dpsCeiling, dpsProgression, fit) {
  const { staminaPerDay } = MISC[gameId];

  let day = 0;

  while (true) {
    const dps = estimateDps(day, dpsCeiling, dpsProgression, fit);
    const nextDps = estimateDps(day + 1, dpsCeiling, dpsProgression, fit);

    const diff = nextDps - dps;
    const diffPct = diff / dps * 100;
    const diffPctPerStamina = diffPct / staminaPerDay;

    if (diffPctPerStamina < 0.004) {
      return { dps, day };
    }

    day++;
  }
}
