export default {
  EQUIP_NAMES: [
    "Head",
    "Hands",
    "Body",
    "Feet",
    "Orb",
    "Rope",
  ],

  MAINSTAT_OPTIONS: [
    ["_HP"],
    ["_ATK"],
    ["HP", "ATK", "DEF", "CR", "CD", "EHR", "OHB"],
    ["HP", "ATK", "DEF", "SPD"],
    ["HP", "ATK", "DEF", "FIRE", "ICE", "IMAGINARY", "LIGHTNING", "PHYSICAL", "QUANTUM", "WIND"],
    ["HP", "ATK", "DEF", "BE", "ERR"],
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
    "EHR",
    "SPD",
    "BE",
    "RES",
  ],
  
  STAT_INDEX: {
    "_HP": {
      name: "HP",
      percent: false,
      valueMain: 705.6,
      valueSub: 42.34,
    },
    "_ATK": {
      name: "ATK",
      percent: false,
      valueMain: 352.8,
      valueSub: 21.17,
    },
    "_DEF": {
      name: "DEF",
      percent: false,
      valueSub: 21.17,
    },
    "HP": {
      name: "HP%",
      percent: true,
      valueMain: 43.2,
      valueSub: 4.32,
    },
    "ATK": {
      name: "ATK%",
      percent: true,
      valueMain: 43.2,
      valueSub: 4.32,
    },
    "DEF": {
      name: "DEF%",
      percent: true,
      valueMain: 54,
      valueSub: 5.4,
    },
    "CR": {
      name: "CRIT Rate",
      percent: true,
      valueMain: 32.4,
      valueSub: 3.24,
    },
    "CD": {
      name: "CRIT DMG",
      percent: true,
      valueMain: 64.8,
      valueSub: 6.48,
    },
    "EHR": {
      name: "Effect Hit Rate",
      percent: true,
      valueMain: 43.2,
      valueSub: 4.32,
    },
    "OHB": {
      name: "Outgoing Healing Boost",
      percent: true,
      valueMain: 34.5606,
    },
    "SPD": {
      name: "SPD",
      percent: false,
      valueMain: 25.032,
      valueSub: 2.6,
    },
    "FIRE": {
      name: "Fire DMG Bonus",
      percent: true,
      valueMain: 38.8803,
    },
    "ICE": {
      name: "Ice DMG Bonus",
      percent: true,
      valueMain: 38.8803,
    },
    "IMAGINARY": {
      name: "Imaginary DMG Bonus",
      percent: true,
      valueMain: 38.8803,
    },
    "LIGHTNING": {
      name: "Lightning DMG Bonus",
      percent: true,
      valueMain: 38.8803,
    },
    "PHYSICAL": {
      name: "Physical DMG Bonus",
      percent: true,
      valueMain: 38.8803,
    },
    "QUANTUM": {
      name: "Quantum DMG Bonus",
      percent: true,
      valueMain: 38.8803,
    },
    "WIND": {
      name: "Wind DMG Bonus",
      percent: true,
      valueMain: 38.8803,
    },
    "BE": {
      name: "Break Effect",
      percent: true,
      valueMain: 64.8,
      valueSub: 6.48,
    },
    "ERR": {
      name: "Energy Regeneration Rate",
      percent: true,
      valueMain: 19.4394,
    },
    "RES": {
      name: "Effect RES",
      percent: true,
      valueSub: 4.32,
    },
  },
};
