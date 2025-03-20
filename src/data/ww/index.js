import AVATAR_DATA from "./AVATAR_DATA";
import WEAPON_DATA from "./WEAPON_DATA";
import SET_DATA from "./SET_DATA";

const TITLE = "Wuthering Waves";
const VERSION = "2.1";

const HEADERS = {
  avatar: "Resonator",
  weapon: "Weapon",
  equips: "Echoes",
  skills: "Skills",
};

const SKILL_INDEX = {
  basic: { name: "Normal Attack", levelCap: 10 },
  skill: { name: "Resonance Skill", levelCap: 10 },
  ult: { name: "Resonance Liberation", levelCap: 10 },
  forte: { name: "Forte Circuit", levelCap: 10 },
  intro: { name: "Intro Skill", levelCap: 10 },
};

const EQUIP_NAMES = [
  "4-Cost",
  "3-Cost",
  "3-Cost",
  "1-Cost",
  "1-Cost",
];

const MAINSTAT_OPTIONS = [
  ["HP", "ATK", "DEF", "CR", "CD", "HB"],
  ["HP", "ATK", "DEF", "AERO", "ELECTRO", "FUSION", "GLACIO", "HAVOC", "SPECTRO", "ER"],
  ["HP", "ATK", "DEF", "AERO", "ELECTRO", "FUSION", "GLACIO", "HAVOC", "SPECTRO", "ER"],
  ["HP", "ATK", "DEF"],
  ["HP", "ATK", "DEF"],
];

const SUBSTAT_OPTIONS = [
  "_HP",
  "_ATK",
  "_DEF",
  "HP",
  "ATK",
  "DEF",
  "CR",
  "CD",
  "ER",
  "BA",
  "HA",
  "RS",
  "RL",
];

const STAT_INDEX = {
  "_HP": {
    name: "HP",
    percent: false,
    valueSub: 580,
  },
  "_ATK": {
    name: "ATK",
    percent: false,
    valueSub: 60,
  },
  "_DEF": {
    name: "DEF",
    percent: false,
    valueSub: 70,
  },
  "HP": {
    name: "HP%",
    percent: true,
    valueMain4: 33,
    valueMain3: 30,
    valueMain1: 22.8,
    valueSub: 11.6,
  },
  "ATK": {
    name: "ATK%",
    percent: true,
    valueMain4: 33,
    valueMain3: 30,
    valueMain1: 18,
    valueSub: 11.6,
  },
  "DEF": {
    name: "DEF%",
    percent: true,
    valueMain4: 41.5,
    valueMain3: 38,
    valueMain1: 18,
    valueSub: 14.7,
  },
  "CR": {
    name: "CRIT Rate",
    percent: true,
    valueMain4: 22,
    valueSub: 10.5,
  },
  "CD": {
    name: "CRIT DMG",
    percent: true,
    valueMain4: 44,
    valueSub: 21,
  },
  "HB": {
    name: "Healing Bonus",
    percent: true,
    valueMain4: 26,
  },
  "AERO": {
    name: "Aero DMG Bonus",
    percent: true,
    valueMain3: 30,
  },
  "ELECTRO": {
    name: "Electro DMG Bonus",
    percent: true,
    valueMain3: 30,
  },
  "FUSION": {
    name: "Fusion DMG Bonus",
    percent: true,
    valueMain3: 30,
  },
  "GLACIO": {
    name: "Glacio DMG Bonus",
    percent: true,
    valueMain3: 30,
  },
  "HAVOC": {
    name: "Havoc DMG Bonus",
    percent: true,
    valueMain3: 30,
  },
  "SPECTRO": {
    name: "Spectro DMG Bonus",
    percent: true,
    valueMain3: 30,
  },
  "ER": {
    name: "Energy Regen",
    percent: true,
    valueMain3: 32,
    valueSub: 12.4,
  },
  "BA": {
    name: "Basic Attack DMG Bonus",
    percent: true,
    valueSub: 11.6,
  },
  "HA": {
    name: "Heavy Attack DMG Bonus",
    percent: true,
    valueSub: 11.6,
  },
  "RS": {
    name: "Resonance Skill DMG Bonus",
    percent: true,
    valueSub: 11.6,
  },
  "RL": {
    name: "Resonance Liberation DMG Bonus",
    percent: true,
    valueSub: 11.6,
  },
};

export default {
  TITLE,
  VERSION,
  HEADERS,
  LEVEL_CAP: 90,
  AVATAR_DATA,
  PREFIX: "S",
  SKILL_INDEX,
  WEAPON_DATA,
  WEAPON_PREFIX: "R",
  SET_DATA,
  EQUIP_NAMES,
  MAINSTAT_OPTIONS,
  SUBSTAT_OPTIONS,
  STAT_INDEX,
};
