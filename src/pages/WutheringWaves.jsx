import GamePage from "../components/GamePage";
import GAME_DATA from "../components/GAME_DATA";

const gameIcons = {
  charIcons: import.meta.glob("../assets/char/WW/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/weap/WW/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/sets/WW/*.webp", { eager: true }),
};

const WutheringWaves = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="WW"
    gameData={GAME_DATA.WW}
    gameIcons={gameIcons}
  />
);

export default WutheringWaves;
