import math

def character_constant_stats_parser(game_id, data):
    constant = {}
    match game_id:
        case "genshin-impact":
            # Base stats
            constant["BASE_HP"] = round(data["base_hp"] * data["stats_modifier"]["hp"]["90"] + data["stats_modifier"]["ascension"][5]["fight_prop_base_hp"])
            constant["BASE_ATK"] = round(data["base_atk"] * data["stats_modifier"]["atk"]["90"] + data["stats_modifier"]["ascension"][5]["fight_prop_base_attack"])
            constant["BASE_DEF"] = round(data["base_def"] * data["stats_modifier"]["def"]["90"] + data["stats_modifier"]["ascension"][5]["fight_prop_base_defense"])
            constant["BASE_EM"] = round(data["elemental_mastery"])
            
            # Ascension stats
            stat_map = {
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
                "fight_prop_heal_add": "PERCENT_HB",
            }
            raw_id, value = list(data["stats_modifier"]["ascension"][5].items())[3]
            stat_id = stat_map[raw_id]
            constant[stat_id] = constant.get(stat_id, 0) + value

        case "honkai-star-rail":
            # Base stats
            constant["BASE_HP"] = round(data["stats"]["6"]["hp_add"] * 79 + data["stats"]["6"]["hp_base"])
            constant["BASE_ATK"] = round(data["stats"]["6"]["attack_add"] * 79 + data["stats"]["6"]["attack_base"])
            constant["BASE_DEF"] = round(data["stats"]["6"]["defence_add"] * 79 + data["stats"]["6"]["defence_base"])
            constant["BASE_SPD"] = round(data["stats"]["6"]["speed_base"])

            # Ascension stats
            stat_map = {
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
            nodes = [
                node for node in data["skill_trees"].values()
                if node.get("1", {}).get("point_type") == 1
            ]
            for node in nodes:
                stat_id = stat_map[node["1"]["status_add_list"][0]["property_type"]]
                stat_value = node["1"]["status_add_list"][0]["value"]
                constant[stat_id] = constant.get(stat_id, 0) + stat_value

        case "wuthering-waves":
            # Base stats
            constant["BASE_HP"] = math.floor(data["stats"]["6"]["90"]["life"])
            constant["BASE_ATK"] = math.floor(data["stats"]["6"]["90"]["atk"])
            constant["BASE_DEF"] = math.floor(data["stats"]["6"]["90"]["def"])

            # Ascension stats
            stat_map = {
                "HP+": "PERCENT_HP",
                "HP Up": "PERCENT_HP",
                "ATK+": "PERCENT_ATK",
                "ATK Up": "PERCENT_ATK",
                "DEF+": "PERCENT_DEF",
                "DEF Up": "PERCENT_DEF",
                "Crit. Rate+": "PERCENT_CR",
                "Crit. Rate Up": "PERCENT_CR",
                "Crit. DMG+": "PERCENT_CD",
                "Crit. DMG Up": "PERCENT_CD",
                "Healing Bonus+": "PERCENT_OHB",
                "Glacio DMG Bonus+": "PERCENT_GLACIO",
                "Fusion DMG Bonus+": "PERCENT_FIRE",
                "Electro DMG Bonus+": "PERCENT_ICE",
                "Aero DMG Bonus+": "PERCENT_AERO",
                "Spectro DMG Bonus+": "PERCENT_SPECTRO",
                "Havoc DMG Bonus+": "PERCENT_HAVOC",
            }
            nodes = [
                node for node in data["skill_trees"].values()
                if node.get("node_type") == 4
            ]
            for node in nodes:
                stat_id = stat_map[node["skill"]["name"]]
                stat_value = float(node["skill"]["param"][0][:-1]) / 100
                constant[stat_id] = constant.get(stat_id, 0) + stat_value

        case "zenless-zone-zero":
            # Base stats
            constant["BASE_HP"] = round(data["stats"]["hp_growth"] / 10000 * 59 + data["stats"]["hp_max"] + data["level"]["6"]["hp_max"])
            constant["BASE_ATK"] = round(data["stats"]["attack_growth"] / 10000 * 59 + data["stats"]["attack"] + data["level"]["6"]["attack"])
            constant["BASE_DEF"] = round(data["stats"]["defence_growth"] / 10000 * 59 + data["stats"]["defence"] + data["level"]["6"]["defence"])
            constant["BASE_IMPACT"] = round(data["stats"]["break_stun"])
            constant["BASE_AM"] = round(data["stats"]["element_abnormal_power"])
            constant["BASE_AP"] = round(data["stats"]["element_mystery"])

            # Ascension stats
            stat_map = {
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
            for core_passive_bonus in data["extra_level"]["6"]["extra"].values():
                stat_id = stat_map[core_passive_bonus["name"]]
                if stat_id.startswith("PERCENT"):
                    stat_value = core_passive_bonus["value"] / 10000
                elif stat_id == "BASE_ER":
                    stat_value = core_passive_bonus["value"] / 100
                else:
                    stat_value = core_passive_bonus["value"]
                constant[stat_id] = constant.get(stat_id, 0) + stat_value

    return { constant }

def weapon_constant_stats_parser(game_id, data):
    constant = {}

    match game_id:
        case "genshin-impact":
            # Base stats
            constant["BASE_ATK"] = round(data["stats_modifier"]["atk"]["base"] * data["stats_modifier"]["atk"]["levels"]["90"] + data["ascension"]["6"]["fight_prop_base_attack"])

            # Ascension stats
            stat_map = {
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
                "fight_prop_heal_add": "PERCENT_HB",
            }
            raw_id, value_map = list(data["stats_modifier"].items())[1]
            stat_id = stat_map[raw_id]
            constant[stat_id] = value_map["base"] * value_map["levels"]["90"]

        case "honkai-star-rail":
            # Base stats
            constant["BASE_HP"] = round(data["stats"][6]["base_hp"] + data["stats"][6]["base_hp_add"] * 79)
            constant["BASE_ATK"] = round(data["stats"][6]["base_attack_add"] * 79 + data["stats"][6]["base_attack"])
            constant["BASE_DEF"] = round(data["stats"][6]["base_defence"] + data["stats"][6]["base_defence_add"] * 79)

        case "wuthering-waves":
            # Base stats
            constant["BASE_ATK"] = math.floor(data["stats"]["6"]["90"][0]["value"])

            # Ascension stats
            stat_map = {
                "HP": "PERCENT_HP",
                "ATK": "PERCENT_ATK",
                "DEF": "PERCENT_DEF",
                "Crit. Rate": "PERCENT_CR",
                "Crit. DMG": "PERCENT_CD",
                "Healing Bonus": "PERCENT_OHB",
                "Glacio DMG Bonus": "PERCENT_GLACIO",
                "Fusion DMG Bonus": "PERCENT_FIRE",
                "Electro DMG Bonus": "PERCENT_ICE",
                "Aero DMG Bonus": "PERCENT_AERO",
                "Spectro DMG Bonus": "PERCENT_SPECTRO",
                "Havoc DMG Bonus": "PERCENT_HAVOC",
                "Energy Regen": "PERCENT_ER",
            }
            stat_id = stat_map[data['stats']['6']['90'][1]['name']]
            constant[stat_id] = data["stats"]["6"]["90"][1]["value"] / 10000 if data["stats"]["6"]["90"][1]["is_percent"] else data["stats"]["6"]["90"][1]["value"]

        case "zenless-zone-zero":
            # Base stats
            constant["BASE_ATK"] = round(data["base_property"]["value"] * 104 / 7)

            # Ascension stats
            stat_map = {
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
            stat_id = stat_map[data["rand_property"]["name"]]
            constant[stat_id] = (data["rand_property"]["value"] if stat_id.startswith("FLAT") else data["rand_property"]["value"] / 10000) * 2.5

    return { constant }

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
                "stats": lambda data: character_constant_stats_parser("genshin-impact", data),
            },
            "weapon": {
                "name": lambda data: data["name"],
                "quality": lambda data: str(data["rarity"]),
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
                    "QUALITY_ORANGE_SP": "5",
                    "QUALITY_ORANGE": "5",
                    "QUALITY_PURPLE": "4",
                },
                "type": {
                    "WEAPON_SWORD_ONE_HAND": "Sword",
                    "WEAPON_CLAYMORE": "Claymore",
                    "WEAPON_POLE": "Polearm",
                    "WEAPON_CATALYST": "Catalyst",
                    "WEAPON_BOW": "Bow",
                },
            },
            "weapon": {
                "type": {
                    "WEAPON_SWORD_ONE_HAND": "Sword",
                    "WEAPON_CLAYMORE": "Claymore",
                    "WEAPON_POLE": "Polearm",
                    "WEAPON_CATALYST": "Catalyst",
                    "WEAPON_BOW": "Bow",
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
                "stats": lambda data: character_constant_stats_parser("honkai-star-rail", data),
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
                    "CombatPowerAvatarRarityType5": "5",
                    "CombatPowerAvatarRarityType4": "4",
                },
                "element": {
                    "Thunder": "Lightning",
                },
                "type": {
                    "Rogue": "Hunt",
                    "Priest": "Abundance",
                    "Warrior": "Destruction",
                    "Knight": "Preservation",
                    "Warlock": "Nihility",
                    "Shaman": "Harmony",
                    "Mage": "Erudition",
                    "Memory": "Remembrance",
                },
            },
            "weapon": {
                "quality": {
                    "CombatPowerLightconeRarity5": "5",
                    "CombatPowerLightconeRarity4": "4",
                    "CombatPowerLightconeRarity3": "3",
                },
                "type": {
                    "Rogue": "Hunt",
                    "Priest": "Abundance",
                    "Warrior": "Destruction",
                    "Knight": "Preservation",
                    "Warlock": "Nihility",
                    "Shaman": "Harmony",
                    "Mage": "Erudition",
                    "Memory": "Remembrance",
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
                "quality": lambda data: str(data["rarity"]),
                "element": lambda data: data["element"],
                "type": lambda data: data["weapon"],
                "stats": lambda data: character_constant_stats_parser("wuthering-waves", data),
            },
            "weapon": {
                "name": lambda data: data["name"],
                "quality": lambda data: str(data["rarity"]),
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
                    1: "GLACIO",
                    2: "FUSION",
                    3: "ELECTRO",
                    4: "AERO",
                    5: "SPECTRO",
                    6: "HAVOC",
                },
                "type": {
                    1: "Broadblade",
                    2: "Sword",
                    3: "Pistols",
                    4: "Gauntlets",
                    5: "Rectifier",
                },
            },
            "weapon": {
                "type": {
                    1: "Broadblade",
                    2: "Sword",
                    3: "Pistols",
                    4: "Gauntlets",
                    5: "Rectifier",
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
                "stats": lambda data: character_constant_stats_parser("zenless-zone-zero", data),
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
                    4: "5",
                    3: "4",
                    2: "3",
                },
            },
            "weapon": {
                "quality": {
                    4: "5",
                    3: "4",
                    2: "3",
                },
            },
        },
    },
]