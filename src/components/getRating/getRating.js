import rateLevels from "./rateLevels";
import rateSkills from "./rateSkills";
import rateEquips from "./rateEquips";
import letterSrc from "./letterSrc";

const getRating = (gameId, id, data) => {
  const levels = rateLevels(gameId, data);
  const skills = rateSkills(gameId, data);
  const equips = rateEquips(gameId, id, data);

  const combined = [levels, skills, equips].includes(-1)
    ? -1
    : 0.4 * levels +
      0.3 * skills +
      0.3 * equips;

  const letter = letterSrc(Math.round(combined));

  const parts = [levels, skills, equips];

  return { combined, letter, parts };
};

export default getRating;
