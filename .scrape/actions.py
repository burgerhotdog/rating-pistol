import re

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

def parse_gi(data, resolved):
    index_to_id = {
        0: "NA",
        1: "ES",
        2: "EB",
        3: "EB", # backup in case index 2 is occupied by an alt sprint
    }

    for index, value in enumerate(data["skills"]):
        skill_id = index_to_id.get(index)

        promote = {int(k): v for k, v in value["promote"].items()}

        if len(promote) != 15: # skip alt sprint
            continue

        base_desc = promote[0]["desc"]
        skill = {}
        action_id = 1

        for desc_string in base_desc:
            param_matches = re.findall(r'\{param(\d+):[^}]+\}', desc_string)
            if not param_matches:
                continue

            indexed_multipliers = []
            for param_str in param_matches:
                param_index = int(param_str) - 1

                indexed_mv = [
                    promote[level]["param"][param_index]
                    for level in range(15)
                ]

                indexed_multipliers.append({ "mv": indexed_mv })

            skill[str(action_id)] = {
                "name": desc_string.split('|')[0],
                "skillType": skill_id,
                "indexedMultipliers": indexed_multipliers,
            }

            action_id += 1

        resolved[skill_id] = skill

def parse_hsr(data, resolved):
    key_to_id = {
        "Basic ATK": "BA",
        "Skill": "S",
        "Ultimate": "U",
        "Talent": "T",
        "Memosprite Skill": "MS",
        "Memosprite Talent": "MT",
        "Elation Skill": "ES",
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

        indexed_multipliers = []

        for key, value in raw_skill["level"].items():
            param_list = value["param_list"]

            for index, hit in enumerate(param_list):
                if index < len(indexed_multipliers):
                    indexed_multipliers[index]["mv"].append(hit)
                else:
                    indexed_multipliers.append({ "mv": [hit] })

        filtered = []

        for entry in indexed_multipliers:
            mv = entry["mv"]

            if len(mv) > 1 and all(x == mv[0] for x in mv):
                continue

            filtered.append(entry)

        indexed_multipliers = filtered
        
        if skill_id not in resolved:
            resolved[skill_id] = {
                "1": {
                    "name": raw_skill["name"],
                    "skillType": skill_id,
                    "indexedMultipliers": indexed_multipliers,
                }
            }
        else:
            count = len(resolved[skill_id]) + 1

            resolved[skill_id][str(count)] = {
                "name": raw_skill["name"],
                "skillType": skill_id,
                "indexedMultipliers": indexed_multipliers,
            }

def parse_ww(data, resolved):
    key_to_id = {
        "1": "NA",
        "2": "RS",
        "3": "resonanceLiberation",
        "6": "IS",
        "7": "FC",
    }
    
    for group_id in ["1", "2", "3", "7", "6"]:
        skill_group_data = data["skill_trees"][group_id]["skill"]

        skills = {}
        action_id = 1
        for _, skill_data in skill_group_data["level"].items():
            if "%" not in skill_data["param"][0][0]:
                continue # skip invalid entries

            # get scaling attribute
            fmt = skill_data["format"]
            if fmt is None:
                attr = None
            elif "HP" in fmt:
                attr = "HP"
            elif "ATK" in fmt:
                attr = "ATK"
            elif "DEF" in fmt:
                attr = "DEF"
            elif "Tune AMP" in fmt:
                attr = "TUNE"
            else:
                raise ValueError(f"Unknown skill format: {fmt}")

            # format multipliers list
            multipliers = format_multipliers(skill_data["param"][0])

            skills[str(action_id)] = {
                "name": skill_data["name"],
                "skillType": "BA" if group_id == "1" else key_to_id[group_id],
                **({"attr": attr} if attr else {}),
                "indexedMultipliers": multipliers,
            }

            action_id += 1

        resolved[key_to_id[group_id]] = skills

    resolved["OS"] = {
        "1": {
            "name": data["skill_trees"]["8"]["skill"]["name"],
            "skillType": "OS",
        }
    }

def parse_zzz(data, resolved):
    key_to_id = {
        "basic": "BA",
        "dodge": "D",
        "assist": "A",
        "special": "S",
        "chain": "CA",
    }

    for skill_key in ["basic", "dodge", "assist", "special", "chain"]:
        skillData = data["skill"][skill_key]["description"]
        skill = {}
        skill_id = key_to_id[skill_key]

        index = 1
        for item in skillData:
            if "param" not in item:
                continue

            skill_name = item["name"]
            midpoint = len(item) // 2
            for action_data in item["param"]:
                if "param" not in action_data:
                    if "{CAL:" not in action_data["desc"]:
                        continue

                    match = re.search(r"\{CAL:(.*?)(?:,\d+,\d+)?\}", action_data["desc"])
                    expr = match.group(1)
                    expr = re.sub(r"AvatarSkillLevel\(\d+\)", "lvl", expr)
                    mult = []

                    for lvl in range(1, 17):
                        value = eval(expr, {"__builtins__": {}}, {"lvl": lvl})
                        mult.append(round(value / 100, 4))

                    skill[str(index)] = {
                        "name": skill_name + " " + action_data["name"],
                        "skillType": skill_id,
                        "indexedMultipliers": [mult],
                    }

                    index += 1
                    continue

                details = next(iter(action_data["param"].values()))
                base = details["main"]
                growth = details["growth"]

                mult = {
                    "mv": [round((base + growth * i) / 10000, 4) for i in range(16)]
                }

                if base != details["stun_ratio"]:
                    anom = details["attribute_infliction"]
                    if anom > 0:
                        mult["anomaly"] = anom

                skill[str(index)] = {
                    "name": skill_name + " " + action_data["name"],
                    "skillType": skill_id,
                    "indexedMultipliers": [mult],
                }

                index += 1

        resolved[skill_id] = skill

def parse_actions(data, game_id, char_id):
    resolved = {}
    resolved["id"] = char_id

    match game_id:
        case "genshin-impact":
            parse_gi(data, resolved)

        case "honkai-star-rail":
            parse_hsr(data, resolved)

        case "wuthering-waves":
            parse_ww(data, resolved)

        case "zenless-zone-zero":
            parse_zzz(data, resolved)

    return resolved
