import { useParams } from 'react-router-dom';

export function usePageParams() {
  const { gameId, charId } = useParams();

  return {
    gameId,
    charId: charId ? Number(charId) : undefined,
  };
}
