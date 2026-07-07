import { compileCache } from './cache';
import { runTrials } from './runTrials';

self.onmessage = ({ data }) => {
  const { gameId, characterId, team } = data;
  const cache = compileCache(gameId, team);

  const equipMaps = Object.fromEntries(
    team.map((member) => {
      // User build exists
      if ('build' in member) {
        const { equipMap } = cache.member[member.id];
        return [member.id, equipMap];
      }

      // User build doesn't exist
      self.postMessage({ status: `Generating trial build for ${member.id}` });

      const trialEquipMaps = Object.fromEntries(
        team.map(({ id }) => {
          const { equipMap } = cache.member[id];
          return [id, equipMap];
        })
      );

      return [member.id, runTrials(cache, trialEquipMaps, member.id)];
    })
  );

  self.postMessage({ status: 'Running simulation' });

  runTrials(cache, equipMaps, characterId, true);
};
