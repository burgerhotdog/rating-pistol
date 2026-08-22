import { useParams } from 'react-router-dom';
import { CHARACTER, WEAPON, SET, ECHO, ELEMENT, TYPE } from '@/data';

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
      return ELEMENT[gameId];
    case 'type':
      return TYPE[gameId];
  }
}
