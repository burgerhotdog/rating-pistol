import { MISC } from '@/data';
import { mergeEquipList, sumRotationDmg } from '@/utils';
import { compileCache } from './cache';
import { runTrials } from './trials';
import { evaluateRotation } from './rotation';

const getAvgStatMap = (trials) => {
  const avgStatMap = {};

  for (const trial of trials) {
    const merged = mergeEquipList(trial.equipList);

    for (const stat in merged) {
      avgStatMap[stat] ??= 0;
      avgStatMap[stat] += merged[stat] / trials.length;
    }
  }

  return avgStatMap;
};

self.onmessage = ({ data }) => {
  const { gameId, characterId, team: rawTeam } = data;
  const team = rawTeam.filter(member => member.id);
  const cache = compileCache(gameId, team);
  const trialMaps = {};

  self.postMessage({
    type: 'progress',
    statusMessage: 'Calibrating teammates',
    currentMember: null,
    completed: 0,
  });

  for (let ti = team.length - 1; ti >= 0; ti--) {
    const member = team[ti];
    if (member.build) continue;

    self.postMessage({
      type: 'progress',
      currentMember: member.id,
      completed: 0,
      diff: null,
    });

    const test = team.map(member => ({ ...member, equipMap: cache.member[member.id].equipMap }));
    const { trials } = runTrials(cache, member.id, test);
    trialMaps[member.id] = getAvgStatMap(trials);
  }

  // Run farming simulation for current character
  self.postMessage({
    type: 'progress',
    statusMessage: 'Running simulation',
    currentMember: characterId,
    completed: 0,
    diff: null,
  });

  const trialsTeam = team.map(member => {
    if (member.build) return { ...member, equipMap: cache.member[member.id].equipMap };
    return { ...member, equipMap: trialMaps[member.id] };
  });

  const {
    trials,
    preferredMainStats,
    benchmarkWeek,
    weeklyScores,
    compiledRotation,
  } = runTrials(cache, characterId, trialsTeam);

  const finalStats = getAvgStatMap(trials);

  // Per-week score percentiles for distribution bands
  const weeklyDistribution = [];
  for (let week = 0; week <= benchmarkWeek; week++) {
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
  const actionMap = evaluateRotation(compiledRotation, cache.member[characterId].statMap);
  const actionMapsWithSub = {};

  for (const [statId, { VALUE }] of Object.entries(MISC[gameId].SUB_STAT_TYPES)) {
    const adjustedStatMap = { ...cache.member[characterId].statMap };
    adjustedStatMap[statId] ??= 0;
    adjustedStatMap[statId] += VALUE;

    actionMapsWithSub[statId] = evaluateRotation(compiledRotation, adjustedStatMap);
  }

  self.postMessage({
    type: 'done',
    completed: benchmarkWeek,
    weeklyScores,
    finalStats,
    preferredMainStats,
    weeklyDistribution,
    actionMap,
    actionMapsWithSub,
    cache,
  });
};
