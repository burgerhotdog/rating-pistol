import { compileCache } from './cache';
import { runTrials } from './runTrials';

self.onmessage = ({ data }) => {
  const { gameId, characterId, team } = data;
  const cache = compileCache(gameId, team);

  self.postMessage({
    type: 'progress',
    statusMessage: 'Creating trial builds',
  });

  const teamFilled = team.map((member) => {
    if ('build' in member) {
      return {
        ...member,
        equipMap: cache.member[member.id].equipMap,
      };
    }

    const test = team.map((member) => ({
      ...member,
      equipMap: cache.member[member.id].equipMap,
    }));

    return {
      ...member,
      equipMap: runTrials(cache, member.id, test),
    };
  });

  self.postMessage({
    type: 'progress',
    statusMessage: 'Running simulation',
  });

  runTrials(cache, characterId, teamFilled, true);
};
