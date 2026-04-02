import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { BuildContext } from '@/contexts';
import { CHARACTERS } from '@/data';

export function useCurrent() {
  const { gameId, characterId } = useParams();
  const builds = useContext(BuildContext).getBuilds(gameId);
  const build = builds[characterId];
  const data = CHARACTERS[gameId][characterId];
  const criteria = data?.criteria;
  return { gameId, characterId, builds, build, data, criteria };
}
