import { CHARACTER } from '@/data';

function testAltMembers(cache, equipMaps, charId, builds, userDps, memberId) {
  const result = [];

  for (const charData of Object.values(CHARACTER[cache.gameId])) {
    if (charData.id === memberId) {
      result.push({ id: charData.id, name: charData.name, dps: userDps });
      continue;
    }
    if (charData.id === charId) continue;
    if (!Object.hasOwn(builds, charData.id)) continue;

    // figure out how to do this
    const dps = 1;

    result.push({ id: charData.id, name: charData.name, dps });
  }

  return result;
}

export function memberTests(rawMemberIds, cache, equipMaps, charId, builds, userDps) {
  const memberResults = [];

  for (const memberId of rawMemberIds) {
    if (memberId === charId) {
      memberResults.push(null);
      continue;
    }

    const result = testAltMembers(cache, equipMaps, charId, builds, userDps, memberId);
    memberResults.push(result);
  }

  return memberResults;
}
