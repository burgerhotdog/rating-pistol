import AVATAR_DATA from "./AVATAR_DATA";
import WEAPON_DATA from "./WEAPON_DATA";
import SET_DATA from "./SET_DATA";

const TITLE = "Genshin Impact";
const VERSION = "5.5";
const HEADERS = { avatar: "Character", weapon: "Weapon", equips: "Artifacts", skills: "Talents" };
const SKILL_CAPS = [10, 10, 10];
const EQUIP_NAMES = ["Flower", "Plume", "Sands", "Goblet", "Circlet"];
const STAT_INDEX = {
  "_HP": {
    name: "HP",
    percent: false,
    index: [0],
    value: 298.75,
  },
  "_ATK": {
    name: "ATK",
    percent: false,
    index: [1],
    value: 19.45,
  },
  "_DEF": {
    name: "DEF",
    percent: false,
    value: 23.15,
  },
  "HP": {
    name: "HP%",
    percent: true,
    index: [2, 3, 4],
    value: 5.83,
  },
  "ATK": {
    name: "ATK%",
    percent: true,
    index: [2, 3, 4],
    value: 5.83,
  },
  "DEF": {
    name: "DEF%",
    percent: true,
    index: [2, 3, 4],
    value: 7.29,
  },
  "EM": {
    name: "Elemental Mastery",
    percent: false,
    index: [2, 3, 4],
    value: 23.31,
  },
  "ER": {
    name: "Energy Recharge",
    percent: true,
    index: [2],
    value: 6.48,
  },
  "ANEMO": {
    name: "Anemo DMG Bonus",
    percent: true,
    index: [3],
  },
  "CRYO": {
    name: "Cryo DMG Bonus",
    percent: true,
    index: [3],
  },
  "DENDRO": {
    name: "Dendro DMG Bonus",
    percent: true,
    index: [3],
  },
  "ELECTRO": {
    name: "Electro DMG Bonus",
    percent: true,
    index: [3],
  },
  "GEO": {
    name: "Geo DMG Bonus",
    percent: true,
    index: [3],
  },
  "HYDRO": {
    name: "Hydro DMG Bonus",
    percent: true,
    index: [3],
  },
  "PYRO": {
    name: "Pyro DMG Bonus",
    percent: true,
    index: [3],
  },
  "PHYSICAL": {
    name: "Physical DMG Bonus",
    percent: true,
    index: [3],
  },
  "CR": {
    name: "CRIT Rate",
    percent: true,
    index: [4],
    value: 3.89,
  },
  "CD": {
    name: "CRIT DMG",
    percent: true,
    index: [4],
    value: 7.77,
  },
  "HB": {
    name: "Healing Bonus",
    percent: true,
    index: [4],
  },
};

export default {
  TITLE,
  VERSION,
  HEADERS,
  LEVEL_CAP: 90,
  AVATAR_DATA,
  PREFIX: "C",
  SKILL_CAPS,
  WEAPON_DATA,
  WEAPON_PREFIX: "R",
  SET_DATA,
  EQUIP_NAMES,
  MAINSTAT_OPTIONS,
  SUBSTAT_OPTIONS,
  STAT_INDEX,
};
