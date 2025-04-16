// dynamic exports
export { default as VERSION_DATA } from "./dynamic/version.json";

import gi_avatar from "./dynamic/avatar/gi_avatar.json";
import hsr_avatar from "./dynamic/avatar/hsr_avatar.json";
import ww_avatar from "./dynamic/avatar/ww_avatar.json";
import zzz_avatar from "./dynamic/avatar/zzz_avatar.json";
export const AVATAR_DATA = { gi: gi_avatar, hsr: hsr_avatar, ww: ww_avatar, zzz: zzz_avatar };

import gi_weapon from "./dynamic/weapon/gi_weapon.json";
import hsr_weapon from "./dynamic/weapon/hsr_weapon.json";
import ww_weapon from "./dynamic/weapon/ww_weapon.json";
import zzz_weapon from "./dynamic/weapon/zzz_weapon.json";
export const WEAPON_DATA = { gi: gi_weapon, hsr: hsr_weapon, ww: ww_weapon, zzz: zzz_weapon };

import gi_set from "./dynamic/set/gi_set.json";
import hsr_set from "./dynamic/set/hsr_set.json";
import ww_set from "./dynamic/set/ww_set.json";
import zzz_set from "./dynamic/set/zzz_set.json";
export const SET_DATA = { gi: gi_set, hsr: hsr_set, ww: ww_set, zzz: zzz_set };

// static exports
import gi_info from "./static/info/gi_info.json";
import hsr_info from "./static/info/hsr_info.json";
import ww_info from "./static/info/ww_info.json";
import zzz_info from "./static/info/zzz_info.json";
export const INFO_DATA = { gi: gi_info, hsr: hsr_info, ww: ww_info, zzz: zzz_info };

import gi_stat from "./static/stat/gi_stat.json";
import hsr_stat from "./static/stat/hsr_stat.json";
import ww_stat from "./static/stat/ww_stat.json";
import zzz_stat from "./static/stat/zzz_stat.json";
export const STAT_DATA = { gi: gi_stat, hsr: hsr_stat, ww: ww_stat, zzz: zzz_stat };

import gi_label from "./static/label/gi_label.json";
import hsr_label from "./static/label/hsr_label.json";
import ww_label from "./static/label/ww_label.json";
import zzz_label from "./static/label/zzz_label.json";
export const LABEL_DATA = { gi: gi_label, hsr: hsr_label, ww: ww_label, zzz: zzz_label };
