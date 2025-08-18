// dynamic exports
export { default as VERSION_DATA } from './dynamic/version';

import gi_avatar from './dynamic/avatar/gi_avatar';
import hsr_avatar from './dynamic/avatar/hsr_avatar';
import ww_avatar from './dynamic/avatar/ww_avatar';
import zzz_avatar from './dynamic/avatar/zzz_avatar';
export const AVATAR_DATA = { gi: gi_avatar, hsr: hsr_avatar, ww: ww_avatar, zzz: zzz_avatar };

import gi_weapon from './dynamic/weapon/gi_weapon';
import hsr_weapon from './dynamic/weapon/hsr_weapon';
import ww_weapon from './dynamic/weapon/ww_weapon';
import zzz_weapon from './dynamic/weapon/zzz_weapon';
export const WEAPON_DATA = { gi: gi_weapon, hsr: hsr_weapon, ww: ww_weapon, zzz: zzz_weapon };

// static exports
import gi_info from './static/info/gi_info';
import hsr_info from './static/info/hsr_info';
import ww_info from './static/info/ww_info';
import zzz_info from './static/info/zzz_info';
export const INFO_DATA = { gi: gi_info, hsr: hsr_info, ww: ww_info, zzz: zzz_info };

import gi_stat from './static/stat/gi_stat';
import hsr_stat from './static/stat/hsr_stat';
import ww_stat from './static/stat/ww_stat';
import zzz_stat from './static/stat/zzz_stat';
export const STAT_DATA = { gi: gi_stat, hsr: hsr_stat, ww: ww_stat, zzz: zzz_stat };
