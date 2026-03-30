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
        'CombatPowerAvatarRarityType3': '3',
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

WEAPON_TYPE_ACCESS_MAP = {
    'gi': lambda data: data['weapon'],
    'hsr': lambda data: data['base_type'],
    'ww': lambda data: data['weapon'],
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
