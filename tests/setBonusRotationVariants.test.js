import { expect, it, vi } from 'vitest';
import { WW } from '@/data';
import { initMember } from '@/utils';
import { buildCache } from '@/workers/simulation/cache';
import { runSetBonusTests } from '@/workers/simulation/lab-tests/runSetBonusTests';
import { runVariantDps } from '@/workers/simulation/lab-tests/variantDps';

vi.mock('@/workers/simulation/lab-tests/buildUsefulSetBonuses', () => ({
  buildUsefulSetBonuses: () => ({
    1: new Set(),
    2: new Set(),
    3: new Set(),
    5: new Set([36]),
  }),
}));

vi.mock('@/workers/simulation/lab-tests/variantDps', () => ({
  runVariantDps: vi.fn(() => 100),
}));

it('replaces echo actions only in the main rotation during set tests', () => {
  const member = initMember(WW, 1311);
  member.rotationInit = [...member.rotationAlt];
  const cache = buildCache({ gameId: WW, charId: member.id, team: [member] });
  const original = structuredClone(cache);

  runSetBonusTests(cache, { [member.id]: {} }, member.id, () => 1);

  const overrides = vi.mocked(runVariantDps).mock.calls.map((call) => call[3]);
  expect(overrides[0].rotation.some((action) => action.type === 'echoSkill')).toBe(false);
  expect(overrides.some(({ rotation }) => rotation.some((action) => action.type === 'echoSkill'))).toBe(true);

  for (const override of overrides) {
    const variant = { ...cache.member[member.id], ...override };
    expect(variant.rotation.filter((action) => action.type === 'echoSkill').length).toBeLessThanOrEqual(1);
    expect(variant.rotationAlt.some((action) => action.type === 'echoSkill')).toBe(false);
    expect(variant.rotationInit.some((action) => action.type === 'echoSkill')).toBe(false);
  }
  expect(cache).toEqual(original);
});
