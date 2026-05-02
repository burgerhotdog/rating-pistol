import { mergeEquipList, computeTotalStat, compileStatMap, normalizeTeam, sumRotationDmg, simulateRotation } from '@/utils';
import { findBenchmarkWeek, getAverageScores, findRelativeError } from './helpers';
import { createTrial } from './createTrial';
import { advanceTrial } from './advanceTrial';
import { findPreferred } from './findPreferred';
import { CHARACTERS, MISC } from '@/data';

const MIN_TRIALS = 100;
const MAX_TRIALS = 1000;
const MAX_WEEKS = 20;

function simulateCharacter({ gameId, characterId, build, team, setIdList, reportProgress = false }) {
  const match = CHARACTERS[gameId][characterId].match ?? ['ER'];
  const matchTargets = match.map(stat => {
    return computeTotalStat(stat, compileStatMap(gameId, characterId, build, team, 'menu'));
  });

  const trials = [];
  for (let i = 0; i < MIN_TRIALS; i++) {
    trials.push(createTrial(matchTargets, gameId, characterId, build, match, team));
  }

  const preferredMainStats = findPreferred(trials[0], gameId, characterId, match, team, matchTargets);

  let lastBenchmarkWeek = null;
  let lastDiff = null;

  for (let week = 1; week <= MAX_WEEKS; week++) {
    for (const trial of trials) {
      advanceTrial(preferredMainStats, trial, setIdList, matchTargets, characterId, match, team);
    }

    while (trials.length < MAX_TRIALS) {
      const values = trials.map(trial => sumRotationDmg(trial.scores[week]));
      if (findRelativeError(values) <= 0.005) break;

      const trial = createTrial(matchTargets, gameId, characterId, build, match, team);
      for (let w = 1; w <= week; w++) {
        advanceTrial(preferredMainStats, trial, setIdList, matchTargets, characterId, match, team);
      }
      trials.push(trial);
    }

    const weeklyScores = getAverageScores(trials, week);
    const { benchmarkWeek, diff } = findBenchmarkWeek(weeklyScores);
    lastDiff = diff;

    if (reportProgress) self.postMessage({ type: 'progress', completed: week, diff });

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
    benchmarkWeek: lastBenchmarkWeek,
    weeklyScores,
    diff: lastDiff,
  };
}

self.onmessage = ({ data }) => {
  const { gameId, characterId, build, team } = data;
  const { NUM_MAINSTATS } = MISC[gameId];
  const setIdList = build.equipList.map(equip => equip?.setId);

  const teamFinalStats = {};

  // Generate benchmark builds for teammates
  for (let ti = team.length - 1; ti >= 0; ti--) {
    const member = team[ti];
    const { memberId, weaponId, setCounts } = member;
    if (!memberId || memberId === characterId) continue;

    const memberSetIdList = Object.entries(setCounts)
      .flatMap(([setId, count]) => Array(count).fill(setId))
      .concat(Array(NUM_MAINSTATS).fill(null))
      .slice(0, NUM_MAINSTATS);

    const memberBuild = { weaponId, equipList: new Array(NUM_MAINSTATS).fill(null) };

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

  // Run farming simulation for current character
  const currentResult = simulateCharacter({
    gameId,
    characterId,
    build,
    team: team.map(member => member.memberId === characterId ? { ...member } : { ...member, build: { weaponId: member.weaponId, statMap: teamFinalStats[member.memberId], setCounts: member.setCounts } }),
    setIdList,
    reportProgress: true,
  });

  const { trials, preferredMainStats, benchmarkWeek: lastBenchmarkWeek, weeklyScores } = currentResult;

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

  const normalizedTeam = normalizeTeam(team, teamFinalStats);
  const actionMap = simulateRotation(gameId, normalizedTeam);

  const actionMapsWithSub = Object.fromEntries(Object.entries(MISC[gameId].SUB_STAT_TYPES)
    .map(([id, { VALUE }]) => {
      const teamWithSubstat = team.map(m => {
        if (m.memberId !== characterId) return m;
        return {
          ...m,
          build: {
            ...m.build,
            equipList: [
              ...m.build.equipList,
              { mainStatId: id, mainStatValue: VALUE, subStatList: [] },
            ],
          },
        };
      });
      const normalizedTeam = normalizeTeam(teamWithSubstat, teamFinalStats);
      return [id, simulateRotation(gameId, normalizedTeam)];
    }));

  self.postMessage({ type: 'done', completed: lastBenchmarkWeek, weeklyScores, finalStats, preferredMainStats, weeklyDistribution, teamFinalStats, actionMap, actionMapsWithSub });
};
