import GamePage from "../components/GamePage";
import GAME_DATA from "../components/gameData";

const charIcons = import.meta.glob("../assets/char/ZZZ/*.webp", { eager: true });
const weapIcons = import.meta.glob("../assets/weap/ZZZ/*.webp", { eager: true });
const setsIcons = import.meta.glob("../assets/sets/ZZZ/*.webp", { eager: true });

const ZenlessZoneZero = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="ZZZ"
    gameData={GAME_DATA.ZZZ}
    charIcons={charIcons}
    weapIcons={weapIcons}
    setsIcons={setsIcons}
  />
);

export default ZenlessZoneZero;
