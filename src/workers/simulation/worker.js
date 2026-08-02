import { getTotals } from '@/utils';
import { createRunRotation } from './rotation';
import { compileCache } from './cache';
import { runTrials } from './runTrials';
import { getPrydwenBenchmark } from './otherBenchmarks';
import { getSubRollSums, getMainConfig } from './utils';

self.onmessage = ({ data }) => {
  const { gameId, charId, team } = data;
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

      const runRotation = createRunRotation(cache, trialEquipMaps, member.id);
      return [
        member.id,
        runTrials(cache, runRotation, member.id),
      ];
    })
  );

  self.postMessage({ status: 'Running simulation' });

  const runRotation = createRunRotation(cache, equipMaps, charId);
  const { trialBands, configMap } = runTrials(cache, runRotation, charId, true);

  const userSummary = runRotation(cache.member[charId].statMap);
  const userDps = cache.getDps(getTotals(userSummary).damage);
  const benchmarkDps = trialBands.at(-1).p50;
  const prydwenSummary = getPrydwenBenchmark(gameId, charId, cache.member[charId].baseMap, configMap, runRotation);
  const prydwenDps = cache.getDps(getTotals(prydwenSummary).damage);

  self.postMessage({
    trialBands,
    configMap,
    userSummary,
    userDps,
    benchmarkDps,
    prydwenDps,
    userConfigKey: getMainConfig(gameId, cache.member[charId].equipList),
    userSubStats: getSubRollSums(gameId, cache.member[charId].equipList),
  });
};
