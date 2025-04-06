import AVATAR_IMGS from "./avatars";
import WEAPON_IMGS from "./weapons";
import SET_IMGS from "./sets";
import EQUIP_IMGS from "./equip";
import SKILL_IMGS from "./skill";
import STAT_IMGS from "./stat";

const other = import.meta.glob("./*.webp", { eager: true });

export default { AVATAR_IMGS, WEAPON_IMGS, SET_IMGS, EQUIP_IMGS, SKILL_IMGS, STAT_IMGS, other };
