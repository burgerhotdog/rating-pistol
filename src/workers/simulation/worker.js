import { CHARACTER } from '@/data';
import { estimateDps, getTotals } from '@/utils';
import { buildCache } from './cache';
import { runRotation } from './rotation';
import { computeDuration } from './duration';
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

    const memberName = CHARACTER[cache.gameId][member.id].name;
    self.postMessage({ title: `Generating trial build for ${memberName}` });

    const trialEquipMaps = await resolveEquipMaps(cache, true);
    const { meanEquipMap } = await runTrials(cache, trialEquipMaps, member.id);

    equipMaps[member.id] = meanEquipMap;
  }

  return equipMaps;
}

self.onmessage = async ({ data }) => {
  const cache = buildCache(data);

  const { charId } = cache;
  self.postMessage({
    memberIds: cache.memberIds,
    userMember: cache.member[charId],
  });

  const equipMaps = await resolveEquipMaps(cache);

  const { snapshots: userSnapshots, bonusEnergy } = runRotation(cache, equipMaps);
  const userTotals = getTotals(userSnapshots);
  const {
    time: userRotationTime,
    source: userRotationTimeSource,
  } = computeDuration(cache, equipMaps, bonusEnergy);

  self.postMessage({
    userSnapshots,
    userRotationTime,
    userRotationTimeSource,
    userDps: userTotals.damage / userRotationTime * 1000,
  });

  console.time('runEquipTests');
  const results = await runEquipTests(cache, equipMaps, charId);
  console.timeEnd('runEquipTests');
  self.postMessage({
    dpsCeiling: results.dpsCeiling,
    dpsProgression: results.dpsProgression,
    fit: results.fit,
    equipListConfigs: results.equipListConfigs,
    ...findBenchmark(results.dpsCeiling, results.dpsProgression, results.fit),
    extraSubstats: results.extraSubstats,
    extraSubstatsControl: results.extraSubstatsControl,
  });

  console.time('runComparisonTests');
  const { weaponResults, setResults } = runComparisonTests(cache, equipMaps, bonusEnergy);
  console.timeEnd('runComparisonTests');
  self.postMessage({ weaponResults, setResults });

  console.time('runSkillLevelTests');
  const skillLevelResults = runSkillLevelTests(cache, equipMaps, charId);
  console.timeEnd('runSkillLevelTests');
  self.postMessage({ skillLevelResults });

  self.postMessage({ status: 'done' });
};

function findBenchmark1(dpsCeiling, dpsProgression, fit) {
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
function findBenchmark(dpsCeiling, dpsProgression, fit) {
  let benchmarkDay = 0;
  let benchmarkDps = estimateDps(0, dpsCeiling, dpsProgression, fit);
  let previousImprovement = null;
  let increaseCount = 0;

  while (benchmarkDay < 28) {
    const nextDps = estimateDps(benchmarkDay + 1, dpsCeiling, dpsProgression, fit);
    const improvement = nextDps / benchmarkDps - 1;

    if (previousImprovement !== null && improvement >= previousImprovement) {
      increaseCount++;
    }

    if (improvement < 0.005 || increaseCount >= 3) break;

    previousImprovement = improvement;
    benchmarkDay++;
    benchmarkDps = nextDps;
  }

  return { benchmarkDay, benchmarkDps };
}