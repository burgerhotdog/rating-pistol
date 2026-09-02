import math

lookup_type = {
    "Rogue": "hunt",
    "Priest": "abundance",
    "Warrior": "destruction",
    "Knight": "preservation",
    "Warlock": "nihility",
    "Shaman": "harmony",
    "Mage": "erudition",
    "Memory": "remembrance",
    "Elation": "elation",
}

lookup_stat = {
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

def parse_skills(data):
    skills = {}
    key_to_id = {
        "Basic ATK": "basicAtk",
        "Skill": "skill",
        "Ultimate": "ultimate",
        "Talent": "talent",
        "Memosprite Skill": "memospriteSkill",
        "Memosprite Talent": "memospriteTalent",
        "Elation Skill": "elationSkill",
    }

    to_eval = list(data["skills"].items())

    if data["base_type"] == "Memory":
        to_eval = [
            *to_eval,
            *data["memosprite"]["skills"].items()
        ]

    for raw_skill_id, raw_skill in to_eval:
        if raw_skill["type_name"] not in key_to_id:
            continue

        skill_id = key_to_id[raw_skill["type_name"]]

        multipliers = []

        for key, value in raw_skill["level"].items():
            param_list = value["param_list"]

            for index, hit in enumerate(param_list):
                if index < len(multipliers):
                    multipliers[index]["mv"].append(hit)
                else:
                    multipliers.append({ "mv": [hit] })

        filtered = []

        for entry in multipliers:
            mv = entry["mv"]

            if len(mv) > 1 and all(x == mv[0] for x in mv):
                continue

            filtered.append(entry)

        multipliers = filtered

        if skill_id not in skills:
            skills[skill_id] = {
                "name": raw_skill["name"],
                "actions": []
            }

        skills[skill_id]["actions"].append({
            "name": raw_skill["name"],
            "type": skill_id,
            "damage": {
                "multipliers": multipliers,
            },
        })

    return skills

def parse_character(version, id, data):
    base_data = data["stats"]["6"]
    stats = {
        "baseHp": round(base_data["hp_add"] * 79 + base_data["hp_base"]),
        "baseAtk": round(base_data["attack_add"] * 79 + base_data["attack_base"]),
        "baseDef": round(base_data["defence_add"] * 79 + base_data["defence_base"]),
        "baseSpd": round(base_data["speed_base"]),
    }

    ascension = {}
    for node in data["skill_trees"].values():
        entry = node.get("1")
        if not entry or entry.get("point_type") != 1:
            continue

        add = entry["status_add_list"][0]
        stat = lookup_stat[add["property_type"]]
        ascension[stat] = ascension.get(stat, 0) + add["value"]

    for stat in ascension:
        value = round(ascension[stat], 4 if stat.endswith("%") else 1)
        stats[stat] = stats.get(stat, 0) + value

    return {
        "disabled": True,
        "name": str(data["name"]),
        "version": float(version),
        "id": int(id),
        "icon": f"honkai-star-rail/character/{id}.webp",
        "quality": int(data["rarity"][-1]),
        "element": "lightning" if data["damage_type"] == "Thunder" else data["damage_type"].lower(),
        "type": lookup_type[data["base_type"]],
        "stats": stats,
        "effects": [],
        "skills": parse_skills(data),
        "memberPreset": {},
    }

def parse_weapon(version, id, data):
    return {
        "disabled": True,
        "name": str(data["name"]),
        "version": float(version),
        "id": int(id),
        "icon": f"honkai-star-rail/weapon/{id}.webp",
        "quality": int(data["rarity"][-1]),
        "type": lookup_type[data["base_type"]],
        "stats": {
            "baseHp": round(
                data["stats"][6]["base_hp"]
                + data["stats"][6]["base_hp_add"] * 79
            ),
            "baseAtk": round(
                data["stats"][6]["base_attack"]
                + data["stats"][6]["base_attack_add"] * 79
            ),
            "baseDef": round(
                data["stats"][6]["base_defence"]
                + data["stats"][6]["base_defence_add"] * 79
            ),
        },
        "effects": [],
    }

def parse_set(version, id, data):
    return {
        "disabled": True,
        "name": str(data["name"]),
        "version": float(version),
        "id": int(id),
        "icon": f"honkai-star-rail/set/{id}.webp",
        "bonuses": [num for num in data.get("require_num", {})],
        "halfStat": "",
        "effects": [],
    }

def parse_hsr(type, version, id, data):
    match type:
        case "character":
            return parse_character(version, id, data)
        case "weapon":
            return parse_weapon(version, id, data)
        case "set":
            return parse_set(version, id, data)
