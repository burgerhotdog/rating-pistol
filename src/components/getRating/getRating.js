import rateAvatar from "./rateAvatar";
import rateWeapon from "./rateWeapon";
import rateEquipList from "./rateEquipList";
import rateSkillMap from "./rateSkillMap";

const getRating = (gameId, id, data) => {
  const avatar = rateAvatar(gameId, data);
  const weapon = rateWeapon(gameId, data);
  const equipList = rateEquipList(gameId, id, data);
  const skillMap = rateSkillMap(gameId, id, data);

  const combined = [avatar, weapon, equipList, skillMap].includes(-1)
    ? -1
    : 0.2 * avatar +
      0.2 * weapon +
      0.3 * equipList +
      0.3 * skillMap;

  const parts = [avatar, weapon, equipList, skillMap];

  return { combined, parts };
};

export default getRating;
