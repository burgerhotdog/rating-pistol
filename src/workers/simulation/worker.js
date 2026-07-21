import { compileCache } from './cache';
import { createGetDefMult, createGetResMult } from './rotation/formula';
import { runTrials } from './runTrials';

const compileHelpers = (gameId) => ({
  getDefMult: createGetDefMult(gameId),
  getResMult: createGetResMult(gameId),
});

self.onmessage = ({ data }) => {
  const { gameId, characterId, team } = data;
  const helpers = compileHelpers(gameId);
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

      return [member.id, runTrials(helpers, cache, trialEquipMaps, member.id)];
    })
  );

  self.postMessage({ status: 'Running simulation' });

  runTrials(helpers, cache, equipMaps, characterId, true);
};
