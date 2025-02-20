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
        },
      },
      {
        "FLAT_ATK": {
          name: "ATK",
          value: 311,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 46.6,
        },
        "ATK": {
          name: "ATK%",
          value: 46.6,
        },
        "DEF": {
          name: "DEF%",
          value: 58.3,
        },
        "ELEMENTAL_MASTERY": {
          name: "Elemental Mastery",
          value: 186.5,
        },
        "ENERGY_RECHARGE": {
          name: "Energy Recharge",
          value: 51.8,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 46.6,
        },
        "ATK": {
          name: "ATK%",
          value: 46.6,
        },
        "DEF": {
          name: "DEF%",
          value: 58.3,
        },
        "ELEMENTAL_MASTERY": {
          name: "Elemental Mastery",
          value: 186.5,
        },
        "ANEMO_DMG_BONUS": {
          name: "Anemo DMG Bonus",
          value: 46.6,
        },
        "CRYO_DMG_BONUS": {
          name: "Cryo DMG Bonus",
          value: 46.6,
        },
        "DENDRO_DMG_BONUS": {
          name: "Dendro DMG Bonus",
          value: 46.6,
        },
        "ELECTRO_DMG_BONUS": {
          name: "Electro DMG Bonus",
          value: 46.6,
        },
        "GEO_DMG_BONUS": {
          name: "Geo DMG Bonus",
          value: 46.6,
        },
        "HYDRO_DMG_BONUS": {
          name: "Hydro DMG Bonus",
          value: 46.6,
        },
        "PYRO_DMG_BONUS": {
          name: "Pyro DMG Bonus",
          value: 46.6,
        },
        "PHYSICAL_DMG_BONUS": {
          name: "Physical DMG Bonus",
          value: 58.3,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 46.6,
        },
        "ATK": {
          name: "ATK%",
          value: 46.6,
        },
        "DEF": {
          name: "DEF%",
          value: 58.3,
        },
        "ELEMENTAL_MASTERY": {
          name: "Elemental Mastery",
          value: 186.5,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 31.1,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 62.2,
        },
        "HEALING_BONUS": {
          name: "Healing Bonus",
          value: 35.9,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 298.75,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 19.45,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 23.15,
      },
      "HP": {
        name: "HP%",
        value: 5.83,
      },
      "ATK": {
        name: "ATK%",
        value: 5.83,
      },
      "DEF": {
        name: "DEF%",
        value: 7.29,
      },
      "ELEMENTAL_MASTERY": {
        name: "Elemental Mastery",
        value: 23.31,
      },
      "ENERGY_RECHARGE": {
        name: "Energy Recharge",
        value: 6.48,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 3.89,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 7.77,
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
        },
      },
      {
        "FLAT_ATK": {
          name: "ATK",
          value: 352.8,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
        },
        "ATK": {
          name: "ATK%",
          value: 43.2,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 32.4,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 64.8,
        },
        "OUTGOING_HEALING_BOOST": {
          name: "Outgoing Healing Boost",
          value: 34.5606,
        },
        "EFFECT_HIT_RATE": {
          name: "Effect Hit Rate",
          value: 43.2,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
        },
        "ATK": {
          name: "ATK",
          value: 43.2,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
        },
        "SPD": {
          name: "SPD",
          value: 25.032,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
        },
        "ATK": {
          name: "ATK",
          value: 43.2,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
        },
        "FIRE_DMG_BONUS": {
          name: "Fire DMG Bonus",
          value: 38.8803,
        },
        "ICE_DMG_BONUS": {
          name: "Ice DMG Bonus",
          value: 38.8803,
        },
        "IMAGINARY_DMG_BONUS": {
          name: "Imaginary DMG Bonus",
          value: 38.8803,
        },
        "LIGHTNING_DMG_BONUS": {
          name: "Lightning DMG Bonus",
          value: 38.8803,
        },
        "PHYSICAL_DMG_BONUS": {
          name: "Physical DMG Bonus",
          value: 38.8803,
        },
        "QUANTUM_DMG_BONUS": {
          name: "Quantum DMG Bonus",
          value: 38.8803,
        },
        "WIND_DMG_BONUS": {
          name: "Wind DMG Bonus",
          value: 38.8803,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 43.2,
        },
        "ATK": {
          name: "ATK",
          value: 43.2,
        },
        "DEF": {
          name: "DEF%",
          value: 54,
        },
        "BREAK_EFFECT": {
          name: "Break Effect",
          value: 64.8,
        },
        "ENERGY_REGENERATION_RATE": {
          name: "Energy Regeneration Rate",
          value: 19.4394,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 42.34,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 21.17,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 21.17,
      },
      "HP": {
        name: "HP%",
        value: 4.32,
      },
      "ATK": {
        name: "ATK%",
        value: 4.32,
      },
      "DEF": {
        name: "DEF%",
        value: 5.4,
      },
      "SPD": {
        name: "SPD",
        value: 2.6,
      },
      "BREAK_EFFECT": {
        name: "Break Effect",
        value: 6.48,
      },
      "EFFECT_HIT_RATE": {
        name: "Effect Hit Rate",
        value: 4.32,
      },
      "EFFECT_RES": {
        name: "Effect RES",
        value: 4.32,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 3.24,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 6.48,
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
        },
      },
      {
        "FLAT_ATK": {
          name: "ATK",
          value: 316,
        },
      },
      {
        "FLAT_DEF": {
          name: "DEF",
          value: 184,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
        },
        "DEF": {
          name: "DEF%",
          value: 48,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 24,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 48,
        },
        "ANOMALY_PROFICIENCY": {
          name: "Anomaly Proficiency",
          value: 92,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
        },
        "DEF": {
          name: "DEF%",
          value: 48,
        },
        "PEN_RATIO": {
          name: "PEN Ratio",
          value: 24,
        },
        "ETHER_DMG_BONUS": {
          name: "Ether DMG Bonus",
          value: 30,
        },
        "ELECTRIC_DMG_BONUS": {
          name: "Electric DMG Bonus",
          value: 30,
        },
        "FIRE_DMG_BONUS": {
          name: "Fire DMG Bonus",
          value: 30,
        },
        "ICE_DMG_BONUS": {
          name: "Ice DMG Bonus",
          value: 30,
        },
        "PHYSICAL_DMG_BONUS": {
          name: "Physical DMG Bonus",
          value: 30,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
        },
        "DEF": {
          name: "DEF%",
          value: 48,
        },
        "ANOMALY_MASTERY": {
          name: "Anomaly Mastery",
          value: 30,
        },
        "IMPACT": {
          name: "Impact%",
          value: 18,
        },
        "ENERGY_REGEN": {
          name: "Energy Regen%",
          value: 60,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 112,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 19,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 15,
      },
      "HP": {
        name: "HP%",
        value: 3,
      },
      "ATK": {
        name: "ATK%",
        value: 3,
      },
      "DEF": {
        name: "DEF%",
        value: 4.8,
      },
      "PEN": {
        name: "PEN",
        value: 9,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 2.4,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 4.8,
      },
      "ANOMALY_PROFICIENCY": {
        name: "Anomaly Proficiency",
        value: 9,
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
        },
        "ATK": {
          name: "ATK%",
          value: 33,
        },
        "DEF": {
          name: "DEF%",
          value: 41.5,
        },
        "CRIT_RATE": {
          name: "CRIT Rate",
          value: 22,
        },
        "CRIT_DMG": {
          name: "CRIT DMG",
          value: 44,
        },
        "HEALING_BONUS": {
          name: "Healing Bonus",
          value: 26,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
        },
        "DEF": {
          name: "DEF%",
          value: 38,
        },
        "AERO_DMG_BONUS": {
          name: "Aero DMG Bonus",
          value: 30,
        },
        "ELECTRO_DMG_BONUS": {
          name: "Electro DMG Bonus",
          value: 30,
        },
        "FUSION_DMG_BONUS": {
          name: "Fusion DMG Bonus",
          value: 30,
        },
        "GLACIO_DMG_BONUS": {
          name: "Glacio DMG Bonus",
          value: 30,
        },
        "HAVOC_DMG_BONUS": {
          name: "Havoc DMG Bonus",
          value: 30,
        },
        "SPECTRO_DMG_BONUS": {
          name: "Spectro DMG Bonus",
          value: 30,
        },
        "ENERGY_REGEN": {
          name: "Energy Regen",
          value: 32,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 30,
        },
        "ATK": {
          name: "ATK%",
          value: 30,
        },
        "DEF": {
          name: "DEF%",
          value: 38,
        },
        "AERO_DMG_BONUS": {
          name: "Aero DMG Bonus",
          value: 30,
        },
        "ELECTRO_DMG_BONUS": {
          name: "Electro DMG Bonus",
          value: 30,
        },
        "FUSION_DMG_BONUS": {
          name: "Fusion DMG Bonus",
          value: 30,
        },
        "GLACIO_DMG_BONUS": {
          name: "Glacio DMG Bonus",
          value: 30,
        },
        "HAVOC_DMG_BONUS": {
          name: "Havoc DMG Bonus",
          value: 30,
        },
        "SPECTRO_DMG_BONUS": {
          name: "Spectro DMG Bonus",
          value: 30,
        },
        "ENERGY_REGEN": {
          name: "Energy Regen",
          value: 32,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 22.8,
        },
        "ATK": {
          name: "ATK%",
          value: 18,
        },
        "DEF": {
          name: "DEF%",
          value: 18,
        },
      },
      {
        "HP": {
          name: "HP%",
          value: 22.8,
        },
        "ATK": {
          name: "ATK%",
          value: 18,
        },
        "DEF": {
          name: "DEF%",
          value: 18,
        },
      },
    ],
    SUBSTATS: {
      "FLAT_HP": {
        name: "HP",
        value: 580,
      },
      "FLAT_ATK": {
        name: "ATK",
        value: 60,
      },
      "FLAT_DEF": {
        name: "DEF",
        value: 70,
      },
      "HP": {
        name: "HP%",
        value: 11.6,
      },
      "ATK": {
        name: "ATK%",
        value: 11.6,
      },
      "DEF": {
        name: "DEF%",
        value: 14.7,
      },
      "ENERGY_REGEN": {
        name: "Energy Regen",
        value: 12.4,
      },
      "CRIT_RATE": {
        name: "CRIT Rate",
        value: 10.5,
      },
      "CRIT_DMG": {
        name: "CRIT DMG",
        value: 21,
      },
      "BASIC_ATTACK_DMG_BONUS": {
        name: "Basic Attack DMG Bonus",
        value: 11.6,
      },
      "HEAVY_ATTACK_DMG_BONUS": {
        name: "Heavy Attack DMG Bonus",
        value: 11.6,
      },
      "RESONANCE_SKILL_DMG_BONUS": {
        name: "Resonance Skill DMG Bonus",
        value: 11.6,
      },
      "RESONANCE_LIBERATION_DMG_BONUS": {
        name: "Resonance Liberation DMG Bonus",
        value: 11.6,
      },
    },
  },
};

export default GAME_DATA;
