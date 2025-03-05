import GamePage from "../components/GamePage";
import GAME_DATA from "../components/gameData";

const gameIcons = {
  charIcons: import.meta.glob("../assets/char/GI/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/weap/GI/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/sets/GI/*.webp", { eager: true }),
};

const GenshinImpact = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="GI"
    gameData={GAME_DATA.GI}
    gameIcons={gameIcons}
  />
);

export default GenshinImpact;
