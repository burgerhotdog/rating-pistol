import { describe, it, expect } from 'vitest';
import { simulateArtifactProgression } from '@/utils';

it('should simulate artifact progression for 20 weeks', () => {
  const result = simulateArtifactProgression('genshin-impact', ['10000075', { weaponId: '14512' }]);
  expect(result.weeklyDamages).toBeDefined();
  expect(result.weeklyDamages).toHaveLength(21);
  expect(result.finalBuild).toBeDefined();
  for (const dmg of result.weeklyDamages) {
    console.log(dmg);
  }
});
