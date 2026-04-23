def format_mv_list(raw_list):
    def parse_segment(segment):
        segment = segment.replace(" ", "")
        parts = segment.split("*")

        mv = round(float(parts[0].replace("%", "")) / 100, 4)
        times = int(parts[1]) if len(parts) > 1 else 1

        return mv, times

    # Step 1: use first entry to define structure
    first_segments = raw_list[0].split("+")
    result = []

    for segment in first_segments:
        mv, times = parse_segment(segment)
        result.append({
            "mv": [mv],   # initialize with first value
            **({"times": times} if times > 1 else {})
        })

    # Step 2: fill remaining values
    for mv_str in raw_list[1:]:
        segments = mv_str.split("+")

        for i, segment in enumerate(segments):
            mv, _ = parse_segment(segment)
            result[i]["mv"].append(mv)

    return result

def mv_parser(game_id, data):
    mv_dict = {}
    match game_id:
        case "genshin-impact":
            print("this shouldn't happen")
        case "honkai-star-rail":
            print("this shouldn't happen")
        case "wuthering-waves":
            skill_ids = ["1", "2", "3", "6", "7"] # normal, skill, ult, intro, forte
            
            for skill_id in skill_ids:
                data_skill_map = data["skill_trees"][skill_id]["skill"]

                sub_skills = {}
                for sub_skill_id, sub_skill_map in data_skill_map["level"].items():
                    if "%" not in sub_skill_map["param"][0][0]:
                        continue # skip invalid entries

                    # get scaling attribute
                    fmt = sub_skill_map["format"]
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

                    # format mv list
                    formatted_mv = format_mv_list(sub_skill_map["param"][0])

                    sub_skills[sub_skill_id] = {
                        "name": sub_skill_map["name"],
                        "skillType": "",
                        "dmgType": [""],
                        **({"attr": attr} if attr else {}),
                        "multipliers": formatted_mv,
                    }

                mv_dict[skill_id] = { "name": data_skill_map["name"], "subSkills": sub_skills }

        case "zenless-zone-zero":
            print("this shouldn't happen")

    return mv_dict
