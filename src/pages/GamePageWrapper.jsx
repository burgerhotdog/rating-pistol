import { useParams } from "react-router-dom";
import { GamePage } from "./GamePage"

export const GamePageWrapper = () => {
  const { gameId, characterId } = useParams();

  return (
    <GamePage
      key={gameId}
      gameId={gameId}
      characterId={characterId}
    />
  );
};
