import GamePage from "../components/GamePage";
import GAME_DATA from "../components/GAME_DATA";

const gameIcons = {
  charIcons: import.meta.glob("../assets/char/ZZZ/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/weap/ZZZ/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/sets/ZZZ/*.webp", { eager: true }),
};

const ZenlessZoneZero = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="ZZZ"
    gameData={GAME_DATA.ZZZ}
    gameIcons={gameIcons}
  />
);

export default ZenlessZoneZero;
