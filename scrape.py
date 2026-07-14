import json, requests, sys
from scrape import (
    GAME_INFO,
    select_game_index,
    enter_ids,
    read_json,
    write_json,
    parse_character,
    parse_action,
    parse_weapon,
    parse_set,
    make_parse_image,
)

def main():
    manifest = requests.get("https://static.nanoka.cc/manifest.json").json()
    version_json = read_json("src/data/version.json")

    # Select game
    print("Select game to update:")
    names = [game["name"] for game in GAME_INFO]
    for index, option in enumerate(names):
        current_game_info = GAME_INFO[index]
        print(f"{index + 1}: {option} {version_json[current_game_info["id"]]} => {manifest[current_game_info["link"]]["live"]}")

    while True:
        choice = input(f"Enter #(1-{len(names)}): ")
        try:
            index = int(choice) - 1
            if 0 <= index < len(names):
                break
        except ValueError:
            pass
        print('Invalid input. Please try again.')

    game_index = index
    GAME = GAME_INFO[game_index]
    game_id = GAME["id"]
    game_link = GAME["link"]
    parse_image = make_parse_image(GAME)
    print()

    # Enter IDs
    version = manifest[game_link]["live"]

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
    def scrape_data(type, type_id):
        base = f"https://static.nanoka.cc/{game_link}/{version}/en/"

        type_mapping = {
            "genshin-impact": {
                "set": "artifact"
            },
            "honkai-star-rail": {
                "weapon": "lightcone",
                "set": "relicset",
            },
            "wuthering-waves": {
                "set": "echo",
            },
            "zenless-zone-zero": {
                "set": "equipment",
            },
        }

        url = f"{base}{type_mapping[game_id].get(type, type)}/{type_id}.json"
        if (type == "set"):
            ww_url = f"{base}{type_mapping[game_id].get(type, type)}/{echo_setid_to_key[type_id]}.json"

        return requests.get(url).json() if game_id != "wuthering-waves" or type != "set" else requests.get(ww_url).json()["group"][type_id]

    if character_ids:
        characters_path = f"src/data/{game_id}/characters.json"
        actions_path = f"src/data/{game_id}/actions.json"

        characters_json = read_json(characters_path)
        actions_json = read_json(actions_path)

        for char_id in character_ids:
            data = scrape_data("character", char_id)

            parse_image("character", data, char_id)
            characters_json[char_id] = parse_character(game_id, version, data)
            actions_json[char_id] = parse_action(game_id, data)

        write_json(characters_path, characters_json)
        write_json(actions_path, actions_json)

    if weapon_ids:
        weapons_path = f"src/data/{game_id}/weapons.json"
        weapons_json = read_json(weapons_path)

        for weap_id in weapon_ids:
            data = scrape_data("weapon", weap_id)

            parse_image("weapon", data, weap_id)
            weapons_json[weap_id] = parse_weapon(game_id, version, data)

        write_json(weapons_path, weapons_json)

    if set_ids:
        sets_path = f"src/data/{game_id}/sets.json"
        sets_json = read_json(sets_path)

        for set_id in set_ids:
            data = scrape_data("set", set_id)

            parse_image("set", data, set_id)
            sets_json[set_id] = parse_set(game_id, version, data)

        write_json(sets_path, sets_json)

    # Version number
    version_json[game_id] = str(version)
    write_json(f"src/data/version.json", version_json)

    print("Update complete")

if __name__ == "__main__":
    main()
