import GamePage from "../components/GamePage";
import getData from "../components/getData";

const gameIcons = {
  charIcons: import.meta.glob("../assets/HSR/characters/*.webp", { eager: true }),
  weapIcons: import.meta.glob("../assets/HSR/weapons/*.webp", { eager: true }),
  setsIcons: import.meta.glob("../assets/HSR/sets/*.webp", { eager: true }),
};

const HonkaiStarRail = ({ uid }) => (
  <GamePage
    uid={uid}
    gameType="HSR"
    gameData={getData("HSR")}
    gameIcons={gameIcons}
  />
);

export default HonkaiStarRail;
