import AVATAR_DATA from "./AVATAR_DATA";
import WEAPON_DATA from "./WEAPON_DATA";
import SET_DATA from "./SET_DATA";

const TITLE = "Honkai Star Rail";
const VERSION = "3.1";
const HEADERS = { avatar: "Character", weapon: "Light Cone", equips: "Relics", skills: "Traces" };
const SKILL_CAPS = [6, 10, 10, 10, 6, 6];
const EQUIP_NAMES = ["Head", "Hands", "Body", "Feet", "Orb", "Rope"];
const STAT_INDEX = {
  "_HP": {
    name: "HP",
    percent: false,
    index: [0],
    value: 42.34,
  },
  "_ATK": {
    name: "ATK",
    percent: false,
    index: [1],
    value: 21.17,
  },
  "_DEF": {
    name: "DEF",
    percent: false,
    value: 21.17,
  },
  "HP": {
    name: "HP%",
    percent: true,
    index: [2, 3, 4, 5],
    value: 4.32,
  },
  "ATK": {
    name: "ATK%",
    percent: true,
    index: [2, 3, 4, 5],
    value: 4.32,
  },
  "DEF": {
    name: "DEF%",
    percent: true,
    index: [2, 3, 4, 5],
    value: 5.4,
  },
  "CR": {
    name: "CRIT Rate",
    percent: true,
    index: [2],
    value: 3.24,
  },
  "CD": {
    name: "CRIT DMG",
    percent: true,
    index: [2],
    value: 6.48,
  },
  "EHR": {
    name: "Effect Hit Rate",
    percent: true,
    index: [2],
    value: 4.32,
  },
  "OHB": {
    name: "Outgoing Healing Boost",
    index: [2],
  },
  "SPD": {
    name: "SPD",
    percent: false,
    index: [3],
    value: 2.6,
  },
  "FIRE": {
    name: "Fire DMG Bonus",
    index: [4],
  },
  "ICE": {
    name: "Ice DMG Bonus",
    index: [4],
  },
  "IMAGINARY": {
    name: "Imaginary DMG Bonus",
    index: [4],
  },
  "LIGHTNING": {
    name: "Lightning DMG Bonus",
    index: [4],
  },
  "PHYSICAL": {
    name: "Physical DMG Bonus",
    index: [4],
  },
  "QUANTUM": {
    name: "Quantum DMG Bonus",
    index: [4],
  },
  "WIND": {
    name: "Wind DMG Bonus",
    index: [4],
  },
  "BE": {
    name: "Break Effect",
    percent: true,
    index: [5],
    value: 6.48,
  },
  "ERR": {
    name: "Energy Regeneration Rate",
    index: [5],
  },
  "RES": {
    name: "Effect RES",
    percent: true,
    value: 4.32,
  },
};

export default {
  AVATAR_DATA,
  WEAPON_DATA,
  SET_DATA,
  TITLE,
  VERSION,
  HEADERS,
  SKILL_CAPS,
  EQUIP_NAMES,
  STAT_INDEX,
  LEVEL_CAP: 80,
  PREFIX: "E",
  WEAPON_PREFIX: "S",
};
