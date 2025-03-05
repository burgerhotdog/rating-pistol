import GamePage from "../components/GamePage";
import getData from "../components/getData";

const gameIcons = {
  charIcons: import.meta.glob("../assets/WW/characters/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/WW/weapons/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/WW/sets/*.webp", { eager: true }),
};

const WutheringWaves = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="WW"
    gameData={getData("WW")}
    gameIcons={gameIcons}
  />
);

export default WutheringWaves;
