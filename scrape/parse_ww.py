import math

list_element = [
    "glacio",
    "fusion",
    "electro",
    "aero",
    "spectro",
    "havoc",
]

list_type = [
    "broadblade",
    "sword",
    "pistols",
    "gauntlets",
    "rectifier",
]

lookup_cost = {
    0: 1,
    1: 3,
    2: 4,
    3: 4,
}

lookup_stat = {
    "HP": "hp%",
    "HP+": "hp%",
    "HP Up": "hp%",
    "ATK": "atk%",
    "ATK+": "atk%",
    "ATK Up": "atk%",
    "DEF": "def%",
    "DEF+": "def%",
    "DEF Up": "def%",
    "Crit. Rate": "critRate%",
    "Crit. Rate+": "critRate%",
    "Crit. Rate Up": "critRate%",
    "Crit. DMG": "critDmg%",
    "Crit. DMG+": "critDmg%",
    "Crit. DMG Up": "critDmg%",
    "Healing Bonus": "healingBonus%",
    "Healing Bonus+": "healingBonus%",
    "Glacio DMG Bonus": "glacioDmgBonus%",
    "Glacio DMG Bonus+": "glacioDmgBonus%",
    "Fusion DMG Bonus": "fusionDmgBonus%",
    "Fusion DMG Bonus+": "fusionDmgBonus%",
    "Electro DMG Bonus": "electroDmgBonus%",
    "Electro DMG Bonus+": "electroDmgBonus%",
    "Aero DMG Bonus": "aeroDmgBonus%",
    "Aero DMG Bonus+": "aeroDmgBonus%",
    "Spectro DMG Bonus": "spectroDmgBonus%",
    "Spectro DMG Bonus+": "spectroDmgBonus%",
    "Havoc DMG Bonus": "havocDmgBonus%",
    "Havoc DMG Bonus+": "havocDmgBonus%",
    "Energy Regen": "energyRegen%",
}

def parse_segment(segment):
    segment = segment.replace(" ", "")
    parts = segment.split("*")

    if parts[0].endswith("%"):
        segment_type = "mv"
        segment_value = round(float(parts[0].replace("%", "")) / 100, 4)
    else:
        segment_type = "flat"
        segment_value = int(parts[0])
    
    times = int(parts[1]) if len(parts) > 1 else 1

    return segment_type, segment_value, times

def format_multipliers(raw_list):
    base_multipliers = raw_list[0].split("+")
    result = []

    # Step 1: use first entry to define structure
    for segment in base_multipliers:
        segment_type, segment_value, times = parse_segment(segment)

        result.append({
            segment_type: [segment_value],
            **({"times": times} if times > 1 else {})
        })

    # Step 2: fill remaining values
    for mv_str in raw_list[1:]:
        segments = mv_str.split("+")

        for i, segment in enumerate(segments):
            segment_type, segment_value, _ = parse_segment(segment)
            result[i][segment_type].append(segment_value)

    return result

def parse_skills(data):
    skills = {}
    key_to_id = {
        "1": "normalAttack",
        "2": "resonanceSkill",
        "3": "resonanceLiberation",
        "6": "introSkill",
        "7": "forteCircuit",
    }
    
    for group_id in ["1", "2", "3", "7", "6"]:
        skill_group_data = data["skill_trees"][group_id]["skill"]

        actions = []
        for _, skill_data in skill_group_data["level"].items():
            if "%" not in skill_data["param"][0][0]:
                continue # skip invalid entries

            # get scaling attribute
            fmt = skill_data["format"]
            if fmt is None:
                attr = None
            elif "HP" in fmt:
                attr = "hp"
            elif "ATK" in fmt:
                attr = "atk"
            elif "DEF" in fmt:
                attr = "def"
            elif "Tune AMP" in fmt:
                attr = "tuneAmp"
            else:
                raise ValueError(f"Unknown skill format: {fmt}")

            # format multipliers list
            multipliers = format_multipliers(skill_data["param"][0])

            actions.append({
                "name": skill_data["name"],
                "type": "basicAttack" if group_id == "1" else key_to_id[group_id],
                "damage": {
                    **({"attr": attr} if attr else {}),
                    "multipliers": multipliers,
                },
            })

        skills[key_to_id[group_id]] = {
            "name": "",
            "actions": actions,
        }

    skills["outroSkill"] = {
        "name": data["skill_trees"]["8"]["skill"]["name"],
        "actions": [
            {
                "name": data["skill_trees"]["8"]["skill"]["name"],
                "type": "outroSkill",
            }
        ],
    }
    return skills

