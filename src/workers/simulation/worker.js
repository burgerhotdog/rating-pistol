import { MISC } from '@/data';
import {
  computeActualRotationTime,
  estimateDps,
  getTotals,
} from '@/utils';
import { buildCache } from './cache';
import { runRotation } from './rotation';
import { runTrials } from './runTrials';
import { testWeapons, testSets } from './comparisons';
import { testSkillLevels } from './skill-levels';

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
  self.postMessage({ status: 'Building cache' });
  console.time('buildCache');
  const cache = buildCache(data);
  console.timeEnd('buildCache');

  const { gameId, charId } = cache;

  const equipMaps = await resolveEquipMaps(cache);

  self.postMessage({ status: 'Checking rotation' });
  const userSnapshots = runRotation(cache, equipMaps);
  const userDamage = getTotals(userSnapshots).damage;
  const userRotationTime = computeActualRotationTime(cache, equipMaps);
  const userDps = userDamage / userRotationTime * 1000;

  self.postMessage({ status: 'Testing weapons' });
  console.time('testWeapons');
  const weaponResults = testWeapons(cache, equipMaps, charId);
  console.timeEnd('testWeapons');

  self.postMessage({ status: 'Testing sets' });
  console.time('testSets');
  const setResults = testSets(cache, equipMaps, charId);
  console.timeEnd('testSets');

  console.time('runTrials');
  const results = await runTrials(cache, equipMaps, charId, true);
  console.timeEnd('runTrials');

  self.postMessage({ status: 'Testing skill levels' });
  console.time('skillLevelTests');
  const skillLevelResults = testSkillLevels(cache, equipMaps, charId);
  console.timeEnd('skillLevelTests');

  self.postMessage({
    memberIds: cache.memberIds,
    userMember: { ...cache.member[charId] },
    userSnapshots,
    userRotationTime,
    userDps,
    weaponResults,
    setResults,
    dpsCeiling: results.dpsCeiling,
    dpsProgression: results.dpsProgression,
    fit: results.fit,
    equipListConfigs: results.equipListConfigs,
    ...findBenchmark(gameId, results.dpsCeiling, results.dpsProgression, results.fit),
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
      return {
        benchmarkDps: dps,
        benchmarkDay: day,
      };
    }

    day++;
  }
}
