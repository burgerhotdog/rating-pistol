import GamePage from "../components/GamePage";
import getData from "../components/getData";

const gameIcons = {
  charIcons: import.meta.glob("../assets/GI/characters/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/GI/weapons/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/GI/sets/*.webp", { eager: true }),
};

const GenshinImpact = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="GI"
    gameData={getData("GI")}
    gameIcons={gameIcons}
  />
);

export default GenshinImpact;
