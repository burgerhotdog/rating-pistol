import { useData } from './useData';
import { usePageParams } from './usePageParams';

export function useAccent() {
  const { charId } = usePageParams();
  const { element } = useData('character')[charId];
  const { color } = useData('element')[element];

  return color;
}
