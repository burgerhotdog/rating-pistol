import getEquipRatings from "@utils/getEquipRatings";
import getAvatarRating from "@utils/getAvatarRating";

const getRatings = (gameId, avatarId, equipList) => {
  const equips = getEquipRatings(gameId, avatarId, equipList);
  const avatar = getAvatarRating(gameId, equips);
  return { avatar, equips };
};

export default getRatings;
