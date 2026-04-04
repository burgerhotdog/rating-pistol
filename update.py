import json, requests, sys
from update import (
    GAME_INFO,
    select_game_index,
    enter_ids,
    parse_image,
    read_json,
    write_json,
)

def parse_data(GAME, data, id_type):
    result = {}
    lang_section = GAME["lang"].get(id_type, {})

    for field, parser in GAME["parsers"][id_type].items():
        parsed_value = parser(data)
        if isinstance(parsed_value, dict):
            result[field] = parsed_value
        else:
            result[field] = lang_section.get(field, {}).get(parsed_value, parsed_value)

    return result

def main():
    # Select game
    game_index = select_game_index([game["name"] for game in GAME_INFO])
    GAME = GAME_INFO[game_index]
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
                print("Update cancelled.")
                sys.exit()
            case "y":
                break
        print("Invalid input. Please try again.")
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
