import GamePage from "../components/GamePage";
import GAME_DATA from "../components/GAME_DATA";

const gameIcons = {
  charIcons: import.meta.glob("../assets/char/HSR/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/weap/HSR/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/sets/HSR/*.webp", { eager: true }),
};

const HonkaiStarRail = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="HSR"
    gameData={GAME_DATA.HSR}
    gameIcons={gameIcons}
  />
);

export default HonkaiStarRail;
