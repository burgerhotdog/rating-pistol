// dynamic exports
import VERSION from "./dynamic/version.json";

import gi_avatars from "./dynamic/avatars/gi_avatars.json";
import hsr_avatars from "./dynamic/avatars/hsr_avatars.json";
import ww_avatars from "./dynamic/avatars/ww_avatars.json";
import zzz_avatars from "./dynamic/avatars/zzz_avatars.json";
const AVATARS = { gi: gi_avatars, hsr: hsr_avatars, ww: ww_avatars, zzz: zzz_avatars };

import gi_weapons from "./dynamic/weapons/gi_weapons.json";
import hsr_weapons from "./dynamic/weapons/hsr_weapons.json";
import ww_weapons from "./dynamic/weapons/ww_weapons.json";
import zzz_weapons from "./dynamic/weapons/zzz_weapons.json";
const WEAPONS = { gi: gi_weapons, hsr: hsr_weapons, ww: ww_weapons, zzz: zzz_weapons };

import gi_sets from "./dynamic/sets/gi_sets.json";
import hsr_sets from "./dynamic/sets/hsr_sets.json";
import ww_sets from "./dynamic/sets/ww_sets.json";
import zzz_sets from "./dynamic/sets/zzz_sets.json";
const SETS = { gi: gi_sets, hsr: hsr_sets, ww: ww_sets, zzz: zzz_sets };

// static exports
import gi_info from "./static/info/gi_info.json";
import hsr_info from "./static/info/hsr_info.json";
import ww_info from "./static/info/ww_info.json";
import zzz_info from "./static/info/zzz_info.json";
const INFO = { gi: gi_info, hsr: hsr_info, ww: ww_info, zzz: zzz_info };

import gi_stats from "./static/stats/gi_stats.json";
import hsr_stats from "./static/stats/hsr_stats.json";
import ww_stats from "./static/stats/ww_stats.json";
import zzz_stats from "./static/stats/zzz_stats.json";
const STATS = { gi: gi_stats, hsr: hsr_stats, ww: ww_stats, zzz: zzz_stats };

import gi_labels from "./static/labels/gi_labels.json";
import hsr_labels from "./static/labels/hsr_labels.json";
import ww_labels from "./static/labels/ww_labels.json";
import zzz_labels from "./static/labels/zzz_labels.json";
const LABELS = { gi: gi_labels, hsr: hsr_labels, ww: ww_labels, zzz: zzz_labels };

export { VERSION, AVATARS, WEAPONS, SETS, INFO, STATS, LABELS };
