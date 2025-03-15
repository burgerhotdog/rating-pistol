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
      STAT_INDEX: {
        "FIGHT_PROP_HP": "_HP",
        "FIGHT_PROP_ATTACK": "_ATK",
        "FIGHT_PROP_DEFENSE": "_DEF",
        "FIGHT_PROP_HP_PERCENT": "HP",
        "FIGHT_PROP_ATTACK_PERCENT": "ATK",
        "FIGHT_PROP_DEFENSE_PERCENT": "DEF",
        "FIGHT_PROP_ELEMENT_MASTERY": "EM",
        "FIGHT_PROP_CHARGE_EFFICIENCY": "ER",
        "FIGHT_PROP_WIND_ADD_HURT": "ANEMO",
        "FIGHT_PROP_ICE_ADD_HURT": "CRYO",
        "FIGHT_PROP_GRASS_ADD_HURT": "DENDRO",
        "FIGHT_PROP_ELEC_ADD_HURT": "ELECTRO",
        "FIGHT_PROP_ROCK_ADD_HURT": "GEO",
        "FIGHT_PROP_WATER_ADD_HURT": "HYDRO",
        "FIGHT_PROP_FIRE_ADD_HURT": "PYRO",
        "FIGHT_PROP_PHYSICAL_ADD_HURT": "PHYSICAL",
        "FIGHT_PROP_CRITICAL": "CR",
        "FIGHT_PROP_CRITICAL_HURT": "CD",
        "FIGHT_PROP_HEAL_ADD": "HB",
      },
    },

    hsr: {
      maleToFemale: {
        "8007": "8008", // remembrance
        "8005": "8006", // harmony
        "8003": "8004", // preservation
        "8001": "8002", // destruction
      },
      STAT_INDEX: {
        "HPDelta": "_HP",
        "AttackDelta": "_ATK",
        "DefenceDelta": "_DEF",
        "HPAddedRatio": "HP",
        "AttackAddedRatio": "ATK",
        "DefenceAddedRatio": "DEF",
        "CriticalChanceBase": "CR",
        "CriticalChance": "CR",
        "CriticalDamageBase": "CD",
        "CriticalDamage": "CD",
        "StatusProbabilityBase": "EHR",
        "StatusProbability": "EHR",
        "HealRatioBase": "OHB",
        "SpeedDelta": "SPD",
        "FireAddedRatio": "FIRE",
        "IceAddedRatio": "ICE",
        "ImaginaryAddedRatio": "IMAGINARY",
        "ThunderAddedRatio": "LIGHTNING",
        "PhysicalAddedRatio": "PHYSICAL",
        "QuantumAddedRatio": "QUANTUM",
        "WindAddedRatio": "WIND",
        "BreakDamageAddedRatioBase": "BE",
        "BreakDamageAddedRatio": "BE",
        "SPRatioBase": "ERR",
        "StatusResistance": "RES",
      },
    },

    ww: {
      maleToFemale: {
        "1605": "1604", // havoc
        "1501": "1502", // spectro
      },
      STAT_INDEX: {
        "": "_HP",
        "": "_ATK",
        "": "_DEF",
        "": "HP",
        "": "ATK",
        "": "DEF",
        "": "CR",
        "": "CD",
        "": "HB",
        "": "AERO",
        "": "ELECTRO",
        "": "FUSION",
        "": "GLACIO",
        "": "HAVOC",
        "": "SPECTRO",
        "": "ER",
        "": "BA",
        "": "HA",
        "": "RS",
        "": "RL",
      },
    },
    
    zzz: {
      STAT_INDEX: {
        "11103": "_HP",
        "12103": "_ATK",
        "13103": "_DEF",
        "11102": "HP",
        "12102": "ATK",
        "13102": "DEF",
        "20103": "CR",
        "21103": "CD",
        "31203": "AP",
        "31803": "ELECTRIC",
        "31903": "ETHER",
        "31603": "FIRE",
        "31703": "ICE",
        "31503": "PHYSICAL",
        "23103": "PR",
        "31402": "AM",
        "12202": "IMPACT",
        "30502": "ER",
        "23203": "PEN",
      },
    },
  };
  return translate[gameId];
};
