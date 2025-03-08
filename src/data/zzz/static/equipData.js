export default {
  EQUIP_NAMES: [
    "Disk 1",
    "Disk 2",
    "Disk 3",
    "Disk 4",
    "Disk 5",
    "Disk 6",
  ],

  MAINSTAT_OPTIONS: [
    ["_HP"],
    ["_ATK"],
    ["_DEF"],
    ["HP", "ATK", "DEF", "CR", "CD", "AP"],
    ["HP", "ATK", "DEF", "ETHER", "ELECTRIC", "FIRE", "ICE", "PHYSICAL", "PR"],
    ["HP", "ATK", "DEF", "AM", "IMPACT", "ER"],
  ],

  SUBSTAT_OPTIONS: [
    "_HP",
    "_ATK",
    "_DEF",
    "HP",
    "ATK",
    "DEF",
    "CR",
    "CD",
    "AP",
    "PEN",
  ],
  
  STAT_INDEX: {
    "_HP": {
      name: "HP",
      percent: false,
      valueMain: 2200,
      valueSub: 112,
    },
    "_ATK": {
      name: "ATK",
      percent: false,
      valueMain: 316,
      valueSub: 19,
    },
    "_DEF": {
      name: "DEF",
      percent: false,
      valueMain: 184,
      valueSub: 15,
    },
    "HP": {
      name: "HP%",
      percent: true,
      valueMain: 30,
      valueSub: 3,
    },
    "ATK": {
      name: "ATK%",
      percent: true,
      valueMain: 30,
      valueSub: 3,
    },
    "DEF": {
      name: "DEF%",
      percent: true,
      valueMain: 48,
      valueSub: 4.8,
    },
    "CR": {
      name: "CRIT Rate",
      percent: true,
      valueMain: 24,
      valueSub: 2.4,
    },
    "CD": {
      name: "CRIT DMG",
      percent: true,
      valueMain: 48,
      valueSub: 4.8,
    },
    "AP": {
      name: "Anomaly Proficiency",
      percent: false,
      valueMain: 92,
      valueSub: 9,
    },
    "ETHER": {
      name: "Ether DMG Bonus",
      percent: true,
      valueMain: 30,
    },
    "ELECTRIC": {
      name: "Electric DMG Bonus",
      percent: true,
      valueMain: 30,
    },
    "FIRE": {
      name: "Fire DMG Bonus",
      percent: true,
      valueMain: 30,
    },
    "ICE": {
      name: "Ice DMG Bonus",
      percent: true,
      valueMain: 30,
    },
    "PHYSICAL": {
      name: "Physical DMG Bonus",
      percent: true,
      valueMain: 30,
    },
    "PR": {
      name: "PEN Ratio",
      percent: true,
      valueMain: 24,
    },
    "AM": {
      name: "Anomaly Mastery",
      percent: false,
      valueMain: 30,
    },
    "IMPACT": {
      name: "Impact%",
      percent: true,
      valueMain: 18,
    },
    "ER": {
      name: "Energy Regen%",
      percent: true,
      valueMain: 60,
    },
    "PEN": {
      name: "PEN",
      percent: false,
      valueSub: 9,
    },
  },
};
