import math

def parse_stats(game_id, data):
    constant = {}

    match game_id:
        case "genshin-impact":
            constant["baseAtk"] = round(data["stats_modifier"]["atk"]["base"] * data["stats_modifier"]["atk"]["levels"]["90"] + data["ascension"]["6"]["fight_prop_base_attack"])

            # Ascension stats
            stat_map = {
                "fight_prop_hp_percent": "hp%",
                "fight_prop_attack_percent": "atk%",
                "fight_prop_defense_percent": "def%",
                "fight_prop_element_mastery": "elementalMastery",
                "fight_prop_charge_efficiency": "energyRecharge%",
                "fight_prop_wind_add_hurt": "anemoDmgBonus%",
                "fight_prop_ice_add_hurt": "cryoDmgBonus%",
                "fight_prop_grass_add_hurt": "dendroDmgBonus%",
                "fight_prop_elec_add_hurt": "electroDmgBonus%",
                "fight_prop_rock_add_hurt": "geoDmgBonus%",
                "fight_prop_water_add_hurt": "hydroDmgBonus%",
                "fight_prop_fire_add_hurt": "pyroDmgBonus%",
                "fight_prop_physical_add_hurt": "physicalDmgBonus%",
                "fight_prop_critical": "critRate%",
                "fight_prop_critical_hurt": "critDmg%",
                "fight_prop_heal_add": "healingBonus%",
            }
            raw_id, value_map = list(data["stats_modifier"].items())[1]
            stat_id = stat_map[raw_id]
            value = value_map["base"] * value_map["levels"]["90"]
            constant[stat_id] = round(value, 3) if stat_id.endswith("%") else int(round(value))

        case "honkai-star-rail":
            constant["baseHp"] = round(data["stats"][6]["base_hp"] + data["stats"][6]["base_hp_add"] * 79)
            constant["baseAtk"] = round(data["stats"][6]["base_attack"] + data["stats"][6]["base_attack_add"] * 79)
            constant["baseDef"] = round(data["stats"][6]["base_defence"] + data["stats"][6]["base_defence_add"] * 79)

        case "wuthering-waves":
            constant["baseAtk"] = math.floor(data["stats"]["6"]["90"][0]["value"])

            # Ascension stats
            stat_map = {
                "HP": "hp%",
                "ATK": "atk%",
                "DEF": "def%",
                "Crit. Rate": "critRate%",
                "Crit. DMG": "critDmg%",
                "Healing Bonus": "healingBonus%",
                "Glacio DMG Bonus": "glacioDmgBonus%",
                "Fusion DMG Bonus": "fusionDmgBonus%",
                "Electro DMG Bonus": "electroDmgBonus%",
                "Aero DMG Bonus": "aeroDmgBonus%",
                "Spectro DMG Bonus": "spectroDmgBonus%",
                "Havoc DMG Bonus": "havocDmgBonus%",
                "Energy Regen": "energyRegen%",
            }
            stat_id = stat_map[data['stats']['6']['90'][1]['name']]
            constant[stat_id] = data["stats"]["6"]["90"][1]["value"] / 10000 if data["stats"]["6"]["90"][1]["is_percent"] else data["stats"]["6"]["90"][1]["value"]

        case "zenless-zone-zero":
            constant["baseAtk"] = round(data["base_property"]["value"] * 104 / 7)

            # Ascension stats
            stat_map = {
                "HP": "hp%",
                "ATK": "atk%",
                "DEF": "def%",
                "Impact": "impact%",
                "Anomaly Mastery": "anomalyMastery",
                "Anomaly Proficiency": "anomalyProficiency",
                "Energy Regen": "energyRegen%",
                "CRIT Rate": "critRate%",
                "CRIT DMG": "critDmg%",
                "PEN Ratio": "penRatio%",
            }

            stat_id = stat_map[data["rand_property"]["name"]]
            constant[stat_id] = (data["rand_property"]["value"] / 10000 if stat_id.endswith("%") else data["rand_property"]["value"]) * 2.5

    return constant

FIELDS = {
    "genshin-impact": {
        "quality": lambda data: int(data["rarity"]),
        "type": lambda data: { "WEAPON_SWORD_ONE_HAND": "sword", "WEAPON_CLAYMORE": "claymore", "WEAPON_POLE": "polearm", "WEAPON_CATALYST": "catalyst", "WEAPON_BOW": "bow" }[data["weapon_type"]],
    },
    "honkai-star-rail": {
        "quality": lambda data: int(data["rarity"][-1]),
        "type": lambda data: { "Rogue": "hunt", "Priest": "abundance", "Warrior": "destruction", "Knight": "preservation", "Warlock": "nihility", "Shaman": "harmony", "Mage": "erudition", "Memory": "remembrance", "Elation": "elation" }[data["base_type"]],
    },
    "wuthering-waves": {
        "quality": lambda data: data["rarity"],
        "type": lambda data: ["broadblade", "sword", "pistols", "gauntlets", "rectifier"][data["type"] - 1],
    },
    "zenless-zone-zero": {
        "quality": lambda data: data["rarity"] + 1,
        "type": lambda data: next(iter(data["weapon_type"].values())).lower(),
    },
}

def parse_weapon(game_id, version, data):
    result = {}
    result["name"] = data["name"]
    result["version"] = version

    for field, parser in FIELDS[game_id].items():
        result[field] = parser(data)

    result["stats"] = parse_stats(game_id, data)

    return result
