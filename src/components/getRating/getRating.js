import rateCharacter from "./rateCharacter";
import rateWeapon from "./rateWeapon";
import rateGear from "./rateGear";
import rateSkills from "./rateSkills";

const getRating = (gameId, id, data) => {
  const character = rateCharacter(gameId, id, data);
  const weapon = rateWeapon(gameId, id, data);
  const gear = rateGear(gameId, id, data);
  const skills = rateSkills(gameId, id, data);

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
