import GamePage from "../components/GamePage";
import GAME_DATA from "../components/gameData";

const charIcons = import.meta.glob("../assets/char/WW/*.webp", { eager: true });
const weapIcons = import.meta.glob("../assets/weap/WW/*.webp", { eager: true });
const setsIcons = import.meta.glob("../assets/sets/WW/*.webp", { eager: true });

const WutheringWaves = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="WW"
    gameData={GAME_DATA.WW}
    charIcons={charIcons}
    weapIcons={weapIcons}
    setsIcons={setsIcons}
  />
);

export default WutheringWaves;
