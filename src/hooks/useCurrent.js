import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { BuildContext } from '@/contexts';
import { CHARACTERS } from '@/lookups';

export function useCurrent() {
  const { gameId, characterId } = useParams();
  const builds = useContext(BuildContext).getBuilds(gameId);
  const build = builds[characterId];
  const data = CHARACTERS[gameId][characterId];
  const criteria = data?.CRITERIA;
  return { gameId, characterId, builds, build, data, criteria };
}
