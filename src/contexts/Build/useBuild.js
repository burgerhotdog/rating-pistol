import { useContext } from 'react';
import { BuildContext } from '@/contexts';

export function useBuild() {
  return useContext(BuildContext);
}
