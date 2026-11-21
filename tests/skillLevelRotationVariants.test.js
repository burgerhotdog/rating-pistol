import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CHARACTER, GI, WW, ZZZ } from '@/data';
import { initMember } from '@/utils';
import { buildCache } from '@/workers/simulation/cache';
import { runRotation } from '@/workers/simulation/rotation';
import { benchmarkSkillLevels } from '@/workers/simulation/skill-level-tests';
import { rankTests } from '@/workers/simulation/rank-tests';

vi.mock('@/workers/simulation/rotation', () => ({
  runRotation: vi.fn(() => ({ snapshots: [{ damage: 100 }], bonusEnergy: {} })),
}));

function makeMember(gameId, id, skillId, actionRef) {
  const member = initMember(gameId, id);
  member.rank = 0;
  member.skillLevels[skillId] = 1;
  member.rotation = [actionRef];
  member.rotationAlt = [actionRef];
  member.rotationInit = [actionRef];
  return member;
}

function buildMemberCache(gameId, member) {
  return buildCache({ gameId, charId: member.id, team: [member] });
}

function expectUpdatedRotations(actual, original, expected, actionRef) {
  for (const key of ['rotation', 'rotationAlt', 'rotationInit']) {
    const compressed = (member) => member[key].find((action) => action.ref === actionRef).damage.compressed;
    expect(compressed(actual)).toEqual(compressed(expected));
    expect(compressed(actual)).not.toEqual(compressed(original));
  }
}

describe('skill-level updates across rotation variants', () => {
  beforeEach(() => vi.mocked(runRotation).mockClear());

  it('updates all variants for a skill-level benchmark without changing the source cache', () => {
    const member = makeMember(WW, 1311, 'normalAttack', 'normalAttack.2');
    const cache = buildMemberCache(WW, member);
    const original = structuredClone(cache);
    const upgraded = structuredClone(member);
    upgraded.skillLevels.normalAttack = 2;
    const expected = buildMemberCache(WW, upgraded);

    benchmarkSkillLevels(cache, { [member.id]: {} }, member.id, 1);

    const tested = vi.mocked(runRotation).mock.calls[0][0];
    expectUpdatedRotations(tested.member[member.id], original.member[member.id], expected.member[member.id], 'normalAttack.2');
    expect(cache).toEqual(original);
  });

  it('updates all variants when rank changes a skill level', () => {
    const member = makeMember(GI, 10000014, 'elementalSkill', 'elementalSkill.0');
    const cache = buildMemberCache(GI, member);
    const original = structuredClone(cache);
    const upgraded = structuredClone(member);
    upgraded.rank = 5;
    const expected = buildMemberCache(GI, upgraded);

    rankTests(cache, { [member.id]: {} }, member.id);

    const tested = vi.mocked(runRotation).mock.calls[5][0];
    expectUpdatedRotations(tested.member[member.id], original.member[member.id], expected.member[member.id], 'elementalSkill.0');
    expect(cache).toEqual(original);
  });

  it('updates Zenless variants when a skill has rankModify', () => {
    const skill = CHARACTER[ZZZ][1011].skills.basicAttack;
    skill.rankModify = 3;
    try {
      const member = makeMember(ZZZ, 1011, 'basicAttack', 'basicAttack.0');
      const cache = buildMemberCache(ZZZ, member);
      const upgraded = structuredClone(member);
      upgraded.rank = 3;
      const expected = buildMemberCache(ZZZ, upgraded);

      rankTests(cache, { [member.id]: {} }, member.id);

      const tested = vi.mocked(runRotation).mock.calls[3][0];
      expectUpdatedRotations(tested.member[member.id], cache.member[member.id], expected.member[member.id], 'basicAttack.0');
    } finally {
      delete skill.rankModify;
    }
  });
});
