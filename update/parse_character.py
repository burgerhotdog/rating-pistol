import requests
from .maps import (
    RARITY_VALUE_MAP,
    ELEMENT_ACCESS_MAP,
    ELEMENT_VALUE_MAP,
    CHARACTER_WEAPON_TYPE_ACCESS_MAP,
    WEAPON_TYPE_VALUE_MAP,
    BASE_HP_MAP,
    BASE_ATK_MAP,
    BASE_DEF_MAP,
    GI_BONUS_NAME_MAP,
    HSR_BONUS_NAME_MAP,
    WW_BONUS_NAME_MAP,
    ZZZ_BONUS_NAME_MAP,
)

def parse_character(data, game_id):
    NAME = data['name']
    QUALITY = RARITY_VALUE_MAP.get(game_id, {}).get(data['rarity'], data['rarity'])
    ELEMENT = ELEMENT_VALUE_MAP.get(game_id, {}).get(ELEMENT_ACCESS_MAP[game_id](data), ELEMENT_ACCESS_MAP[game_id](data))
    TYPE = WEAPON_TYPE_VALUE_MAP.get(game_id, {}).get(CHARACTER_WEAPON_TYPE_ACCESS_MAP[game_id](data), CHARACTER_WEAPON_TYPE_ACCESS_MAP[game_id](data))

    FIXED_STATS = {}
    FIXED_STATS['BASE_HP'] = BASE_HP_MAP[game_id](data)
    FIXED_STATS['BASE_ATK'] = BASE_ATK_MAP[game_id](data)
    FIXED_STATS['BASE_DEF'] = BASE_DEF_MAP[game_id](data)

    match game_id:
        case 'gi':
            FIXED_STATS['BASE_EM'] = data['elemental_mastery']

            raw_stat_id, stat_value = list(data['stats_modifier']['ascension'][5].items())[3]
            stat_id = GI_BONUS_NAME_MAP[raw_stat_id]
            FIXED_STATS[stat_id] = FIXED_STATS.get(stat_id, 0) + stat_value

        case 'hsr':
            FIXED_STATS['BASE_SPD'] = data['stats']['6']['speed_base']

            for node in data['skill_trees'].values():
                if node['1']['point_type'] != 1:
                    continue

                stat_id = HSR_BONUS_NAME_MAP[node['1']['status_add_list'][0]['property_type']]
                stat_value = node['1']['status_add_list'][0]['value']
                FIXED_STATS[stat_id] = FIXED_STATS.get(stat_id, 0) + stat_value

        case 'ww':
            for node in data['skill_trees'].values():
                if node['node_type'] != 4:
                    continue
                
                stat_id = WW_BONUS_NAME_MAP[node['skill']['name']]
                stat_value = float(node['skill']['param'][0][:-1]) / 100
                FIXED_STATS[stat_id] = FIXED_STATS.get(stat_id, 0) + stat_value

        case 'zzz':
            FIXED_STATS['BASE_IMPACT'] = data['stats']['break_stun']
            FIXED_STATS['BASE_AM'] = data['stats']['element_abnormal_power']
            FIXED_STATS['BASE_AP'] = data['stats']['element_mystery']
            
            for core_passive_bonus in data['extra_level']['6']['extra'].values():
                stat_id = ZZZ_BONUS_NAME_MAP[core_passive_bonus['name']]
                if stat_id.startswith('PERCENT'):
                    stat_value = core_passive_bonus['value'] / 10000
                elif stat_id == 'BASE_ER':
                    stat_value = core_passive_bonus['value'] / 100
                else:
                    stat_value = core_passive_bonus['value']

                FIXED_STATS[stat_id] = FIXED_STATS.get(stat_id, 0) + stat_value

    return {
        "NAME": NAME,
        "QUALITY": QUALITY,
        "ELEMENT": ELEMENT,
        "TYPE": TYPE,
        "FIXED_STATS": FIXED_STATS,
    }
