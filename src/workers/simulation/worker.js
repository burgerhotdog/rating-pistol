import { mergeEquipList, computeTotalStat, compileStatMap, sumRotationDmg } from '@/utils';
import { findBenchmarkWeek, getAverageScores, findRelativeError, summarizeRotation, evaluateRotationSummary } from './helpers';
import { createTrial } from './createTrial';
import { advanceTrial } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { CHARACTERS, MISC } from '@/data';

const MIN_TRIALS = 50;
const MAX_TRIALS = 500;
const MAX_WEEKS = 20;

function simulateCharacter({ gameId, characterId, build, team, setIdList }) {
  const simulationStartMs = performance.now();
  const match = CHARACTERS[gameId][characterId].match ?? ['ER'];
  const matchTargets = match.map(stat => {
    return computeTotalStat(stat, compileStatMap(gameId, characterId, build));
  });

  // Compute the rotation summary once — shared across all trials and all weeks
  const summary = summarizeRotation(gameId, team, characterId);

  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) {
    trials.push(createTrial(matchTargets, gameId, characterId, build, match, team, summary));
  }

  const preferredMainStats = findPreferred(trials[0], gameId, characterId, match, team, matchTargets, summary);

  let lastBenchmarkWeek = null;
  let lastDiff = null;
  const weekTimingsMs = [];

  for (let week = 1; week <= MAX_WEEKS; week++) {
    const weekStartMs = performance.now();
    const trialLoopStartMs = performance.now();
    let trialCount = 0;
    for (const [trialIndex, trial] of trials.entries()) {
      advanceTrial(preferredMainStats, trial, setIdList, matchTargets, characterId, match, team, summary);
      self.postMessage({ type: 'progress', trial: trialIndex + 1 });
      trialCount += 1;
    }
    const trialLoopMs = performance.now() - trialLoopStartMs;

    const adaptiveStartMs = performance.now();
    let adaptiveTrialsCreated = 0;

    while (trials.length < MAX_TRIALS) {
      const values = trials.map(trial => sumRotationDmg(trial.scores[week]));
      if (findRelativeError(values) <= 0.005) break;

      const trial = createTrial(matchTargets, gameId, characterId, build, match, team, summary);
      for (let w = 1; w <= week; w++) {
        advanceTrial(preferredMainStats, trial, setIdList, matchTargets, characterId, match, team, summary);
      }
      trials.push(trial);
      adaptiveTrialsCreated += 1;
    }
    const adaptiveMs = performance.now() - adaptiveStartMs;

    const avgTrialMs = trialCount > 0 ? trialLoopMs / trialCount : 0;
    weekTimingsMs.push({
      week,
      trialCount,
      trialLoopMs: Math.round(trialLoopMs),
      avgTrialMs: Math.round(avgTrialMs),
      adaptiveTrialsCreated,
      adaptiveMs: Math.round(adaptiveMs),
      totalWeekMs: Math.round(performance.now() - weekStartMs),
    });

    const weeklyScores = getAverageScores(trials, week);
    const { benchmarkWeek, diff } = findBenchmarkWeek(weeklyScores);
    lastDiff = diff;

    self.postMessage({ type: 'progress', currentMember: characterId, completed: week, diff });
    if (benchmarkWeek !== -1 && benchmarkWeek <= week) {
      lastBenchmarkWeek = benchmarkWeek;
      break;
    }
  }

  if (!lastBenchmarkWeek) lastBenchmarkWeek = MAX_WEEKS;
  const weeklyScores = getAverageScores(trials, lastBenchmarkWeek);

  return {
    matchTargets,
    trials,
    preferredMainStats,
    summary,
    benchmarkWeek: lastBenchmarkWeek,
    weeklyScores,
    diff: lastDiff,
    timingsMs: {
      totalSimulationMs: Math.round(performance.now() - simulationStartMs),
      weekTimingsMs,
    },
  };
}

