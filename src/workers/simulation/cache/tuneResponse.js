import { WW, CHARACTER } from '@/data';
import { toArray } from '@/utils';

export function cacheTuneResponses(cache, actions) {
  cache.tuneStrainMaxStacks = 1;

  for (const [memberId, memberCache] of Object.entries(cache.member)) {
    for (const action of Object.values(actions[memberId])) {
      switch (action.skillType) {
        case 'tuneRuptureResponse':
          memberCache.tuneRuptureResponse = action;
          break;

        case 'hackResponse':
          memberCache.hackResponse = action;
          break;
      }
    }

    if (toArray(CHARACTER[WW][memberId].tagged).includes('tuneStrain')) {
      memberCache.tuneStrainResponse = true;
      cache.tuneStrainMaxStacks++;
    }
  }
}
