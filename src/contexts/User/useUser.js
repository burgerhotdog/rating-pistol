import { useContext } from 'react';
import { UserContext } from '@/contexts';

export function useUser() {
  return useContext(UserContext);
}
