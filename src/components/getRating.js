import getRatingGear from "./getRatingGear";

const getRating = (gameType, gameData, id, data) => {
  const character = 0;
  const weapon = 0;
  const gear = getRatingGear(gameType, gameData, id, data);
  const skills = 0;  

  const final = (
    character === -1 ? -1 : 
    weapon === -1 ? -1 :
    gear === -1 ? -1 :
    skills === -1 ? -1 :
    (character + weapon + gear + skills) / 4
  );

  return { final, character, weapon, gear, skills };
};

export default getRating;
