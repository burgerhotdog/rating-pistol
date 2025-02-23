import GamePage from "../components/GamePage";
import GAME_DATA from "../components/gameData";

const charIcons = import.meta.glob("../assets/char/HSR/*.webp", { eager: true });
const weapIcons = import.meta.glob("../assets/weap/HSR/*.webp", { eager: true });
const setsIcons = import.meta.glob("../assets/sets/HSR/*.webp", { eager: true });

const HonkaiStarRail = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="HSR"
    gameData={GAME_DATA.HSR}
    charIcons={charIcons}
    weapIcons={weapIcons}
    setsIcons={setsIcons}
  />
);

export default HonkaiStarRail;
