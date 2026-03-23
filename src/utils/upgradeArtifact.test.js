import { describe, it, expect } from 'vitest';
import { createArtifact, upgradeArtifact } from '@/utils';

it('should return a valid artifact 10 times', () => {
  for (let i = 0; i < 10; i++) {
    const [, mainStatId] = createArtifact('genshin-impact');
    const result = upgradeArtifact('genshin-impact', mainStatId);
    console.log(mainStatId, result);
    expect(result).toBeDefined();
  }
});