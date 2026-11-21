import { describe, expect, it } from 'vitest';
import { CHARACTER, GI, WW } from '@/data';
import { initMember } from '@/utils';
import { buildCache } from '@/workers/simulation/cache';
import { getRotationOrder } from '@/workers/simulation/rotation-order';
import { memberTests } from '@/workers/simulation/member-tests';

describe('memberTests', () => {
  it.each([
    [GI, [10000002, 10000003, 10000014], 10000006],
    [WW, [1304, 1102, 1103], 1202],
  ])('simulates saved replacements with a fresh %s team cache', (gameId, ids, replacementId) => {
    const [charId, replacedId, otherId] = ids;
    const team = [...ids.map((id) => initMember(gameId, id)), initMember(gameId)];
    const originalTeam = structuredClone(team);
    const rawCache = buildCache({ gameId, charId, team });
    const equipMaps = Object.fromEntries(ids.map((id) => [id, {}]));
    const baseline = getRotationOrder(rawCache, equipMaps);
    const cache = {
      ...rawCache,
      ...(baseline.rotationOrder.length === 5
        ? { rotationOrder: baseline.rotationOrder }
        : { memberIds: baseline.rotationOrder }),
    };
    const originalCache = structuredClone(cache);
    const originalEquipMaps = structuredClone(equipMaps);
    const build = { equipList: [{ mainstatId: 'atk', mainstatValue: 2000 }] };
    const builds = {
      [replacementId]: build,
      [otherId]: { equipList: [] },
    };

    const results = memberTests(team, cache, equipMaps, charId, builds, baseline.dps);
    const replacement = initMember(gameId, replacementId, build);
    const testTeam = team.map((member) => member.id === replacedId ? replacement : member);
    const testCache = buildCache({ gameId, charId, team: testTeam });
    const testEquipMaps = { ...equipMaps, [replacementId]: testCache.member[replacementId].equipMap };
    const expectedDps = getRotationOrder(testCache, testEquipMaps).dps;
    const blankDps = getRotationOrder(testCache, { ...testEquipMaps, [replacementId]: {} }).dps;

    expect(results).toHaveLength(ids.length);
    expect(results[0]).toBeNull();
    expect(results[1]).toContainEqual({
      id: replacedId,
      name: CHARACTER[gameId][replacedId].name,
      dps: baseline.dps,
    });
    expect(results[1]).toContainEqual({
      id: replacementId,
      name: CHARACTER[gameId][replacementId].name,
      dps: expectedDps,
    });
    expect(results[1].some(({ id }) => id === otherId || id === charId)).toBe(false);
    expect(expectedDps).toBeGreaterThan(0);
    expect(expectedDps).not.toBeCloseTo(blankDps);
    expect(team).toEqual(originalTeam);
    expect(cache).toEqual(originalCache);
    expect(equipMaps).toEqual(originalEquipMaps);
  });

  it('omits saved builds that cannot be simulated', () => {
    const ids = [10000002, 10000003, 10000014];
    const team = ids.map((id) => initMember(GI, id));
    const cache = buildCache({ gameId: GI, charId: ids[0], team });
    const equipMaps = Object.fromEntries(ids.map((id) => [id, {}]));
    const baseline = getRotationOrder(cache, equipMaps);
    const disabled = Object.values(CHARACTER[GI]).find((character) => character.disabled);
    const builds = {
      [disabled.id]: { equipList: [] },
      10000006: { weaponId: -1, equipList: [] },
      10000015: {},
    };

    const results = memberTests(team, cache, equipMaps, ids[0], builds, baseline.dps);

    expect(results[1]).toEqual([{
      id: ids[1],
      name: CHARACTER[GI][ids[1]].name,
      dps: baseline.dps,
    }]);
  });
});
