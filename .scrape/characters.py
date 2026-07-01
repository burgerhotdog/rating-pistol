import math

def parse_base_stats(game_id, data):
    parsed = {}
    match game_id:
        case "genshin-impact":
            parsed["baseHp"] = round(data["base_hp"] * data["stats_modifier"]["hp"]["90"] + data["stats_modifier"]["ascension"][5]["fight_prop_base_hp"])
            parsed["baseAtk"] = round(data["base_atk"] * data["stats_modifier"]["atk"]["90"] + data["stats_modifier"]["ascension"][5]["fight_prop_base_attack"])
            parsed["baseDef"] = round(data["base_def"] * data["stats_modifier"]["def"]["90"] + data["stats_modifier"]["ascension"][5]["fight_prop_base_defense"])

            if data["elemental_mastery"]:
                parsed["elementalMastery"] = round(data["elemental_mastery"])

        case "honkai-star-rail":
            parsed["baseHp"] = round(data["stats"]["6"]["hp_add"] * 79 + data["stats"]["6"]["hp_base"])
            parsed["baseAtk"] = round(data["stats"]["6"]["attack_add"] * 79 + data["stats"]["6"]["attack_base"])
            parsed["baseDef"] = round(data["stats"]["6"]["defence_add"] * 79 + data["stats"]["6"]["defence_base"])
            parsed["baseSpd"] = round(data["stats"]["6"]["speed_base"])

        case "wuthering-waves":
            parsed["baseHp"] = math.floor(data["stats"]["6"]["90"]["life"])
            parsed["baseAtk"] = math.floor(data["stats"]["6"]["90"]["atk"])
            parsed["baseDef"] = math.floor(data["stats"]["6"]["90"]["def"])

        case "zenless-zone-zero":
            parsed["baseHp"] = round(data["stats"]["hp_growth"] / 10000 * 59 + data["stats"]["hp_max"] + data["level"]["6"]["hp_max"])
            parsed["baseAtk"] = round(data["stats"]["attack_growth"] / 10000 * 59 + data["stats"]["attack"] + data["level"]["6"]["attack"])
            parsed["baseDef"] = round(data["stats"]["defence_growth"] / 10000 * 59 + data["stats"]["defence"] + data["level"]["6"]["defence"])
            parsed["baseImpact"] = round(data["stats"]["break_stun"])
            parsed["baseAnomalyMastery"] = round(data["stats"]["element_abnormal_power"])
            parsed["baseAnomalyProficiency"] = round(data["stats"]["element_mystery"])

    return parsed

