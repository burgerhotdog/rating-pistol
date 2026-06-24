import { compileCache } from './cache';
import { runTrials } from './runTrials';

self.onmessage = ({ data }) => {
  const { gameId, characterId, team: rawTeam } = data;
  const team = rawTeam.filter(member => member.id);
  const cache = compileCache(gameId, team);
  const trialMaps = {};

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

  runTrials(cache, characterId, trialsTeam, true);
};
