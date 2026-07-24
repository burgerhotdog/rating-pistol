import { WW, CHARACTER } from '@/data';
import { toArray } from '@/utils';

export function cacheTuneResponses(cache) {
  cache.tuneStrainMaxStacks = 1;

  for (const [memberId, memberCache] of Object.entries(cache.member)) {
    if (toArray(CHARACTER[WW][memberId].tagged).includes('tuneStrain')) {
      memberCache.tuneStrainResponse = true;
      cache.tuneStrainMaxStacks++;
    }
  }
}
