import { LANG } from '@/data';
import {
  computeActualRotationTime,
  estimateDps,
  getTotals,
} from '@/utils';
import { buildCache } from './cache';
import { runRotation } from './rotation';
import { runComparisonTests } from './comparison-tests';
import { runEquipTests, runTrials } from './equip-tests';
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
    const { meanEquipMap } = await runTrials(cache, trialEquipMaps, member.id);

    equipMaps[member.id] = meanEquipMap;
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
  const userTotals = getTotals(userSnapshots);
  const { time: userRotationTime, source: userRotationTimeSource } = computeActualRotationTime(cache, equipMaps);
  const userDps = (userTotals.damage + userTotals.healing + userTotals.shield) / userRotationTime * 1000;

  console.time('runComparisonTests');
  const { weaponResults, setResults } = runComparisonTests(cache, equipMaps);
  console.timeEnd('runComparisonTests');

  self.postMessage({ title: `Running ${langData.Equip} Farming Simulations` });
  console.time('runEquipTests');
  const results = await runEquipTests(cache, equipMaps, charId);
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
    userRotationTimeSource,
    userDps,
    weaponResults,
    setResults,
    dpsCeiling: results.dpsCeiling,
    dpsProgression: results.dpsProgression,
    fit: results.fit,
    equipListConfigs: results.equipListConfigs,
    ...findBenchmark(results.dpsCeiling, results.dpsProgression, results.fit),
    extraSubstats: results.extraSubstats,
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
