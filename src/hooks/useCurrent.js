import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBuild } from '@/contexts';
import { CHARACTERS } from '@/data';

export function useCurrent() {
  const { gameId, characterId } = useParams();

  const builds = useBuild().getBuilds(gameId);
  const build = builds[characterId];

  const data = CHARACTERS[gameId][characterId];
  const calcs = data?.calcs;

  return { gameId, characterId, builds, build, data, calcs };
}
