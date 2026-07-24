import requests
from .parse_character import parse_character
from .parse_action import parse_action
from .parse_weapon import parse_weapon
from .parse_set import parse_set

def parse_name(entry, type):
    if type == "sonata":
        return entry["name"]["en"]
    if type == "artifact":
        set_map = entry.get("set", {})
        first_set = next(iter(set_map.values()), {})
        return first_set["name"]["en"]
    if type == "equipment":
        return entry["en"]["name"]

    return entry["en"]

def enter_ids(ctx, version, type):
    mapped_type = ctx["lang"]["type"].get(type, type)
    game = ctx['link']
    url_base = f"https://static.nanoka.cc/{game}/{version}/"
    response = requests.get(f"{url_base}{mapped_type}.json").json()

    while True:
        raw_input = input(f"Enter new {type} IDs (separated by space, or press Enter to skip): ")
        if raw_input == "":
            return []

        inputs = raw_input.split()
        invalid_ids = [ID for ID in inputs if ID not in response]
        if not invalid_ids:
            break

        print(f"Invalid IDs: ({', '.join(invalid_ids)}). Please try again.")

    inputs = sorted(inputs, key=int)
    entries = []

    for input_id in inputs:
        input_response = requests.get(f"{url_base}en/{mapped_type}/{input_id}.json").json()
        match type:
            case "character":
                entries.push((
                    parse_character(game, float(version), input_id, input_response),
                    parse_action(game, input_response),
                ))
            case "weapon":
                entries.push(parse_weapon(game, float(version), input_id, input_response))
            case "set":
                entries.push(parse_set(game, float(version), input_id, input_response))
    return entries
