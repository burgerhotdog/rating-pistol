import json, requests, sys
from update import (
    select_game_index,
    enter_ids,
    parse_image,
    read_json,
    write_json,
)

GAMES = [
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
                "name": lambda data: data['name'],
                "quality": lambda data: data['rarity'],
                "element": lambda data: data['element'],
                "type": lambda data: data['weapon'],
                "fixedStats": {
                    "BASE_HP": lambda data: data['base_hp'] * data['stats_modifier']['hp']['90'] + data['stats_modifier']['ascension'][5]['fight_prop_base_hp'],
                    "BASE_ATK": lambda data: data['base_atk'] * data['stats_modifier']['atk']['90'] + data['stats_modifier']['ascension'][5]['fight_prop_base_attack'],
                    "BASE_DEF": lambda data: data['base_def'] * data['stats_modifier']['def']['90'] + data['stats_modifier']['ascension'][5]['fight_prop_base_defense'],
                    "BASE_EM": lambda data: data['elemental_mastery'],
                },
            },
            "weapon": {
                "name": lambda data: data['name'],
                "quality": lambda data: str(data['rarity']),
                "type": lambda data: data['weapon_type'],
                "fixedStats": {
                    "BASE_ATK": lambda data: data['stats_modifier']['atk']['base'] * data['stats_modifier']['atk']['levels']['90'] + data['ascension']['6']['fight_prop_base_attack'],
                },
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
                "fixedStats": {
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
                },
            },
            "weapon": {
                "fixedStats": {
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
            "set": lambda data, ID: f"itemfigures/{data["icon"][22:data['icon'].rindex('.')]}",
        },
        "parsers": {
            "character": {
                "name": lambda data: data['name'],
                "quality": lambda data: data['rarity'],
                "element": lambda data: data['damage_type'],
                "type": lambda data: data['base_type'],
                "fixedStats": {
                    "BASE_HP": lambda data: data['stats']['6']['hp_add'] * 79 + data['stats']['6']['hp_base'],
                    "BASE_ATK": lambda data: data['stats']['6']['attack_add'] * 79 + data['stats']['6']['attack_base'],
                    "BASE_DEF": lambda data: data['stats']['6']['defence_add'] * 79 + data['stats']['6']['defence_base'],
                    "BASE_SPD": lambda data: data['stats']['6']['speed_base'],
                },
            },
            "weapon": {
                "name": lambda data: data['name'],
                "quality": lambda data: data['rarity'],
                "type": lambda data: data['base_type'],
                "fixedStats": {
                    "BASE_HP": lambda data: data['stats'][6]['base_hp'] + data['stats'][6]['base_hp_add'] * 79,
                    "BASE_ATK": lambda data: data['stats'][6]['base_attack_add'] * 79 + data['stats'][6]['base_attack'],
                    "BASE_DEF": lambda data: data['stats'][6]['base_defence'] + data['stats'][6]['base_defence_add'] * 79,
                },
            },
            "set": {
                "name": lambda data: data['name'],
            },
        },
        "lang": {
            "id_type": {
                "weapon": "lightcone",
                "set": "relicset",
            },
            "character": {
                "quality": {
                    'CombatPowerAvatarRarityType5': '5',
                    'CombatPowerAvatarRarityType4': '4',
                },
                "element": {
                    'Thunder': 'Lightning',
                },
                "type": {
                    'Rogue': 'Hunt',
                    'Priest': 'Abundance',
                    'Warrior': 'Destruction',
                    'Knight': 'Preservation',
                    'Warlock': 'Nihility',
                    'Shaman': 'Harmony',
                    'Mage': 'Erudition',
                    'Memory': 'Remembrance',
                },
                "fixedStats": {
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
                },
            },
            "weapon": {
                "quality": {
                    'CombatPowerLightconeRarity5': '5',
                    'CombatPowerLightconeRarity4': '4',
                    'CombatPowerLightconeRarity3': '3',
                },
                "type": {
                    'Rogue': 'Hunt',
                    'Priest': 'Abundance',
                    'Warrior': 'Destruction',
                    'Knight': 'Preservation',
                    'Warlock': 'Nihility',
                    'Shaman': 'Harmony',
                    'Mage': 'Erudition',
                    'Memory': 'Remembrance',
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
                "name": lambda data: data['name'],
                "quality": lambda data: str(data['rarity']),
                "element": lambda data: data['element'],
                "type": lambda data: data['weapon'],
                "fixedStats": {
                    "BASE_HP": lambda data: data['stats']['6']['90']['life'],
                    "BASE_ATK": lambda data: data['stats']['6']['90']['atk'],
                    "BASE_DEF": lambda data: data['stats']['6']['90']['def'],
                },
            },
            "weapon": {
                "name": lambda data: data['name'],
                "quality": lambda data: str(data['rarity']),
                "type": lambda data: data['type'],
                "fixedStats": {
                    "BASE_ATK": lambda data: data['stats']['6']['90'][0]['value'],
                },
            },
            "set": {
                "name": lambda data: data['name'],
            },
        },
        "lang": {
            "id_type": {
                "set": "echo",
            },
            "character": {
                "element": {
                    1: 'Glacio',
                    2: 'Fusion',
                    3: 'Electro',
                    4: 'Aero',
                    5: 'Spectro',
                    6: 'Havoc',
                },
                "type": {
                    1: 'Broadblade',
                    2: 'Sword',
                    3: 'Pistols',
                    4: 'Gauntlets',
                    5: 'Rectifier',
                },
                "fixedStats": {
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
                },
            },
            "weapon": {
                "type": {
                    1: 'Broadblade',
                    2: 'Sword',
                    3: 'Pistols',
                    4: 'Gauntlets',
                    5: 'Rectifier',
                },
                "fixedStats": {
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
                    "Energy Regen+": "PERCENT_ER",
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
                "name": lambda data: data['name'],
                "quality": lambda data: data['rarity'],
                "element": lambda data: next(iter(data['element_type'].values())),
                "type": lambda data: next(iter(data['weapon_type'].values())),
                "fixedStats": {
                    "BASE_HP": lambda data: data['stats']['hp_growth'] / 10000 * 59 + data['stats']['hp_max'] + data['level']['6']['hp_max'],
                    "BASE_ATK": lambda data: data['stats']['attack_growth'] / 10000 * 59 + data['stats']['attack'] + data['level']['6']['attack'],
                    "BASE_DEF": lambda data: data['stats']['defence_growth'] / 10000 * 59 + data['stats']['defence'] + data['level']['6']['defence'],
                    "BASE_IMPACT": lambda data: data['stats']['break_stun'],
                    "BASE_AM": lambda data: data['stats']['element_abnormal_power'],
                    "BASE_AP": lambda data: data['stats']['element_mystery'],
                },
            },
            "weapon": {
                "name": lambda data: data['name'],
                "quality": lambda data: data['rarity'],
                "type": lambda data: next(iter(data['weapon_type'].values())),
                "fixedStats": {
                    "BASE_ATK": lambda data: data['base_property']['value'] * 104 / 7,
                },
            },
            "set": {
                "name": lambda data: data['name'],
            },
        },
        "lang": {
            "id_type": {
                "set": "equipment",
            },
            "character": {
                "quality": {
                    4: '5',
                    3: '4',
                    2: '3',
                },
                "fixedStats": {
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
                },
            },
            "weapon": {
                "quality": {
                    4: '5',
                    3: '4',
                    2: '3',
                },
                "fixedStats": {
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
                },
            },
        },
    },
]

def parse_and_add_ascension_stats(game_id, id_type, data, fixedStats, lang_map):
    match game_id:
        case 'genshin-impact':
            if id_type == 'character':
                raw_stat_id, stat_value = list(data['stats_modifier']['ascension'][5].items())[3]
                stat_id = lang_map[raw_stat_id]
                fixedStats[stat_id] = fixedStats.get(stat_id, 0) + stat_value
            else:
                raw_stat_id, stat_map = list(data['stats_modifier'].items())[1]
                stat_id = lang_map[raw_stat_id]
                fixedStats[stat_id] = stat_map['base'] * stat_map['levels']['90']

        case 'honkai-star-rail':
            if id_type == 'character':
                for node in data['skill_trees'].values():
                    if node['1']['point_type'] != 1:
                        continue

                    stat_id = lang_map[node['1']['status_add_list'][0]['property_type']]
                    stat_value = node['1']['status_add_list'][0]['value']
                    fixedStats[stat_id] = fixedStats.get(stat_id, 0) + stat_value
                
        case 'wuthering-waves':
            if id_type == 'character':
                for node in data['skill_trees'].values():
                    if node['node_type'] != 4:
                        continue
                    
                    stat_id = lang_map[node['skill']['name']]
                    stat_value = float(node['skill']['param'][0][:-1]) / 100
                    fixedStats[stat_id] = fixedStats.get(stat_id, 0) + stat_value
            else:
                stat_id = lang_map[f"{data['stats']['6']['90'][1]['name']}+"]
                fixedStats[stat_id] = data['stats']['6']['90'][1]['value'] / 10000 if data['stats']['6']['90'][1]['is_percent'] else data['stats']['6']['90'][1]['value']

        case 'zenless-zone-zero':
            if id_type == 'character':
                for core_passive_bonus in data['extra_level']['6']['extra'].values():
                    stat_id = lang_map[core_passive_bonus['name']]
                    if stat_id.startswith('PERCENT'):
                        stat_value = core_passive_bonus['value'] / 10000
                    elif stat_id == 'BASE_ER':
                        stat_value = core_passive_bonus['value'] / 100
                    else:
                        stat_value = core_passive_bonus['value']
                    fixedStats[stat_id] = fixedStats.get(stat_id, 0) + stat_value
            else:
                stat_id = lang_map[data['rand_property']['name']]
                fixedStats[stat_id] = (data['rand_property']['value'] if stat_id.startswith('FLAT') else data['rand_property']['value'] / 10000) * 2.5

def parse_data(GAME, data, id_type):
    mapped_id_type = GAME["lang"]["id_type"].get(id_type, id_type)
    result = {}
    for field, parser in GAME["parsers"][id_type].items():
        lang_map = GAME["lang"].get(id_type, {}).get(field, {})
        if field == "fixedStats":
            fixedStats = {}
            for stat_field, stat_parser in parser.items():
                parsed_value = stat_parser(data)
                fixedStats[stat_field] = fixedStats.get(stat_field, 0) + parsed_value
            parse_and_add_ascension_stats(GAME["id"], id_type, data, fixedStats, lang_map)
            result[field] = fixedStats
            continue
        parsed_value = parser(data)
        result[field] = lang_map.get(parsed_value, parsed_value)
    return result

def main():
    # Select game
    game_index = select_game_index([game["name"] for game in GAMES])
    GAME = GAMES[game_index]
    print()

    # Enter IDs
    manifest = requests.get("https://static.nanoka.cc/manifest.json").json()
    version = manifest[GAME["link"]]["live"]

    character_ids, character_names, _ = enter_ids(GAME, version, "character")
    weapon_ids, weapon_names, _ = enter_ids(GAME, version, "weapon")
    set_ids, set_names, echo_setid_to_key = enter_ids(GAME, version, "set")
    print()

    # Confirm input
    print(f"Version {version} update summary")
    if character_names:
        print(f"New characters: {', '.join(character_names)}")
    if weapon_names:
        print(f"New weapons: {', '.join(weapon_names)}")
    if set_names:
        print(f"New sets: {', '.join(set_names)}")
    print()

    while True:
        continue_update = input("Continue? (y/n): ")
        match continue_update:
            case "n":
                print('Update cancelled.')
                sys.exit()
            case "y":
                break
        print('Invalid input. Please try again.')
    print()

    # Scrape
    url_base = f"https://static.nanoka.cc/{GAME['link']}/{version}/en/"
    if character_ids:
        path = f"src/data/{GAME['id']}/character.json"
        json_data = read_json(path)
        mapped_id_type = GAME["lang"]["id_type"].get("character", "character")
        for ID in character_ids:
            data = requests.get(f"{url_base}{mapped_id_type}/{ID}.json").json()
            parse_image(GAME, data, ID, "character")
            json_data[ID] = parse_data(GAME, data, "character")
        write_json(f"src/data/{GAME['id']}/character.json", json_data)

    if weapon_ids:
        path = f"src/data/{GAME['id']}/weapon.json"
        json_data = read_json(path)
        mapped_id_type = GAME["lang"]["id_type"].get("weapon", "weapon")
        for ID in weapon_ids:
            data = requests.get(f"{url_base}{mapped_id_type}/{ID}.json").json()
            parse_image(GAME, data, ID, "weapon")
            json_data[ID] = parse_data(GAME, data, "weapon")
        write_json(f"src/data/{GAME['id']}/weapon.json", json_data)

    if set_ids:
        path = f"src/data/{GAME['id']}/set.json"
        json_data = read_json(path)
        mapped_id_type = GAME["lang"]["id_type"].get("set", "set")
        for ID in set_ids:
            if GAME["id"] == "wuthering-waves":
                data = requests.get(f"{url_base}{mapped_id_type}/{echo_setid_to_key[ID]}.json").json()
                data = data["group"][ID]
            else:
                data = requests.get(f"{url_base}{mapped_id_type}/{ID}.json").json()
            parse_image(GAME, data, ID, "set")
            json_data[ID] = parse_data(GAME, data, "set")
        write_json(f"src/data/{GAME['id']}/set.json", json_data)

    print("Update complete")

if __name__ == "__main__":
    main()
