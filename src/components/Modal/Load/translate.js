export default (gameId) => {
  const translate = {
    gi: {
      equipTypeToIndex: {
        EQUIP_BRACER: 0,
        EQUIP_NECKLACE: 1,
        EQUIP_SHOES: 2,
        EQUIP_RING: 3,
        EQUIP_DRESS: 4,
      },
      maleToFemale: {
        "10000005-2": "10000007-2", // pyro
        "10000005-3": "10000007-3", // hydro
        "10000005-8": "10000007-8", // dendro
        "10000005-7": "10000007-7", // electro
        "10000005-6": "10000007-6", // geo
        "10000005-4": "10000007-4", // anemo
      },
      MAIN: {
        "FIGHT_PROP_HP": "FLAT_HP",
        "FIGHT_PROP_ATTACK": "FLAT_ATK",
        "FIGHT_PROP_HP_PERCENT": "HP",
        "FIGHT_PROP_ATTACK_PERCENT": "ATK",
        "FIGHT_PROP_DEFENSE_PERCENT": "DEF",
        "FIGHT_PROP_ELEMENT_MASTERY": "ELEMENTAL_MASTERY",
        "FIGHT_PROP_CHARGE_EFFICIENCY": "ENERGY_RECHARGE",
        "FIGHT_PROP_CRITICAL": "CRIT_RATE",
        "FIGHT_PROP_CRITICAL_HURT": "CRIT_DMG",
        "FIGHT_PROP_WIND_ADD_HURT": "ANEMO_DMG_BONUS",
        "FIGHT_PROP_ICE_ADD_HURT": "CRYO_DMG_BONUS",
        "FIGHT_PROP_GRASS_ADD_HURT": "DENDRO_DMG_BONUS",
        "FIGHT_PROP_ELEC_ADD_HURT": "ELECTRO_DMG_BONUS",
        "FIGHT_PROP_ROCK_ADD_HURT": "GEO_DMG_BONUS",
        "FIGHT_PROP_WATER_ADD_HURT": "HYDRO_DMG_BONUS",
        "FIGHT_PROP_FIRE_ADD_HURT": "PYRO_DMG_BONUS",
        "FIGHT_PROP_PHYSICAL_ADD_HURT": "PHYSICAL_DMG_BONUS",
        "FIGHT_PROP_HEAL_ADD": "HEALING_BONUS",
      },
      SUB: {
        "FIGHT_PROP_HP": "FLAT_HP",
        "FIGHT_PROP_ATTACK": "FLAT_ATK",
        "FIGHT_PROP_DEFENSE": "FLAT_DEF",
        "FIGHT_PROP_HP_PERCENT": "HP",
        "FIGHT_PROP_ATTACK_PERCENT": "ATK",
        "FIGHT_PROP_DEFENSE_PERCENT": "DEF",
        "FIGHT_PROP_ELEMENT_MASTERY": "ELEMENTAL_MASTERY",
        "FIGHT_PROP_CHARGE_EFFICIENCY": "ENERGY_RECHARGE",
        "FIGHT_PROP_CRITICAL": "CRIT_RATE",
        "FIGHT_PROP_CRITICAL_HURT": "CRIT_DMG",
      },
    },

    hsr: {
      maleToFemale: {
        "8007": "8008", // remembrance
        "8005": "8006", // harmony
        "8003": "8004", // preservation
        "8001": "8002", // destruction
      },
      MAIN: {
        "HPDelta": "FLAT_HP",
        "AttackDelta": "FLAT_ATK",
        "HPAddedRatio": "HP",
        "AttackAddedRatio": "ATK",
        "DefenceAddedRatio": "DEF",
        "StatusProbabilityBase": "EFFECT_HIT_RATE",
        "HealRatioBase": "OUTGOING_HEALING_BOOST",
        "CriticalChanceBase": "CRIT_RATE",
        "CriticalDamageBase": "CRIT_DMG",
        "SpeedDelta": "SPD",
        "FireAddedRatio": "FIRE_DMG_BONUS",
        "IceAddedRatio": "ICE_DMG_BONUS",
        "ImaginaryAddedRatio": "IMAGINARY_DMG_BONUS",
        "ThunderAddedRatio": "LIGHTNING_DMG_BONUS",
        "PhysicalAddedRatio": "PHYSICAL_DMG_BONUS",
        "QuantumAddedRatio": "QUANTUM_DMG_BONUS",
        "WindAddedRatio": "WIND_DMG_BONUS",
        "BreakDamageAddedRatioBase": "BREAK_EFFECT",
        "SPRatioBase": "ENERGY_REGENERATION_RATE",
      },
      SUB: {
        "HPDelta": "FLAT_HP",
        "AttackDelta": "FLAT_ATK",
        "DefenceDelta": "FLAT_DEF",
        "HPAddedRatio": "HP",
        "AttackAddedRatio": "ATK",
        "DefenceAddedRatio": "DEF",
        "CriticalChance": "CRIT_RATE",
        "CriticalDamage": "CRIT_DMG",
        "SpeedDelta": "SPD",
        "StatusProbability": "EFFECT_HIT_RATE",
        "StatusResistance": "EFFECT_RES",
        "BreakDamageAddedRatio": "BREAK_EFFECT",
      },
    },

    ww: {
      maleToFemale: {
        "1605": "1604", // havoc
        "1501": "1502", // spectro
      },
      MAIN: {
        "": "HP",
        "": "ATK",
        "": "DEF",
        "": "CRIT_RATE",
        "": "CRIT_DMG",
        "": "HEALING_BONUS",
        "": "ENERGY_REGEN",
        "": "AERO_DMG_BONUS",
        "": "ELECTRO_DMG_BONUS",
        "": "FUSION_DMG_BONUS",
        "": "GLACIO_DMG_BONUS",
        "": "HAVOC_DMG_BONUS",
        "": "SPECTRO_DMG_BONUS",
      },
      SUB: {
        "": "FLAT_HP",
        "": "FLAT_ATK",
        "": "FLAT_DEF",
        "": "HP",
        "": "ATK",
        "": "DEF",
        "": "CRIT_RATE",
        "": "CRIT_DMG",
        "": "ENERGY_REGEN",
        "": "BASIC_ATTACK_DMG_BONUS",
        "": "HEAVY_ATTACK_DMG_BONUS",
        "": "RESONANCE_SKILL_DMG_BONUS",
        "": "RESONANCE_LIBERATION_DMG_BONUS",
      },
    },
    
    zzz: {
      maleToFemale: {},
      MAIN: {
        "": "FLAT_HP",
        "": "FLAT_ATK",
        "": "FLAT_DEF",
        "": "HP",
        "": "ATK",
        "": "DEF",
        "": "CRIT_RATE",
        "": "CRIT_DMG",
        "": "ANOMALY_PROFICIENCY",
        "": "PEN_RATIO",
        "": "ELECTRIC_DMG_BONUS",
        "": "ETHER_DMG_BONUS",
        "": "FIRE_DMG_BONUS",
        "": "ICE_DMG_BONUS",
        "": "PHYSICAL_DMG_BONUS",
        "": "ANOMALY_MASTERY",
        "": "IMPACT",
        "": "ENERGY_REGEN",
      },
      SUB: {
        "": "FLAT_HP",
        "": "FLAT_ATK",
        "": "FLAT_DEF",
        "": "HP",
        "": "ATK",
        "": "DEF",
        "": "CRIT_RATE",
        "": "CRIT_DMG",
        "": "PEN",
        "": "CRIT_RATE",
        "": "CRIT_DMG",
        "": "ANOMALY_PROFICIENCY",
      },
    },
  };
  return translate[gameId];
};
