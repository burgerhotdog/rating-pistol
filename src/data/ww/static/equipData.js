export default {
  EQUIP_NAMES: [
    "4-Cost",
    "3-Cost",
    "3-Cost",
    "1-Cost",
    "1-Cost",
  ],

  MAINSTAT_OPTIONS: [
    ["HP", "ATK", "DEF", "CR", "CD", "HB"],
    ["HP", "ATK", "DEF", "AERO", "ELECTRO", "FUSION", "GLACIO", "HAVOC", "SPECTRO", "ER"],
    ["HP", "ATK", "DEF", "AERO", "ELECTRO", "FUSION", "GLACIO", "HAVOC", "SPECTRO", "ER"],
    ["HP", "ATK", "DEF"],
    ["HP", "ATK", "DEF"],
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
    "ER",
    "BA",
    "HA",
    "RS",
    "RL",
  ],
  
  STAT_INDEX: {
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
  },
};
