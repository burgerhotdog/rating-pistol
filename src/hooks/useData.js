import { useParams } from 'react-router-dom';
import { CHARACTER, WEAPON, SET, ECHO, ELEMENTS, TYPES } from '@/data';

export function useData(type) {
  const { gameId } = useParams();

  switch (type) {
    case 'character':
      return CHARACTER[gameId];
    case 'weapon':
      return WEAPON[gameId];
    case 'set':
      return SET[gameId];
    case 'echo':
      return ECHO;
    case 'element':
      return ELEMENTS[gameId];
    case 'type':
      return TYPES[gameId];
  }
}
