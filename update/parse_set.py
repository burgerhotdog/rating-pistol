import requests
from .maps import (
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

GET_NAME = {
    "gi": lambda data: data["affix"][0]["name"],
    "hsr": lambda data: data["name"],
    "ww": lambda data: data["name"],
    "zzz": lambda data: data["name"],
}

def parse_set(data, game_id):
    NAME = GET_NAME[game_id](data)

    return {
        "NAME": NAME,
    }
