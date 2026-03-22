import { describe, it, expect } from 'vitest';
import { createArtifact } from './createArtifact';

it('should return a valid artifact 100 times', () => {
  for (let i = 0; i < 100; i++) {
    const result = createArtifact('genshin-impact');
    console.log(result);
    expect(result).toBeDefined();
  }
});