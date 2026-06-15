import { evaluateRotation } from './rotation/compile';
import { getPenalty } from './penalty';

export function createTrial(cache, characterId, matchMap, compiledRotation) {
  return {
    equipList: new Array(cache.data.misc.NUM_MAINSTATS).fill(null),
    penalty: getPenalty(cache.baseMap[characterId], matchMap),
    scores: [evaluateRotation(compiledRotation, cache, cache.baseMap[characterId])],
  };
}