def parse_character(version, id, data):
    base_data = data["stats"]["6"]["90"]
    stats = {
        "baseHp": math.floor(base_data["life"]),
        "baseAtk": math.floor(base_data["atk"]),
        "baseDef": math.floor(base_data["def"]),
    }

    ascension = {}
    for v in data["skill_trees"].values():
        skill = v.get("skill")
        if v.get("node_type") != 4 or not skill:
            continue
        name = skill["name"]
        if name not in lookup_stat:
            continue
        stat = lookup_stat[name]
        value = float(skill["param"][0].rstrip("%")) / 100

        ascension[stat] = ascension.get(stat, 0) + value

    for stat in reversed(ascension):
        stats[stat] = round(ascension[stat], 4 if stat.endswith("%") else 1)

    return {
        "disabled": True,
        "name": str(data["name"]),
        "version": float(version),
        "id": int(id),
        "icon": f"wuthering-waves/character/{id}.webp",
        "quality": int(data["rarity"]),
        "element": list_element[int(data["element"]) - 1],
        "type": list_type[int(data["weapon"]) - 1],
        "stats": stats,
        "effects": [],
        "skills": parse_skills(data),
        "memberPreset": {},
    }

def parse_weapon(version, id, data):
    stat = lookup_stat[data["stats"]["6"]["90"][1]["name"]]
    value = data["stats"]["6"]["90"][1]["value"]
    return {
        "disabled": True,
        "name": str(data["name"]),
        "version": float(version),
        "id": int(id),
        "icon": f"wuthering-waves/weapon/{id}.webp",
        "quality": int(data["rarity"]),
        "type": list_type[int(data["type"]) - 1],
        "stats": {
            "baseAtk": math.floor(data["stats"]["6"]["90"][0]["value"]),
            stat: value / 10000 if data["stats"]["6"]["90"][1]["is_ratio"] else int(value),
        },
        "effects": [],
    }

def parse_echo(version, id, data):
    actions = []
    for entry in data["skill"]["damage"].values():
        action = {
            "name": f"Echo Skill: {data['name']}",
        }

        element_index = entry["element"] - 1
        action["type"] = "echoSkill"
        action["element"] = (
            "physical"
            if element_index == -1
            else list_element[element_index]
        )

        attr = entry["related_property"].lower()
        if attr != "atk":
            action["attr"] = attr

        # Echoes with flat components don"t use rate_lv
        if len(entry["rate_lv"]) > 4:
            action["damage"] = {
                "multipliers": [{ "mv": entry["rate_lv"][4] / 10000 }],
            }

        if data["skill"]["desc"].startswith("Summon"):
            action["duration"] = 0

        actions.append(action)

    return {
        "disabled": True,
        "name": str(data["name"]),
        "version": float(version),
        "id": int(id),
        "icon": f"wuthering-waves/echo/{id}.webp",
        "sets": [int(x) for x in data["group"]],
        "cost": lookup_cost[data["intensity_code"]],
        "effects": [],
        "actions": actions,
    }

def parse_set(version, id, data):
    return {
        "disabled": True,
        "name": str(data["name"]["en"]),
        "version": float(version),
        "id": int(id),
        "icon": f"wuthering-waves/set/{id}.webp",
        "bonuses": [num for num in data.get("set", {})],
        "halfStat": "",
        "effects": [],
    }

def parse_ww(type, version, id, data):
    match type:
        case "character":
            return parse_character(version, id, data)
        case "weapon":
            return parse_weapon(version, id, data)
        case "echo":
            return parse_echo(version, id, data)
        case "set":
            return parse_set(version, id, data)
