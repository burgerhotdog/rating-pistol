import rateLevels from "./rateLevels";
import rateSkills from "./rateSkills";
import rateEquips from "./rateEquips";

const getRating = (gameId, id, data) => {
  const levels = rateLevels(gameId, data);
  const skills = rateSkills(gameId, data);
  const equips = rateEquips(gameId, id, data);

  const combined = [levels, skills, equips].includes(-1)
    ? -1
    : 0.4 * levels +
      0.3 * skills +
      0.3 * equips;

  const parts = [levels, skills, equips];

  return { combined, parts };
};

export default getRating;
