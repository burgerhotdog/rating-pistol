import { useParams } from 'react-router-dom';
import { CHARACTER, WEAPON, SET } from '@/data';

export function useCharData(id) {
  const { gameId, charId } = useParams();
  const charData = CHARACTER[gameId];

  if (!id) return charData;

  const lookupId = id === '$curr' ? charId : id;
  return charData[lookupId];
}

export function useWeapData(id) {
  const { gameId } = useParams();
  const weapData = WEAPON[gameId];

  if (!id) return weapData;

  return weapData[id];
}

export function useSetData(id) {
  const { gameId } = useParams();
  const setData = SET[gameId];

  if (!id) return setData;

  return setData[id];
}
