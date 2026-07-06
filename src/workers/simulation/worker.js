import { compileCache } from './cache';
import { runTrials } from './runTrials';

self.onmessage = ({ data }) => {
  const { gameId, characterId, team } = data;
  const cache = compileCache(gameId, team);

  const teamFilled = team.map((member) => {
    // User build exists
    if ('build' in member) {
      const { equipMap } = cache.member[member.id];
      return { id: member.id, equipMap };
    }

    self.postMessage({ status: `Generating trial build for ${member.id}` });

    const test = team.map((member) => ({
      id: member.id,
      equipMap: cache.member[member.id].equipMap,
    }));

    return {
      id: member.id,
      equipMap: runTrials(cache, member.id, test),
    };
  });

  self.postMessage({ status: 'Running simulation' });

  runTrials(cache, characterId, teamFilled, true);
};
