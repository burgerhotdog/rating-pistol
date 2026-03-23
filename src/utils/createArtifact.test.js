import { describe, it, expect } from 'vitest';
import { createArtifact } from '@/utils';

it('should return a valid artifact 10 times', () => {
  for (let i = 0; i < 10; i++) {
    const result = createArtifact('genshin-impact');
    console.log(result);
    expect(result).toBeDefined();
  }
});