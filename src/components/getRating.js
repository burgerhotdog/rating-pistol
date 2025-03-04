import getRatingCharacter from "./getRatingCharacter";
import getRatingWeapon from "./getRatingWeapon";
import getRatingGear from "./getRatingGear";
import getRatingSkills from "./getRatingSkills";

const getRating = (gameType, gameData, id, data) => {
  const character = getRatingCharacter(gameType, gameData, id, data);
  const weapon = getRatingWeapon(gameType, gameData, id, data);
  const gear = getRatingGear(gameType, gameData, id, data);
  const skills = getRatingSkills(gameType, gameData, id, data);

  const final = Math.round(
    character === -1 ? -1 :
    weapon === -1 ? -1 :
    gear === -1 ? -1 :
    skills === -1 ? -1 : (
      0.25 * character +
      0.25 * weapon +
      0.25 * gear +
      0.25 * skills
    )
  );

  return { final, character, weapon, gear, skills };
};

export default getRating;
