export default {
  EQUIP_NAMES: [
    "Flower",
    "Plume",
    "Sands",
    "Goblet",
    "Circlet",
  ],

  MAINSTAT_OPTIONS: [
    ["_HP"],
    ["_ATK"],
    ["HP", "ATK", "DEF", "EM", "ER"],
    ["HP", "ATK", "DEF", "EM", "ANEMO", "CRYO", "DENDRO", "ELECTRO", "GEO", "HYDRO", "PYRO", "PHYSICAL"],
    ["HP", "ATK", "DEF", "EM", "CR", "CD", "HB"],
  ],

  SUBSTAT_OPTIONS: [
    "_HP",
    "_ATK",
    "_DEF",
    "HP",
    "ATK",
    "DEF",
    "EM",
    "ER",
    "CR",
    "CD",
  ],
  
  STAT_INDEX: {
    "_HP": {
      name: "HP",
      percent: false,
      valueMain: 4780,
      valueSub: 298.75,
    },
    "_ATK": {
      name: "ATK",
      percent: false,
      valueMain: 311,
      valueSub: 19.45,
    },
    "_DEF": {
      name: "DEF",
      percent: false,
      valueSub: 23.15,
    },
    "HP": {
      name: "HP%",
      percent: true,
      valueMain: 46.6,
      valueSub: 5.83,
    },
    "ATK": {
      name: "ATK%",
      percent: true,
      valueMain: 46.6,
      valueSub: 5.83,
    },
    "DEF": {
      name: "DEF%",
      percent: true,
      valueMain: 58.3,
      valueSub: 7.29,
    },
    "EM": {
      name: "Elemental Mastery",
      percent: false,
      valueMain: 186.5,
      valueSub: 23.31,
    },
    "ER": {
      name: "Energy Recharge",
      percent: true,
      valueMain: 51.8,
      valueSub: 6.48,
    },
    "ANEMO": {
      name: "Anemo DMG Bonus",
      percent: true,
      valueMain: 46.6,
    },
    "CRYO": {
      name: "Cryo DMG Bonus",
      percent: true,
      valueMain: 46.6,
    },
    "DENDRO": {
      name: "Dendro DMG Bonus",
      percent: true,
      valueMain: 46.6,
    },
    "ELECTRO": {
      name: "Electro DMG Bonus",
      percent: true,
      valueMain: 46.6,
    },
    "GEO": {
      name: "Geo DMG Bonus",
      percent: true,
      valueMain: 46.6,
    },
    "HYDRO": {
      name: "Hydro DMG Bonus",
      percent: true,
      valueMain: 46.6,
    },
    "PYRO": {
      name: "Pyro DMG Bonus",
      percent: true,
      valueMain: 46.6,
    },
    "PHYSICAL": {
      name: "Physical DMG Bonus",
      percent: true,
      valueMain: 58.3,
    },
    "CR": {
      name: "CRIT Rate",
      percent: true,
      valueMain: 31.1,
      valueSub: 3.89,
    },
    "CD": {
      name: "CRIT DMG",
      percent: true,
      valueMain: 62.2,
      valueSub: 7.77,
    },
    "HB": {
      name: "Healing Bonus",
      percent: true,
      valueMain: 35.9,
    },
  },
};
