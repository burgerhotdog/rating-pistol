import requests
from .parse_character import parse_character
from .parse_action import parse_action
from .parse_weapon import parse_weapon
from .parse_set import parse_set
from .parse_echo import parse_echo
from .parse_image import parse_image

lang = {
    "gi": {
        "set": "artifact",
    },
    "hsr": {
        "weapon": "lightcone",
        "set": "relicset",
    },
    "ww": {
        "set": "sonata",
    },
    "zzz": {
        "set": "equipment",
    },
}

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

def enter_ids(game, version, type):
    mapped_type = lang[game].get(type, type)
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
        if mapped_type == "sonata":
            input_response = response[input_id]
        else:
            input_response = requests.get(f"{url_base}en/{mapped_type}/{input_id}.json").json()

        match type:
            case "character":
                entries.append((
                    parse_character(game, version, input_id, input_response),
                    parse_action(game, input_response),
                    parse_image(game, type, input_response, input_id),
                ))
            case "weapon":
                entries.append((
                    parse_weapon(game, version, input_id, input_response),
                    parse_image(game, type, input_response, input_id),
                ))
            case "set":
                entries.append((
                    parse_set(game, version, input_id, input_response),
                    parse_image(game, type, input_response, input_id),
                ))
            case "echo":
                entries.append((
                    parse_echo(version, input_id, input_response),
                    parse_image(game, type, input_response, input_id),
                ))

    return entries
