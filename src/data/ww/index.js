import AVATAR_DATA from "./AVATAR_DATA";
import WEAPON_DATA from "./WEAPON_DATA";
import SET_DATA from "./SET_DATA";

const TITLE = "Wuthering Waves";
const VERSION = "2.2";
const HEADERS = { avatar: "Resonator", weapon: "Weapon", equips: "Echoes", skills: "Skills" };
const SKILL_CAPS = [10, 10, 10, 10, 10];
const EQUIP_NAMES = ["4-Cost", "3-Cost", "3-Cost", "1-Cost", "1-Cost"];
const STAT_INDEX = {
  "_HP": {
    name: "HP",
    percent: false,
    value: 580,
  },
  "_ATK": {
    name: "ATK",
    percent: false,
    value: 60,
  },
  "_DEF": {
    name: "DEF",
    percent: false,
    value: 70,
  },
  "HP": {
    name: "HP%",
    percent: true,
    index: [0, 1, 2, 3, 4],
    value: 11.6,
  },
  "ATK": {
    name: "ATK%",
    percent: true,
    index: [0, 1, 2, 3, 4],
    value: 11.6,
  },
  "DEF": {
    name: "DEF%",
    percent: true,
    index: [0, 1, 2, 3, 4],
    value: 14.7,
  },
  "CR": {
    name: "CRIT Rate",
    percent: true,
    index: [0],
    value: 10.5,
  },
  "CD": {
    name: "CRIT DMG",
    percent: true,
    index: [0],
    value: 21,
  },
  "HB": {
    name: "Healing Bonus",
    percent: true,
    index: [0],
  },
  "AERO": {
    name: "Aero DMG Bonus",
    percent: true,
    index: [1, 2],
  },
  "ELECTRO": {
    name: "Electro DMG Bonus",
    percent: true,
    index: [1, 2],
  },
  "FUSION": {
    name: "Fusion DMG Bonus",
    percent: true,
    index: [1, 2],
  },
  "GLACIO": {
    name: "Glacio DMG Bonus",
    percent: true,
    index: [1, 2],
  },
  "HAVOC": {
    name: "Havoc DMG Bonus",
    percent: true,
    index: [1, 2],
  },
  "SPECTRO": {
    name: "Spectro DMG Bonus",
    percent: true,
    index: [1, 2],
  },
  "ER": {
    name: "Energy Regen",
    percent: true,
    index: [1, 2],
    value: 12.4,
  },
  "BA": {
    name: "Basic Attack DMG Bonus",
    percent: true,
    value: 11.6,
  },
  "HA": {
    name: "Heavy Attack DMG Bonus",
    percent: true,
    value: 11.6,
  },
  "RS": {
    name: "Resonance Skill DMG Bonus",
    percent: true,
    value: 11.6,
  },
  "RL": {
    name: "Resonance Liberation DMG Bonus",
    percent: true,
    value: 11.6,
  },
};

export default {
  TITLE,
  VERSION,
  HEADERS,
  LEVEL_CAP: 90,
  AVATAR_DATA,
  PREFIX: "S",
  SKILL_CAPS,
  WEAPON_DATA,
  WEAPON_PREFIX: "R",
  SET_DATA,
  EQUIP_NAMES,
  STAT_INDEX,
};
