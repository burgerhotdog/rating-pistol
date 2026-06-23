import { MISC } from '@/data';
import { compileCache } from './cache';
import { runTrials } from './runTrials';

self.onmessage = ({ data }) => {
  const { gameId, characterId, team: rawTeam } = data;
  const team = rawTeam.filter(member => member.id);
  const cache = compileCache(gameId, team);
  const trialMaps = {};

  // Create trial builds for teammates if empty build
  for (let ti = team.length - 1; ti >= 0; ti--) {
    const member = team[ti];
    if (member.build) continue;

    self.postMessage({ type: 'progress', statusMessage: 'Creating trial builds' });

    const test = team.map(member => ({ ...member, equipMap: cache.member[member.id].equipMap }));
    const { finalStatMap } = runTrials(cache, member.id, test);
    trialMaps[member.id] = finalStatMap;
  }

  self.postMessage({ type: 'progress', statusMessage: 'Running simulation' });

  const trialsTeam = team.map(member => {
    if (member.build) return { ...member, equipMap: cache.member[member.id].equipMap };
    return { ...member, equipMap: trialMaps[member.id] };
  });

  const { finalStatMap, weeklyDistribution, weeklySummaries, simulateRotation } = runTrials(cache, characterId, trialsTeam, true);

  // Build actionMap using the character's actual equipped build (same as what
  // normalizeTeam returned for the character — m.build is the top-level build).
  const userSummary = simulateRotation(cache.member[characterId].statMap);
  const actionMapsWithSub = {};

  for (const [statId, { VALUE }] of Object.entries(MISC[gameId].SUB_STAT_TYPES)) {
    const adjustedStatMap = { ...cache.member[characterId].statMap };
    adjustedStatMap[statId] ??= 0;
    adjustedStatMap[statId] += VALUE;

    actionMapsWithSub[statId] = simulateRotation(adjustedStatMap);
  }

  self.postMessage({
    type: 'done',
    cache,
    finalStatMap,
    weeklyDistribution,
    weeklySummaries,
    userSummary,
    actionMapsWithSub,
  });
};
