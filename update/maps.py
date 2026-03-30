ID_TYPE_MAP = {
    'gi': { 'set': 'artifact' },
    'hsr': { 'weapon': 'lightcone', 'set': 'relicset' },
    'ww': { 'set': 'echo' },
    'zzz': { 'set': 'equipment' },
}

RARITY_VALUE_MAP = {
    'gi': {
        'QUALITY_ORANGE_SP': '5',
        'QUALITY_ORANGE': '5',
        'QUALITY_PURPLE': '4',
    },
    'hsr': {
        'CombatPowerAvatarRarityType5': '5',
        'CombatPowerAvatarRarityType4': '4',
        'CombatPowerLightconeRarity5': '5',
        'CombatPowerLightconeRarity4': '4',
        'CombatPowerLightconeRarity3': '3',
    },
    'zzz': {
        4: '5',
        3: '4',
        2: '3',
    },
}

ELEMENT_ACCESS_MAP = {
    'gi': lambda data: data['element'],
    'hsr': lambda data: data['damage_type'],
    'ww': lambda data: data['element'],
    'zzz': lambda data: next(iter(data['element_type'].values())),
}

ELEMENT_VALUE_MAP = {
    'hsr': {
        'Thunder': 'Lightning',
    },
    'ww': {
        1: 'Glacio',
        2: 'Fusion',
        3: 'Electro',
        4: 'Aero',
        5: 'Spectro',
        6: 'Havoc',
    },
}

CHARACTER_WEAPON_TYPE_ACCESS_MAP = {
    'gi': lambda data: data['weapon'],
    'hsr': lambda data: data['base_type'],
    'ww': lambda data: data['weapon'],
    'zzz': lambda data: next(iter(data['weapon_type'].values())),
}

WEAPON_TYPE_ACCESS_MAP = {
    'gi': lambda data: data['weapon_type'],
    'hsr': lambda data: data['base_type'],
    'ww': lambda data: data['type'],
    'zzz': lambda data: next(iter(data['weapon_type'].values())),
}

WEAPON_TYPE_VALUE_MAP = {
    'gi': {
        'WEAPON_SWORD_ONE_HAND': 'Sword',
        'WEAPON_CLAYMORE': 'Claymore',
        'WEAPON_POLE': 'Polearm',
        'WEAPON_CATALYST': 'Catalyst',
        'WEAPON_BOW': 'Bow',
    },
    'hsr': {
        'Rogue': 'Hunt',
        'Priest': 'Abundance',
        'Warrior': 'Destruction',
        'Knight': 'Preservation',
        'Warlock': 'Nihility',
        'Shaman': 'Harmony',
        'Mage': 'Erudition',
        'Memory': 'Remembrance',
    },
    'ww': {
        1: 'Broadblade',
        2: 'Sword',
        3: 'Pistols',
        4: 'Gauntlets',
        5: 'Rectifier',
    },
}

BASE_HP_MAP = {
    'gi': lambda data: data['base_hp'] * data['stats_modifier']['hp']['90'] + data['stats_modifier']['ascension'][5]['fight_prop_base_hp'],
    'hsr': lambda data: data['stats']['6']['hp_add'] * 79 + data['stats']['6']['hp_base'],
    'ww': lambda data: data['stats']['6']['90']['life'],
    'zzz': lambda data: data['stats']['hp_growth'] / 10000 * 59 + data['stats']['hp_max'] + data['level']['6']['hp_max'],
}

BASE_ATK_MAP = {
    'gi': lambda data: data['base_atk'] * data['stats_modifier']['atk']['90'] + data['stats_modifier']['ascension'][5]['fight_prop_base_attack'],
    'hsr': lambda data: data['stats']['6']['attack_add'] * 79 + data['stats']['6']['attack_base'],
    'ww': lambda data: data['stats']['6']['90']['atk'],
    'zzz': lambda data: data['stats']['attack_growth'] / 10000 * 59 + data['stats']['attack'] + data['level']['6']['attack'],
}

BASE_DEF_MAP = {
    'gi': lambda data: data['base_def'] * data['stats_modifier']['def']['90'] + data['stats_modifier']['ascension'][5]['fight_prop_base_defense'],
    'hsr': lambda data: data['stats']['6']['defence_add'] * 79 + data['stats']['6']['defence_base'],
    'ww': lambda data: data['stats']['6']['90']['def'],
    'zzz': lambda data: data['stats']['defence_growth'] / 10000 * 59 + data['stats']['defence'] + data['level']['6']['defence'],
}

