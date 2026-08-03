import { WW, CHARACTER } from '@/data';
import { toArray } from '@/utils';

export function cacheTuneResponses(memberCache) {
  let tuneStrainMaxStacks = 1;

  for (const [memberId, member] of Object.entries(memberCache)) {
    if (toArray(CHARACTER[WW][memberId].tagged).includes('tuneStrain')) {
      member.tuneStrainResponse = true;
      tuneStrainMaxStacks++;
    }
  }

  return tuneStrainMaxStacks;
}
