import { useParams } from 'react-router-dom';
import { useData } from './useData';

export function useAccent() {
  const { charId } = useParams();
  const { element } = useData('character')[charId];
  const { color } = useData('element')[element];

  return color;
}
