import rateCharacter from "./rateCharacter";
import rateWeapon from "./rateWeapon";
import rateGear from "./rateGear";
import rateSkills from "./rateSkills";

const getRating = (gameType, gameData, id, data) => {
  const character = rateCharacter(gameType, gameData, id, data);
  const weapon = rateWeapon(gameType, gameData, id, data);
  const gear = rateGear(gameType, gameData, id, data);
  const skills = rateSkills(gameType, gameData, id, data);

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