GI_BONUS_NAME_MAP = {
    "fight_prop_hp_percent": "PERCENT_HP",
    "fight_prop_attack_percent": "PERCENT_ATK",
    "fight_prop_defense_percent": "PERCENT_DEF",
    "fight_prop_element_mastery": "FLAT_EM",
    "fight_prop_charge_efficiency": "PERCENT_ER",
    "fight_prop_wind_add_hurt": "PERCENT_ANEMO",
    "fight_prop_ice_add_hurt": "PERCENT_CRYO",
    "fight_prop_grass_add_hurt": "PERCENT_DENDRO",
    "fight_prop_elec_add_hurt": "PERCENT_ELECTRO",
    "fight_prop_rock_add_hurt": "PERCENT_GEO",
    "fight_prop_water_add_hurt": "PERCENT_HYDRO",
    "fight_prop_fire_add_hurt": "PERCENT_PYRO",
    "fight_prop_physical_add_hurt": "PERCENT_PHYSICAL",
    "fight_prop_critical": "PERCENT_CR",
    "fight_prop_critical_hurt": "PERCENT_CD",
    "fight_prop_heal_add": "PERCENT_HB"
}

HSR_BONUS_NAME_MAP = {
    "HPAddedRatio": "PERCENT_HP",
    "AttackAddedRatio": "PERCENT_ATK",
    "DefenceAddedRatio": "PERCENT_DEF",
    "CriticalChanceBase": "PERCENT_CR",
    "CriticalDamageBase": "PERCENT_CD",
    "StatusProbabilityBase": "PERCENT_EHR",
    "HealRatioBase": "PERCENT_OHB",
    "SpeedDelta": "FLAT_SPD",
    "FireAddedRatio": "PERCENT_FIRE",
    "IceAddedRatio": "PERCENT_ICE",
    "ImaginaryAddedRatio": "PERCENT_IMAGINARY",
    "ThunderAddedRatio": "PERCENT_LIGHTNING",
    "PhysicalAddedRatio": "PERCENT_PHYSICAL",
    "QuantumAddedRatio": "PERCENT_QUANTUM",
    "WindAddedRatio": "PERCENT_WIND",
    "BreakDamageAddedRatioBase": "PERCENT_BE",
    "SPRatioBase": "PERCENT_ERR",
    "StatusResistanceBase": "PERCENT_RES",
    "ElationDamageAddedRatioBase": "PERCENT_ELATION",
}

WW_BONUS_NAME_MAP = {
    "HP+": "PERCENT_HP",
    "ATK+": "PERCENT_ATK",
    "DEF+": "PERCENT_DEF",
    "Crit. Rate+": "PERCENT_CR",
    "Crit. DMG+": "PERCENT_CD",
    "Healing Bonus+": "PERCENT_OHB",
    "Glacio DMG Bonus+": "PERCENT_GLACIO",
    "Fusion DMG Bonus+": "PERCENT_FIRE",
    "Electro DMG Bonus+": "PERCENT_ICE",
    "Aero DMG Bonus+": "PERCENT_AERO",
    "Spectro DMG Bonus+": "PERCENT_SPECTRO",
    "Havoc DMG Bonus+": "PERCENT_HAVOC",
}

ZZZ_BONUS_NAME_MAP = {
    "Base HP": "BASE_HP",
    "Base ATK": "BASE_ATK",
    "Base DEF": "BASE_DEF",
    "HP": "PERCENT_HP",
    "ATK": "PERCENT_ATK",
    "DEF": "PERCENT_DEF",
    "Impact": "BASE_IMPACT",
    "Anomaly Mastery": "BASE_AM",
    "Anomaly Proficiency": "BASE_AP",
    "Base Energy Regen": "BASE_ER",
    "CRIT Rate": "PERCENT_CR",
    "CRIT DMG": "PERCENT_CD",
    "PEN Ratio": "PERCENT_PR",
}

ZZZ_WEAPON_BONUS_NAME_MAP = {
    "HP": "PERCENT_HP",
    "ATK": "PERCENT_ATK",
    "DEF": "PERCENT_DEF",
    "Impact": "PERCENT_IMPACT",
    "Anomaly Mastery": "PERCENT_AM",
    "Anomaly Proficiency": "FLAT_AP",
    "Energy Regen": "PERCENT_ER",
    "CRIT Rate": "PERCENT_CR",
    "CRIT DMG": "PERCENT_CD",
    "PEN Ratio": "PERCENT_PR",
}

WEAPON_BASE_ATK_MAP = {
    'gi': lambda data: data['stats_modifier']['atk']['base'] * data['stats_modifier']['atk']['levels']['90'] + data['ascension']['6']['fight_prop_base_attack'],
    'hsr': lambda data: data['stats'][6]['base_attack_add'] * 79 + data['stats'][6]['base_attack'],
    'ww': lambda data: data['stats']['6']['90'][0]['value'],
    'zzz': lambda data: data['base_property']['value'] * 104 / 7,
}