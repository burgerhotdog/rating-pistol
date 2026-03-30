import requests
from .maps import (
    ID_TYPE_MAP,
    RARITY_VALUE_MAP,
    ELEMENT_ACCESS_MAP,
    ELEMENT_VALUE_MAP,
    WEAPON_TYPE_ACCESS_MAP,
    WEAPON_TYPE_VALUE_MAP,
    BASE_HP_MAP,
    BASE_ATK_MAP,
    BASE_DEF_MAP,
)

def fetch_character(game_id, version, ID):
    mapped_id_type = ID_TYPE_MAP.get(game_id, {}).get('character', 'character')
    url = f"https://static.nanoka.cc/{game_id}/{version}/en/{mapped_id_type}/{ID}.json"
    data = requests.get(url).json()

    NAME = data['name']
    QUALITY = RARITY_VALUE_MAP.get(game_id, {}).get(data['rarity'], data['rarity'])
    ELEMENT = ELEMENT_VALUE_MAP.get(game_id, {}).get(ELEMENT_ACCESS_MAP[game_id](data), ELEMENT_ACCESS_MAP[game_id](data))
    TYPE = WEAPON_TYPE_VALUE_MAP.get(game_id, {}).get(WEAPON_TYPE_ACCESS_MAP[game_id](data), WEAPON_TYPE_ACCESS_MAP[game_id](data))

    FIXED_STATS = {}
    FIXED_STATS['BASE_HP'] = BASE_HP_MAP[game_id](data)
    FIXED_STATS['BASE_ATK'] = BASE_ATK_MAP[game_id](data)
    FIXED_STATS['BASE_DEF'] = BASE_DEF_MAP[game_id](data)

    return {
        "NAME": NAME,
        "QUALITY": QUALITY,
        "ELEMENT": ELEMENT,
        "TYPE": TYPE,
        "FIXED_STATS": FIXED_STATS,
    }
