elements = [
    "glacio",
    "fusion",
    "electro",
    "aero",
    "spectro",
    "havoc",
]

def parse_echo(version, id, data):
    actions = []
    for entry in data['skill']['damage'].values():
        action = {
            "name": f"Echo Skill: {data['name']}",
        }

        element_index = entry["element"] - 1
        if element_index == -1:
            action.type = "healing"
        else:
            action.skillType = "echoSkill"
            action.element = elements[element_index]

        attr = entry["related_property"].lower()
        if attr != "atk":
            action.attr = attr

        action.multipliers = [{
            "mv": entry["rate_lv"][4] / 10000
        }]

        actions.append(action)
    

    return {
        "name": data["name"],
        "id": int(id),
        "version": float(version),
        "sets": data["group"].keys(),
        "actions": actions,
    }
