import GI_CHAR from "../data/GI_CHAR";
import GI_WEAP from "../data/GI_WEAP";
import GI_SETS from "../data/GI_SETS"
import HSR_CHAR from "../data/HSR_CHAR";
import HSR_WEAP from "../data/HSR_WEAP";
import HSR_SETS from "../data/HSR_SETS"
import ZZZ_CHAR from "../data/ZZZ_CHAR";
import ZZZ_WEAP from "../data/ZZZ_WEAP";
import ZZZ_SETS from "../data/ZZZ_SETS"
import WW_CHAR from "../data/WW_CHAR";
import WW_WEAP from "../data/WW_WEAP";
import WW_SETS from "../data/WW_SETS"

const GAME_DATA = {
  GI: {
    CHARACTERS: GI_CHAR,
    WEAPONS: GI_WEAP,
    SETS: GI_SETS,
    MAINSTATS: [
      {
        "FLAT_HP": {
          name: "HP",
          value: 4780,
          percent: false,
        },
      },
      {
        "FLAT_ATK": {
          name: "ATK",
          value: 311,
          percent: false,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 46.6,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 46.6,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 58.3,
          percent: true,
        },
        "ELEMENTAL_MASTERY": {
          name: "Elemental Mastery",
          value: 186.5,
          percent: false,
        },
        "ENERGY_RECHARGE": {
          name: "Energy Recharge",
          value: 51.8,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 46.6,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 46.6,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 58.3,
          percent: true,
        },
        "ELEMENTAL_MASTERY": {
          name: "Elemental Mastery",
          value: 186.5,
          percent: false,
        },
        "ANEMO_DMG_BONUS": {
          name: "Anemo DMG Bonus",
          value: 46.6,
          percent: true,
        },
        "CRYO_DMG_BONUS": {
          name: "Cryo DMG Bonus",
          value: 46.6,
          percent: true,
        },
        "DENDRO_DMG_BONUS": {
          name: "Dendro DMG Bonus",
          value: 46.6,
          percent: true,
        },
        "ELECTRO_DMG_BONUS": {
          name: "Electro DMG Bonus",
          value: 46.6,
          percent: true,
        },
        "GEO_DMG_BONUS": {
          name: "Geo DMG Bonus",
          value: 46.6,
          percent: true,
        },
        "HYDRO_DMG_BONUS": {
          name: "Hydro DMG Bonus",
          value: 46.6,
          percent: true,
        },
        "PYRO_DMG_BONUS": {
          name: "Pyro DMG Bonus",
          value: 46.6,
          percent: true,
        },
        "PHYSICAL_DMG_BONUS": {
          name: "Physical DMG Bonus",
          value: 58.3,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 46.6,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 46.6,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 58.3,
          percent: true,
        },
        "ELEMENTAL_MASTERY": {
          name: "Elemental Mastery",
          value: 186.5,
          percent: false,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 31.1,
          percent: true,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 62.2,
          percent: true,
        },
        "HEALING_BONUS": {
          name: "Healing Bonus",
          value: 35.9,
          percent: true,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 298.75,
        percent: false,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 19.45,
        percent: false,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 23.15,
        percent: false,
      },
      "HP": {
        name: "HP%",
        value: 5.83,
        percent: true,
      },
      "ATK": {
        name: "ATK%",
        value: 5.83,
        percent: true,
      },
      "DEF": {
        name: "DEF%",
        value: 7.29,
        percent: true,
      },
      "ELEMENTAL_MASTERY": {
        name: "Elemental Mastery",
        value: 23.31,
        percent: false,
      },
      "ENERGY_RECHARGE": {
        name: "Energy Recharge",
        value: 6.48,
        percent: true,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 3.89,
        percent: true,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 7.77,
        percent: true,
      },
    },
  },
  HSR: {
    CHARACTERS: HSR_CHAR,
    WEAPONS: HSR_WEAP,
    SETS: HSR_SETS,
    MAINSTATS: [
      {
        "FLAT_HP": {
          name: "HP",
          value: 705.6,
          percent: false,
        },
      },
      {
        "FLAT_ATK": {
          name: "ATK",
          value: 352.8,
          percent: false,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 43.2,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
          percent: true,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 32.4,
          percent: true,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 64.8,
          percent: true,
        },
        "OUTGOING_HEALING_BOOST": {
          name: "Outgoing Healing Boost",
          value: 34.5606,
          percent: true,
        },
        "EFFECT_HIT_RATE": {
          name: "Effect Hit Rate",
          value: 43.2,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 43.2,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
          percent: true,
        },
        "SPD": {
          name: "SPD",
          value: 25.032,
          percent: false,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 43.2,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
          percent: true,
        },
        "FIRE_DMG_BONUS": {
          name: "Fire DMG Bonus",
          value: 38.8803,
          percent: true,
        },
        "ICE_DMG_BONUS": {
          name: "Ice DMG Bonus",
          value: 38.8803,
          percent: true,
        },
        "IMAGINARY_DMG_BONUS": {
          name: "Imaginary DMG Bonus",
          value: 38.8803,
          percent: true,
        },
        "LIGHTNING_DMG_BONUS": {
          name: "Lightning DMG Bonus",
          value: 38.8803,
          percent: true,
        },
        "PHYSICAL_DMG_BONUS": {
          name: "Physical DMG Bonus",
          value: 38.8803,
          percent: true,
        },
        "QUANTUM_DMG_BONUS": {
          name: "Quantum DMG Bonus",
          value: 38.8803,
          percent: true,
        },
        "WIND_DMG_BONUS": {
          name: "Wind DMG Bonus",
          value: 38.8803,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 43.2,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
          percent: true,
        },
        "BREAK_EFFECT": {
          name: "Break Effect",
          value: 64.8,
          percent: true,
        },
        "ENERGY_REGENERATION_RATE": {
          name: "Energy Regeneration Rate",
          value: 19.4394,
          percent: true,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 42.34,
        percent: false,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 21.17,
        percent: false,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 21.17,
        percent: false,
      },
      "HP": {
        name: "HP%",
        value: 4.32,
        percent: true,
      },
      "ATK": {
        name: "ATK%",
        value: 4.32,
        percent: true,
      },
      "DEF": {
        name: "DEF%",
        value: 5.4,
        percent: true,
      },
      "SPD": {
        name: "SPD",
        value: 2.6,
        percent: false,
      },
      "BREAK_EFFECT": {
        name: "Break Effect",
        value: 6.48,
        percent: true,
      },
      "EFFECT_HIT_RATE": {
        name: "Effect Hit Rate",
        value: 4.32,
        percent: true,
      },
      "EFFECT_RES": {
        name: "Effect RES",
        value: 4.32,
        percent: true,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 3.24,
        percent: true,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 6.48,
        percent: true,
      },
    },
  },
  ZZZ: {
    CHARACTERS: ZZZ_CHAR,
    WEAPONS: ZZZ_WEAP,
    SETS: ZZZ_SETS,
    MAINSTATS: [
      {
        "FLAT_HP": {
          name: "HP",
          value: 2200,
          percent: false,
        },
      },
      {
        "FLAT_ATK": {
          name: "ATK",
          value: 316,
          percent: false,
        },
      },
      {
        "FLAT_DEF": {
          name: "DEF",
          value: 184,
          percent: false,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 48,
          percent: true,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 24,
          percent: true,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 48,
          percent: true,
        },
        "ANOMALY_PROFICIENCY": {
          name: "Anomaly Proficiency",
          value: 92,
          percent: false,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 48,
          percent: true,
        },
        "PEN_RATIO": {
          name: "PEN Ratio",
          value: 24,
          percent: true,
        },
        "ETHER_DMG_BONUS": {
          name: "Ether DMG Bonus",
          value: 30,
          percent: true,
        },
        "ELECTRIC_DMG_BONUS": {
          name: "Electric DMG Bonus",
          value: 30,
          percent: true,
        },
        "FIRE_DMG_BONUS": {
          name: "Fire DMG Bonus",
          value: 30,
          percent: true,
        },
        "ICE_DMG_BONUS": {
          name: "Ice DMG Bonus",
          value: 30,
          percent: true,
        },
        "PHYSICAL_DMG_BONUS": {
          name: "Physical DMG Bonus",
          value: 30,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 48,
          percent: true,
        },
        "ANOMALY_MASTERY": {
          name: "Anomaly Mastery",
          value: 30,
          percent: false,
        },
        "IMPACT": {
          name: "Impact%",
          value: 18,
          percent: true,
        },
        "ENERGY_REGEN": {
          name: "Energy Regen%",
          value: 60,
          percent: true,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 112,
        percent: false,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 19,
        percent: false,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 15,
        percent: false,
      },
      "HP": {
        name: "HP%",
        value: 3,
        percent: true,
      },
      "ATK": {
        name: "ATK%",
        value: 3,
        percent: true,
      },
      "DEF": {
        name: "DEF%",
        value: 4.8,
        percent: true,
      },
      "PEN": {
        name: "PEN",
        value: 9,
        percent: false,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 2.4,
        percent: true,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 4.8,
        percent: true,
      },
      "ANOMALY_PROFICIENCY": {
        name: "Anomaly Proficiency",
        value: 9,
        percent: false,
      },
    },
  },
  WW: {
    CHARACTERS: WW_CHAR,
    WEAPONS: WW_WEAP,
    SETS: WW_SETS,
    MAINSTATS: [
      {
        "HP": {
          name: "HP%",
          value: 33,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 33,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 41.5,
          percent: true,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 22,
          percent: true,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 44,
          percent: true,
        },
        "HEALING_BONUS": {
          name: "Healing Bonus",
          value: 26,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 38,
          percent: true,
        },
        "AERO_DMG_BONUS": {
          name: "Aero DMG Bonus",
          value: 30,
          percent: true,
        },
        "ELECTRO_DMG_BONUS": {
          name: "Electro DMG Bonus",
          value: 30,
          percent: true,
        },
        "FUSION_DMG_BONUS": {
          name: "Fusion DMG Bonus",
          value: 30,
          percent: true,
        },
        "GLACIO_DMG_BONUS": {
          name: "Glacio DMG Bonus",
          value: 30,
          percent: true,
        },
        "HAVOC_DMG_BONUS": {
          name: "Havoc DMG Bonus",
          value: 30,
          percent: true,
        },
        "SPECTRO_DMG_BONUS": {
          name: "Spectro DMG Bonus",
          value: 30,
          percent: true,
        },
        "ENERGY_REGEN": {
          name: "Energy Regen",
          value: 32,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 38,
          percent: true,
        },
        "AERO_DMG_BONUS": {
          name: "Aero DMG Bonus",
          value: 30,
          percent: true,
        },
        "ELECTRO_DMG_BONUS": {
          name: "Electro DMG Bonus",
          value: 30,
          percent: true,
        },
        "FUSION_DMG_BONUS": {
          name: "Fusion DMG Bonus",
          value: 30,
          percent: true,
        },
        "GLACIO_DMG_BONUS": {
          name: "Glacio DMG Bonus",
          value: 30,
          percent: true,
        },
        "HAVOC_DMG_BONUS": {
          name: "Havoc DMG Bonus",
          value: 30,
          percent: true,
        },
        "SPECTRO_DMG_BONUS": {
          name: "Spectro DMG Bonus",
          value: 30,
          percent: true,
        },
        "ENERGY_REGEN": {
          name: "Energy Regen",
          value: 32,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 22.8,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 18,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 18,
          percent: true,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 22.8,
          percent: true,
        },
        "ATK": {
          name: "ATK%",
          value: 18,
          percent: true,
        },
        "DEF": {
          name: "DEF%",
          value: 18,
          percent: true,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 580,
        percent: false,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 60,
        percent: false,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 70,
        percent: false,
      },
      "HP": {
        name: "HP%",
        value: 11.6,
        percent: true,
      },
      "ATK": {
        name: "ATK%",
        value: 11.6,
        percent: true,
      },
      "DEF": {
        name: "DEF%",
        value: 14.7,
        percent: true,
      },
      "ENERGY_REGEN": {
        name: "Energy Regen",
        value: 12.4,
        percent: true,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 10.5,
        percent: true,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 21,
        percent: true,
      },
      "BASIC_ATTACK_DMG_BONUS": {
        name: "Basic Attack DMG Bonus",
        value: 11.6,
        percent: true,
      },
      "HEAVY_ATTACK_DMG_BONUS": {
        name: "Heavy Attack DMG Bonus",
        value: 11.6,
        percent: true,
      },
      "RESONANCE_SKILL_DMG_BONUS": {
        name: "Resonance Skill DMG Bonus",
        value: 11.6,
        percent: true,
      },
      "RESONANCE_LIBERATION_DMG_BONUS": {
        name: "Resonance Liberation DMG Bonus",
        value: 11.6,
        percent: true,
      },
    },
  },
};

export default GAME_DATA;
