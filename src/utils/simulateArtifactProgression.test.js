import { describe, it, expect } from 'vitest';
import { simulateArtifactProgresion } from '@/utils';

it('should simulate artifact progression for 20 weeks', () => {
  const result = simulateArtifactProgresion('genshin-impact', '10000075', { weaponId: '14512' });
  for (const [dmg, { equipList }] of result) {
    console.log(dmg);
  }
  expect(result).toBeDefined();
});
