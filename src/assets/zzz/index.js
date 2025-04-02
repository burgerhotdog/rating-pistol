import AVATAR_IMGS from "./avatars";
import WEAPON_IMGS from "./weapons";
import SET_IMGS from "./sets";
import EQUIP_IMGS from "./equip";

const other = import.meta.glob("./*.webp", { eager: true });

export default { AVATAR_IMGS, WEAPON_IMGS, SET_IMGS, EQUIP_IMGS, other };
