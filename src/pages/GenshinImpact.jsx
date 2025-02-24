import GamePage from "../components/G1amePage";
import GAME_DATA from "../components/gameData";

const charIcons = import.meta.glob("../assets/char/GI/*.webp", { eager: true });
const weapIcons = import.meta.glob("../assets/weap/GI/*.webp", { eager: true });
const setsIcons = import.meta.glob("../assets/sets/GI/*.webp", { eager: true });

const GenshinImpact = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="GI"
    gameData={GAME_DATA.GI}
    charIcons={charIcons}
    weapIcons={weapIcons}
    setsIcons={setsIcons}
  />
);

export default GenshinImpact;
