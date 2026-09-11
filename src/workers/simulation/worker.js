import { LANG } from '@/data';
import {
  computeActualRotationTime,
  estimateDps,
  getTotals,
} from '@/utils';
import { buildCache } from './cache';
import { runRotation } from './rotation';
import { testWeapons, testSets } from './comparison-tests';
import { runEquipTests } from './equip-tests';
import { runSkillLevelTests } from './skill-level-tests';

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

    self.postMessage({ title: `Generating trial build for ${member.id}` });

    const trialEquipMaps = await resolveEquipMaps(cache, true);
    equipMaps[member.id] = await runEquipTests(cache, trialEquipMaps, member.id);
  }

  return equipMaps;
}

self.onmessage = async ({ data }) => {
  self.postMessage({ title: 'Building cache' });
  console.time('buildCache');
  const cache = buildCache(data);
  console.timeEnd('buildCache');

  const { gameId, charId } = cache;
  const langData = LANG[gameId];

  const equipMaps = await resolveEquipMaps(cache);

  self.postMessage({ title: 'Simulating rotation' });
  const userSnapshots = runRotation(cache, equipMaps);
  const userDamage = getTotals(userSnapshots).damage;
  const userRotationTime = computeActualRotationTime(cache, equipMaps);
  const userDps = userDamage / userRotationTime * 1000;

  self.postMessage({ title: `Running ${langData.Weapon} Tests` });
  console.time('testWeapons');
  const weaponResults = testWeapons(cache, equipMaps, charId);
  console.timeEnd('testWeapons');

  self.postMessage({ title: `Running ${langData.Equip} Set Bonus Tests` });
  console.time('testSets');
  const setResults = testSets(cache, equipMaps, charId);
  console.timeEnd('testSets');

  self.postMessage({ title: `Running ${langData.Equip} Farming Simulations` });
  console.time('runEquipTests');
  const results = await runEquipTests(cache, equipMaps, charId, true);
  console.timeEnd('runEquipTests');

  self.postMessage({ title: 'Running Skill Level Tests' });
  console.time('runSkillLevelTests');
  const skillLevelResults = runSkillLevelTests(cache, equipMaps, charId);
  console.timeEnd('runSkillLevelTests');

  self.postMessage({
    status: 'done',
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
    ...findBenchmark(results.dpsCeiling, results.dpsProgression, results.fit),
    skillLevelResults,
  });
};

function findBenchmark(dpsCeiling, dpsProgression, fit) {
  let benchmarkDay = 0;
  let benchmarkDps = estimateDps(0, dpsCeiling, dpsProgression, fit);

  while (true) {
    const nextDps = estimateDps(benchmarkDay + 1, dpsCeiling, dpsProgression, fit)

    if (nextDps / benchmarkDps < 1.01) {
      return {
        benchmarkDay,
        benchmarkDps,
      };
    }

    benchmarkDay++;
    benchmarkDps = nextDps;
  }
}
