import requests
from .maps import (
    ID_TYPE_MAP,
    RARITY_VALUE_MAP,
    WEAPON_TYPE_ACCESS_MAP,
    WEAPON_TYPE_VALUE_MAP,
    WEAPON_BASE_ATK_MAP,
    BASE_HP_MAP,
    BASE_DEF_MAP,
    GI_BONUS_NAME_MAP,
    WW_BONUS_NAME_MAP,
    ZZZ_WEAPON_BONUS_NAME_MAP,
)

def fetch_weapon(game_id, version, ID):
    mapped_id_type = ID_TYPE_MAP.get(game_id, {}).get('weapon', 'weapon')
    url = f"https://static.nanoka.cc/{game_id}/{version}/en/{mapped_id_type}/{ID}.json"
    data = requests.get(url).json()

    NAME = data['name']
    QUALITY = RARITY_VALUE_MAP.get(game_id, {}).get(data['rarity'], data['rarity'])
    TYPE = WEAPON_TYPE_VALUE_MAP.get(game_id, {}).get(WEAPON_TYPE_ACCESS_MAP[game_id](data), WEAPON_TYPE_ACCESS_MAP[game_id](data))

    FIXED_STATS = {}
    FIXED_STATS['BASE_ATK'] = WEAPON_BASE_ATK_MAP[game_id](data)

    match game_id:
        case 'gi':
            raw_stat_id, stat_map = list(data['stats_modifier'].items())[1]
            stat_id = GI_BONUS_NAME_MAP[raw_stat_id]
            FIXED_STATS[stat_id] = stat_map['base'] * stat_map['levels']['90']

        case 'hsr':
            FIXED_STATS['BASE_HP'] = data['stats'][6]['base_hp'] + data['stats'][6]['base_hp_add'] * 79
            FIXED_STATS['BASE_DEF'] = data['stats'][6]['base_defence'] + data['stats'][6]['base_defence_add'] * 79

        case 'ww':
            stat_id = WW_BONUS_NAME_MAP[f"{data['stats']['6']['90'][1]['name']}+"]
            FIXED_STATS[stat_id] = data['stats']['6']['90'][1]['value'] / 1000 if data['stats']['6']['90'][1]['is_percent'] else data['stats']['6']['90'][1]['value']

        case 'zzz':
            stat_id = ZZZ_WEAPON_BONUS_NAME_MAP[data['rand_property']['name']]
            FIXED_STATS[stat_id] = (data['rand_property']['value'] if stat_id.startswith('FLAT') else data['rand_property']['value'] / 10000) * 2.5

    return {
        "NAME": NAME,
        "QUALITY": QUALITY,
        "TYPE": TYPE,
        "FIXED_STATS": FIXED_STATS,
    }
