import AVATAR_DATA from "./AVATAR_DATA";
import WEAPON_DATA from "./WEAPON_DATA";
import SET_DATA from "./SET_DATA";

const TITLE = "Zenless Zone Zero";
const VERSION = "1.6";
const HEADERS = { avatar: "Agent", weapon: "W-Engine", equips: "Drive Discs", skills: "Skills" };
const SKILL_CAPS = [12, 12, 12, 12, 12, 7];
const EQUIP_NAMES = ["Disk 1", "Disk 2", "Disk 3", "Disk 4", "Disk 5", "Disk 6"];
const STAT_INDEX = {
  "_HP": {
    name: "HP",
    percent: false,
    index: [0],
    value: 112,
  },
  "_ATK": {
    name: "ATK",
    percent: false,
    index: [1],
    value: 19,
  },
  "_DEF": {
    name: "DEF",
    percent: false,
    index: [2],
    value: 15,
  },
  "HP": {
    name: "HP%",
    percent: true,
    index: [3, 4, 5],
    value: 3,
  },
  "ATK": {
    name: "ATK%",
    percent: true,
    index: [3, 4, 5],
    value: 3,
  },
  "DEF": {
    name: "DEF%",
    percent: true,
    index: [3, 4, 5],
    value: 4.8,
  },
  "CR": {
    name: "CRIT Rate",
    percent: true,
    index: [3],
    value: 2.4,
  },
  "CD": {
    name: "CRIT DMG",
    percent: true,
    index: [3],
    value: 4.8,
  },
  "AP": {
    name: "Anomaly Proficiency",
    percent: false,
    index: [3],
    value: 9,
  },
  "ETHER": {
    name: "Ether DMG Bonus",
    percent: true,
    index: [4],
  },
  "ELECTRIC": {
    name: "Electric DMG Bonus",
    percent: true,
    index: [4],
  },
  "FIRE": {
    name: "Fire DMG Bonus",
    percent: true,
    index: [4],
  },
  "ICE": {
    name: "Ice DMG Bonus",
    percent: true,
    index: [4],
  },
  "PHYSICAL": {
    name: "Physical DMG Bonus",
    percent: true,
    index: [4],
  },
  "PR": {
    name: "PEN Ratio",
    percent: true,
    index: [4],
  },
  "AM": {
    name: "Anomaly Mastery",
    percent: false,
    index: [5],
  },
  "IMPACT": {
    name: "Impact%",
    percent: true,
    index: [5],
  },
  "ER": {
    name: "Energy Regen%",
    percent: true,
    index: [5],
  },
  "PEN": {
    name: "PEN",
    percent: false,
    value: 9,
  },
};

export default {
  TITLE,
  VERSION,
  HEADERS,
  LEVEL_CAP: 60,
  AVATAR_DATA,
  PREFIX: "M",
  SKILL_CAPS,
  WEAPON_DATA,
  WEAPON_PREFIX: "S",
  SET_DATA,
  EQUIP_NAMES,
  MAINSTAT_OPTIONS,
  SUBSTAT_OPTIONS,
  STAT_INDEX,
};