def parse_ascension_stats(game_id, data):
    parsed = {}

    match game_id:
        case "genshin-impact":
            lookup = {
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

            raw_id, stat_value = list(data["stats_modifier"]["ascension"][5].items())[3]
            stat_id = lookup[raw_id]

            parsed[stat_id] = stat_value

        case "honkai-star-rail":
            lookup = {
                "HPAddedRatio": "hp%",
                "AttackAddedRatio": "atk%",
                "DefenceAddedRatio": "def%",
                "CriticalChanceBase": "critRate%",
                "CriticalDamageBase": "critDmg%",
                "StatusProbabilityBase": "effectHitRate%",
                "HealRatioBase": "outgoingHealingBoost%",
                "SpeedDelta": "spd",
                "FireAddedRatio": "fireDmgBonus%",
                "IceAddedRatio": "iceDmgBonus%",
                "ImaginaryAddedRatio": "imaginaryDmgBonus%",
                "ThunderAddedRatio": "lightningDmgBonus%",
                "PhysicalAddedRatio": "physicalDmgBonus%",
                "QuantumAddedRatio": "quantumDmgBonus%",
                "WindAddedRatio": "windDmgBonus%",
                "BreakDamageAddedRatioBase": "breakEffect%",
                "SPRatioBase": "energyRegenerationRate%",
                "StatusResistanceBase": "effectRes%",
                "ElationDamageAddedRatioBase": "elation%",
            }

            for node in data["skill_trees"].values():
                entry = node.get("1")
                if not entry or entry.get("point_type") != 1:
                    continue

                add = entry["status_add_list"][0]
                stat_id = lookup[add["property_type"]]
                parsed[stat_id] = parsed.get(stat_id, 0) + add["value"]

            for k in parsed:
                parsed[k] = round(parsed[k], 4 if k.endswith("%") else 1)

        case "wuthering-waves":
            lookup = {
                "HP+": "hp%",
                "HP Up": "hp%",
                "ATK+": "atk%",
                "ATK Up": "atk%",
                "DEF+": "def%",
                "DEF Up": "def%",
                "Crit. Rate+": "critRate%",
                "Crit. Rate Up": "critRate%",
                "Crit. DMG+": "critDmg%",
                "Crit. DMG Up": "critDmg%",
                "Healing Bonus+": "healingBonus%",
                "Glacio DMG Bonus+": "glacioDmgBonus%",
                "Fusion DMG Bonus+": "fusionDmgBonus%",
                "Electro DMG Bonus+": "electroDmgBonus%",
                "Aero DMG Bonus+": "aeroDmgBonus%",
                "Spectro DMG Bonus+": "spectroDmgBonus%",
                "Havoc DMG Bonus+": "havocDmgBonus%",
            }

            for v in data["skill_trees"].values():
                skill = v.get("skill")
                if v.get("node_type") != 4 or not skill:
                    continue

                name = skill["name"]
                if name not in lookup:
                    continue

                stat_id = lookup[name]
                stat_value = float(skill["param"][0].rstrip("%")) / 100

                parsed[stat_id] = parsed.get(stat_id, 0) + stat_value

            for k in parsed:
                parsed[k] = round(parsed[k], 4 if k.endswith("%") else 1)

        case "zenless-zone-zero":
            lookup = {
                11101: "baseHp",
                11102: "hp%",
                12101: "baseAtk",
                12102: "atk%",
                12201: "baseImpact",
                13101: "baseDef",
                13102: "def%",
                20101: "critRate%",
                21101: "critDmg%",
                23101: "penRatio%",
                23201: "pen",
                30501: "baseEnergyRegen",
                31201: "baseAnomalyProficiency",
                31401: "baseAnomalyMastery",
            }

            for v in data["extra_level"]["6"]["extra"].values():
                stat_id = lookup[v["prop"]]
                value = v["value"]

                if stat_id.endswith("%"):
                    value = round(value / 10000, 4)

                parsed[stat_id] = value

    return parsed

FIELDS = {
    "genshin-impact": {
        "name": lambda data: data["name"],
        "quality": lambda data: 4 if data["rarity"] == "QUALITY_PURPLE" else 5,
        "element": lambda data: data["element"].lower(),
        "type": lambda data: { "WEAPON_SWORD_ONE_HAND": "sword", "WEAPON_CLAYMORE": "claymore", "WEAPON_POLE": "polearm", "WEAPON_CATALYST": "catalyst", "WEAPON_BOW": "bow" }[data["weapon"]],
    },
    "honkai-star-rail": {
        "name": lambda data: data["name"],
        "quality": lambda data: int(data["rarity"][-1]),
        "element": lambda data: "lightning" if data["damage_type"] == "Thunder" else data["damage_type"].lower(),
        "type": lambda data: { "Rogue": "hunt", "Priest": "abundance", "Warrior": "destruction", "Knight": "preservation", "Warlock": "nihility", "Shaman": "harmony", "Mage": "erudition", "Memory": "remembrance", "Elation": "elation" }[data["base_type"]],
    },
    "wuthering-waves": {
        "name": lambda data: data["name"],
        "quality": lambda data: data["rarity"],
        "element": lambda data: ["glacio", "fusion", "electro", "aero", "spectro", "havoc"][data["element"] + 1],
        "type": lambda data: ["broadblade", "sword", "pistols", "gauntlets", "rectifier"][data["weapon"] + 1],
    },
    "zenless-zone-zero": {
        "name": lambda data: data["name"],
        "quality": lambda data: data["rarity"] + 1,
        "element": lambda data: next(iter(data["element_type"].values())).lower(),
        "type": lambda data: next(iter(data["weapon_type"].values())).lower(),
    },
}

def parse_character(game_id, char_id, data):
    result = { "id": char_id }
    lang_section = GAME["lang"].get(id_type, {})

    for field, parser in FIELDS[game_id].items():
        parsed_value = parser(data)

        if isinstance(parsed_value, dict):
            result[field] = parsed_value
        else:
            result[field] = lang_section.get(field, {}).get(parsed_value, parsed_value)

    result["baseStats"] = parse_base_stats(game_id, data)
    result["ascensionStats"] = parse_ascension_stats(game_id, data)

    return result
