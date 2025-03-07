import rateAvatar from "./rateAvatar";
import rateWeapon from "./rateWeapon";
import rateEquipList from "./rateEquipList";
import rateSkillMap from "./rateSkillMap";

const getRating = (gameId, id, data) => {
  const [avatar, weapon, equipList, skillMap] = [
    rateAvatar(gameId, data),
    rateWeapon(gameId, data),
    rateEquipList(gameId, id, data),
    rateSkillMap(gameId, id, data),
  ];

  const final = [avatar, weapon, equipList, skillMap].includes(-1)
    ? -1
    : Math.round(
      0.2 * avatar +
      0.2 * weapon +
      0.3 * equipList +
      0.3 * skillMap);

  return { final, avatar, weapon, equipList, skillMap};
};

export default getRating;
