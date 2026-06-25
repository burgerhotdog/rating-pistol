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

def weapon_constant_stats_parser(game_id, data):
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
            constant[stat_id] = value_map["base"] * value_map["levels"]["90"]

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

GAME_INFO = [
    {
        "name": "Genshin Impact",
        "link": "gi",
        "id": "genshin-impact",
        "assets": {
            "character": lambda data, ID: data["icon"],
            "weapon": lambda data, ID: data["icon"],
            "set": lambda data, ID: data["icon"],
        },
        "parsers": {
            "character": {
                "name": lambda data: data["name"],
                "quality": lambda data: data["rarity"],
                "element": lambda data: data["element"],
                "type": lambda data: data["weapon"],
                "baseStats": lambda data: parse_base_stats("genshin-impact", data),
                "ascensionStats": lambda data: parse_ascension_stats("genshin-impact", data),
            },
            "weapon": {
                "name": lambda data: data["name"],
                "quality": lambda data: int(data["rarity"]),
                "type": lambda data: data["weapon_type"],
                "stats": lambda data: weapon_constant_stats_parser("genshin-impact", data),
            },
            "set": {
                "name": lambda data: data["affix"][0]["name"],
            },
        },
        "lang": {
            "id_type": {
                "set": "artifact",
            },
            "character": {
                "quality": {
                    "QUALITY_ORANGE_SP": 5,
                    "QUALITY_ORANGE": 5,
                    "QUALITY_PURPLE": 4,
                },
                "type": {
                    "WEAPON_SWORD_ONE_HAND": "SWORD",
                    "WEAPON_CLAYMORE": "CLAYMORE",
                    "WEAPON_POLE": "POLEARM",
                    "WEAPON_CATALYST": "CATALYST",
                    "WEAPON_BOW": "BOW",
                },
            },
            "weapon": {
                "type": {
                    "WEAPON_SWORD_ONE_HAND": "SWORD",
                    "WEAPON_CLAYMORE": "CLAYMORE",
                    "WEAPON_POLE": "POLEARM",
                    "WEAPON_CATALYST": "CATALYST",
                    "WEAPON_BOW": "BOW",
                },
            },
        },
    },
    {
        "name": "Honkai Star Rail",
        "link": "hsr",
        "id": "honkai-star-rail",
        "assets": {
            "character": lambda data, ID: f"avatarshopicon/{ID}",
            "weapon": lambda data, ID: f"lightconemediumicon/{ID}",
            "set": lambda data, ID: f"itemfigures/{data["icon"][22:data["icon"].rindex(".")]}",
        },
        "parsers": {
            "character": {
                "name": lambda data: data["name"],
                "quality": lambda data: data["rarity"],
                "element": lambda data: data["damage_type"],
                "type": lambda data: data["base_type"],
                "baseStats": lambda data: parse_base_stats("honkai-star-rail", data),
                "ascensionStats": lambda data: parse_ascension_stats("honkai-star-rail", data),
            },
            "weapon": {
                "name": lambda data: data["name"],
                "quality": lambda data: data["rarity"],
                "type": lambda data: data["base_type"],
                "stats": lambda data: weapon_constant_stats_parser("honkai-star-rail", data),
            },
            "set": {
                "name": lambda data: data["name"],
            },
        },
        "lang": {
            "id_type": {
                "weapon": "lightcone",
                "set": "relicset",
            },
            "character": {
                "quality": {
                    "CombatPowerAvatarRarityType5": 5,
                    "CombatPowerAvatarRarityType4": 4,
                },
                "element": {
                    "Thunder": "lightning",
                },
                "type": {
                    "Rogue": "HUNT",
                    "Priest": "ABUNDANCE",
                    "Warrior": "DESTRUCTION",
                    "Knight": "PRESERVATION",
                    "Warlock": "NIHILITY",
                    "Shaman": "HARMONY",
                    "Mage": "ERUDITION",
                    "Memory": "REMEMBRANCE",
                },
            },
            "weapon": {
                "quality": {
                    "CombatPowerLightconeRarity5": 5,
                    "CombatPowerLightconeRarity4": 4,
                    "CombatPowerLightconeRarity3": 3,
                },
                "type": {
                    "Rogue": "HUNT",
                    "Priest": "ABUNDANCE",
                    "Warrior": "DESTRUCTION",
                    "Knight": "PRESERVATION",
                    "Warlock": "NIHILITY",
                    "Shaman": "HARMONY",
                    "Mage": "ERUDITION",
                    "Memory": "REMEMBRANCE",
                },
            },
        },
    },
    {
        "name": "Wuthering Waves",
        "link": "ww",
        "id": "wuthering-waves",
        "assets": {
            "character": lambda data, ID: data["icon"][13:data["icon"].rindex(".")],
            "weapon": lambda data, ID: data["icon"][13:data["icon"].rindex(".")],
            "set": lambda data, ID: data["icon"][13:data["icon"].rindex(".")],
        },
        "parsers": {
            "character": {
                "name": lambda data: data["name"],
                "quality": lambda data: data["rarity"],
                "element": lambda data: data["element"],
                "type": lambda data: data["weapon"],
                "baseStats": lambda data: parse_base_stats("wuthering-waves", data),
                "ascensionStats": lambda data: parse_ascension_stats("wuthering-waves", data),
            },
            "weapon": {
                "name": lambda data: data["name"],
                "quality": lambda data: data["rarity"],
                "type": lambda data: data["type"],
                "stats": lambda data: weapon_constant_stats_parser("wuthering-waves", data),
            },
            "set": {
                "name": lambda data: data["name"],
            },
        },
        "lang": {
            "id_type": {
                "set": "echo",
            },
            "character": {
                "element": {
                    1: "glacio",
                    2: "fusion",
                    3: "electro",
                    4: "aero",
                    5: "spectro",
                    6: "havoc",
                },
                "type": {
                    1: "BROADBLADE",
                    2: "SWORD",
                    3: "PISTOLS",
                    4: "GAUNTLETS",
                    5: "RECTIFIER",
                },
            },
            "weapon": {
                "type": {
                    1: "BROADBLADE",
                    2: "SWORD",
                    3: "PISTOLS",
                    4: "GAUNTLETS",
                    5: "RECTIFIER",
                },
            },
        },
    },
    {
        "name": "Zenless Zone Zero",
        "link": "zzz",
        "id": "zenless-zone-zero",
        "assets": {
            "character": lambda data, ID: data["icon"],
            "weapon": lambda data, ID: data["code_name"],
            "set": lambda data, ID: data["icon"][41:data["icon"].rindex(".")],
        },
        "parsers": {
            "character": {
                "name": lambda data: data["name"],
                "quality": lambda data: data["rarity"],
                "element": lambda data: next(iter(data["element_type"].values())),
                "type": lambda data: next(iter(data["weapon_type"].values())),
                "baseStats": lambda data: parse_base_stats("zenless-zone-zero", data),
                "ascensionStats": lambda data: parse_ascension_stats("zenless-zone-zero", data),
            },
            "weapon": {
                "name": lambda data: data["name"],
                "quality": lambda data: data["rarity"],
                "type": lambda data: next(iter(data["weapon_type"].values())),
                "stats": lambda data: weapon_constant_stats_parser("zenless-zone-zero", data),
            },
            "set": {
                "name": lambda data: data["name"],
            },
        },
        "lang": {
            "id_type": {
                "set": "equipment",
            },
            "character": {
                "quality": {
                    4: 5,
                    3: 4,
                    2: 3,
                },
            },
            "weapon": {
                "quality": {
                    4: 5,
                    3: 4,
                    2: 3,
                },
            },
        },
    },
]