import { CHARACTER } from '@/data';
import { estimateDps } from '@/utils';
import { buildCache } from './cache';
import { runComparisonTests } from './comparison-tests';
import { runEquipTests, runTrials } from './equip-tests';
import { runSkillLevelTests } from './skill-level-tests';
import { getRotationOrder } from './rotation-order';
import { calibrate } from './calibrate';

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
  const rawCache = buildCache(data);

  const { charId } = rawCache;
  self.postMessage({
    memberIds: rawCache.memberIds,
    userMember: rawCache.member[charId],
  });

  const equipMaps = await resolveEquipMaps(rawCache);

  const {
    order,
    snapshots: userSnapshots,
    bonusEnergy,
    time: userRotationTime,
    source: userRotationTimeSource,
    dps: userDps,
  } = getRotationOrder(rawCache, equipMaps);

  const cache = { ...rawCache, memberIds: order };

  self.postMessage({
    rotationOrder: order,
    userSnapshots,
    userRotationTime,
    userRotationTimeSource,
    userDps,
  });

  console.time('calibrate');
  const { calibration, scoreCeiling, dpsCeiling } = calibrate(cache, equipMaps, charId);
  console.timeEnd('calibrate');
  self.postMessage({
    scoreCeiling,
    dpsCeiling,
  });

  console.time('runEquipTests');
  const results = await runEquipTests(cache, equipMaps, charId, calibration, scoreCeiling);
  console.timeEnd('runEquipTests');
  self.postMessage({
    scoreProgression: results.scoreProgression,
    fit: results.fit,
    equipListConfigs: results.equipListConfigs,
    ...findBenchmark(results.scoreCeiling, results.scoreProgression, results.dpsProgression, results.fit),
    extraSubstats: results.extraSubstats,
    extraSubstatsControl: results.extraSubstatsControl,
    userScore: results.userScore,
  });

  // console.time('runComparisonTests');
  const { weaponResults, setResults } = runComparisonTests(cache, equipMaps, bonusEnergy);
  // console.timeEnd('runComparisonTests');
  self.postMessage({ weaponResults, setResults });

  // console.time('runSkillLevelTests');
  const skillLevelResults = runSkillLevelTests(cache, equipMaps, charId);
  // console.timeEnd('runSkillLevelTests');
  self.postMessage({ skillLevelResults });

  self.postMessage({ status: 'done' });
};

function findBenchmark(scoreCeiling, scoreProgression, dpsProgression, fit) {
  let benchmarkDay = 0;
  let benchmarkScore = estimateDps(0, scoreCeiling, scoreProgression, fit);
  let previousImprovement = null;
  let increaseCount = 0;

  while (benchmarkDay < 30) {
    const nextDps = estimateDps(benchmarkDay + 1, scoreCeiling, scoreProgression, fit);
    const improvement = nextDps / benchmarkScore - 1;

    if (previousImprovement !== null && improvement >= previousImprovement) {
      increaseCount++;
    }

    if (improvement < 0.005 && increaseCount >= 3) break;

    previousImprovement = improvement;
    benchmarkDay++;
    benchmarkScore = nextDps;
  }

  const benchmarkDps = dpsProgression[benchmarkDay]?.mean ?? dpsProgression.at(-1)?.mean;

  return { benchmarkDay, benchmarkScore, benchmarkDps };
}
