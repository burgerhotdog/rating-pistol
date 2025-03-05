import GamePage from "../components/GamePage";
import getData from "../components/getData";

const gameIcons = {
  charIcons: import.meta.glob("../assets/ZZZ/characters/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/ZZZ/weapons/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/ZZZ/sets/*.webp", { eager: true }),
};

const ZenlessZoneZero = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="ZZZ"
    gameData={getData("ZZZ")}
    gameIcons={gameIcons}
  />
);

export default ZenlessZoneZero;