self.onmessage = ({ data }) => {
  const workerStartMs = performance.now();
  const { gameId, characterId, build, team } = data;
  const { NUM_MAINSTATS } = MISC[gameId];
  const setIdList = build.equipList.map(equip => equip?.setId);
  const timings = {
    teammateCalibrationMs: 0,
    mainSimulationMs: 0,
  };

  const teamFinalStats = {};

  // Generate benchmark builds for teammates
  self.postMessage({ type: 'progress', statusMessage: 'Calibrating teammates', currentMember: null, completed: 0 });
  const teammateCalibrationStartMs = performance.now();
  for (let ti = team.length - 1; ti >= 0; ti--) {
    const member = team[ti];
    const { memberId, weaponId, setCounts } = member;
    if (!memberId || memberId === characterId) continue;
    if (member.build) continue; // user build attached — skip calibration

    const memberSetIdList = Object.entries(setCounts)
      .flatMap(([setId, count]) => Array(count).fill(setId))
      .concat(Array(NUM_MAINSTATS).fill(null))
      .slice(0, NUM_MAINSTATS);

    const memberBuild = { weaponId, equipList: new Array(NUM_MAINSTATS).fill(null) };

    self.postMessage({ type: 'progress', currentMember: memberId, completed: 0, diff: null });
    const memberResult = simulateCharacter({
      gameId,
      characterId: memberId,
      build: memberBuild,
      team,
      setIdList: memberSetIdList,
    });
    
    const finalStats = {};
    for (let i = 0; i < memberResult.trials.length; i++) {
      const finalCombined = mergeEquipList(memberResult.trials[i].build.equipList);
      for (const stat in finalCombined) {
        finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat] / memberResult.trials.length;
      }
    }
    teamFinalStats[memberId] = finalStats;
  }
  timings.teammateCalibrationMs = Math.round(performance.now() - teammateCalibrationStartMs);

  // Run farming simulation for current character
  self.postMessage({ type: 'progress', statusMessage: 'Running simulation', currentMember: characterId, completed: 0, diff: null });
  const mainSimulationStartMs = performance.now();
  const currentResult = simulateCharacter({
    gameId,
    characterId,
    build,
    team: team.map(member => {
      if (member.memberId === characterId) return { ...member };
      if (member.build) return { ...member }; // user build — preserve as-is
      return { ...member, build: { weaponId: member.weaponId, statMap: teamFinalStats[member.memberId], setCounts: member.setCounts } };
    }),
    setIdList,
  });
  timings.weekTimingsMs = currentResult.timingsMs.weekTimingsMs;
  timings.mainSimulationMs = Math.round(performance.now() - mainSimulationStartMs);

  const { trials, preferredMainStats, summary: currentSummary, benchmarkWeek: lastBenchmarkWeek, weeklyScores } = currentResult;

  const finalStats = {};
  for (let i = 0; i < trials.length; i++) {
    const finalCombined = mergeEquipList(trials[i].build.equipList);
    for (const stat in finalCombined) {
      finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat] / trials.length;
    }
  }

  // Per-week score percentiles for distribution bands
  const weeklyDistribution = [];
  for (let week = 0; week <= lastBenchmarkWeek; week++) {
    const values = trials.map(t => t.scores[week]).sort((a, b) => sumRotationDmg(a) - sumRotationDmg(b));
    const n = values.length;
    weeklyDistribution.push({
      min: values[0],
      p10: values[Math.floor(n * 0.1)],
      q1: values[Math.floor(n * 0.25)],
      median: values[Math.floor(n * 0.5)],
      q3: values[Math.floor(n * 0.75)],
      p90: values[Math.floor(n * 0.9)],
      max: values[n - 1],
    });
  }

  // Build actionMap using the character's actual equipped build (same as what
  // normalizeTeam returned for the character — m.build is the top-level build).
  const actionMap = evaluateRotationSummary(currentSummary, compileStatMap(gameId, characterId, build));
  const actionMapsWithSub = Object.fromEntries(Object.entries(MISC[gameId].SUB_STAT_TYPES)
    .map(([id, { VALUE }]) => {
      const buildWithSub = {
        ...build,
        equipList: [...build.equipList, { mainStatId: id, mainStatValue: VALUE, subStatList: [] }],
      };
      return [id, evaluateRotationSummary(currentSummary, compileStatMap(gameId, characterId, buildWithSub))];
    }));
  timings.totalWorkerMs = Math.round(performance.now() - workerStartMs);

  self.postMessage({
    type: 'done',
    completed: lastBenchmarkWeek,
    weeklyScores,
    finalStats,
    preferredMainStats,
    weeklyDistribution,
    teamFinalStats,
    actionMap,
    actionMapsWithSub,
    timings,
  });
};
