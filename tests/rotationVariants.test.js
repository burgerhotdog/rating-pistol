import { describe, expect, it } from 'vitest';
import { WW } from '@/data';
import { initMember } from '@/utils';
import { buildCache } from '@/workers/simulation/cache';
import { computeDuration, createVariantDurationGetter } from '@/workers/simulation/duration';

describe('rotation variants', () => {
  it('inserts echo and tune-break actions only in the main rotation', () => {
    const member = initMember(WW, 1311);
    member.rotationInit = [...member.rotationAlt];
    const cache = buildCache({ gameId: WW, charId: member.id, team: [member] });
    const cachedMember = cache.member[member.id];

    expect(cachedMember.rotation.some((action) => action.type === 'echoSkill')).toBe(true);
    expect(cachedMember.rotation.some((action) => action.key === 'system:tuneBreak')).toBe(true);
    for (const rotation of [cachedMember.rotationAlt, cachedMember.rotationInit]) {
      expect(rotation.some((action) => action.type === 'echoSkill')).toBe(false);
      expect(rotation.some((action) => action.key === 'system:tuneBreak')).toBe(false);
    }

    expect(computeDuration(cache, { [member.id]: {} })).toBe(cachedMember.durationAlt);
    expect(cachedMember.durationAlt).not.toBe(cachedMember.duration);
  });

  it('sums the recorded rotations in a repeated-member order', () => {
    const cache = {
      gameId: WW,
      memberIds: [1, 2, 3],
      rotationOrder: [3, 2, 1, 2, 1],
      member: {
        1: { id: 1, duration: 10, durationAlt: 15 },
        2: { id: 2, duration: 20, durationAlt: 25 },
        3: { id: 3, duration: 30, durationAlt: 70 },
      },
    };
    const equipMaps = { 1: {}, 2: {}, 3: {} };

    expect(computeDuration(cache, equipMaps)).toBe(140);
    expect(createVariantDurationGetter(cache, equipMaps)(cache)).toBe(140);

    delete cache.member[3].durationAlt;
    expect(computeDuration(cache, equipMaps)).toBe(100);
  });
});
