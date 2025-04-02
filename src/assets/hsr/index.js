import AVATAR_IMGS from "./avatars";
import WEAPON_IMGS from "./weapons";
import SET_IMGS from "./sets";
import EQUIP_IMGS from "./equip";
import STAT_IMGS from "./stat";
import SKILL_IMGS from "./skill"
import PATH_IMGS from "./paths";

const other = import.meta.glob("./*.webp", { eager: true });

export default { AVATAR_IMGS, WEAPON_IMGS, SET_IMGS, EQUIP_IMGS, STAT_IMGS, SKILL_IMGS, PATH_IMGS, other };
