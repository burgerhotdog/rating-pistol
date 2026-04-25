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

def mv_parser(game_id, data):
    mv_dict = {}
    match game_id:
        case "genshin-impact":
            print("this shouldn't happen")
        case "honkai-star-rail":
            print("this shouldn't happen")
        case "wuthering-waves":
            skill_group_ids = ["1", "2", "3", "6", "7"] # normal, skill, ult, intro, forte
            
            for group_id in skill_group_ids:
                skill_group_data = data["skill_trees"][group_id]["skill"]

                skills = {}
                for skill_id, skill_data in skill_group_data["level"].items():
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

                    skills[skill_id] = {
                        "name": skill_data["name"],
                        **({"input": ""} if group_id == "7" else {}),
                        **({"attr": attr} if attr else {}),
                        "multipliers": multipliers,
                    }

                mv_dict[group_id] = { "name": skill_group_data["name"], "skills": skills }

            mv_dict["8"] = {
                "name": data["skill_trees"]["8"]["skill"]["name"],
                "skills": {
                    "1": {
                        "desc": data["skill_trees"]["8"]["skill"]["desc"],
                        "param": data["skill_trees"]["8"]["skill"]["param"],
                    },
                },
            }

        case "zenless-zone-zero":
            print("this shouldn't happen")

    return mv_dict
