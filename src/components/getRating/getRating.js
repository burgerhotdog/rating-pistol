import rateAvatar from "./rateAvatar";
import rateWeapon from "./rateWeapon";
import rateEquipList from "./rateEquipList";
import rateSkillMap from "./rateSkillMap";

const getRating = (gameId, id, data) => {
  const avatar = rateAvatar(gameId, id, data);
  const weapon = rateWeapon(gameId, id, data);
  const equipList = rateEquipList(gameId, id, data);
  const skillMap = rateSkillMap(gameId, id, data);

  const final = Math.round(
    avatar === -1 ? -1 :
    weapon === -1 ? -1 :
    equipList === -1 ? -1 :
    skillMap === -1 ? -1 : (
      0.25 * avatar +
      0.25 * weapon +
      0.25 * equipList +
      0.25 * skillMap
    )
  );

  return { final, avatar, weapon, equipList, skillMap };
};

export default getRating;
