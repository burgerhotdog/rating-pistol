import argparse, requests, sys
from scrape import (
    enter_ids,
    read_json,
    write_json,
    parse_character,
    parse_action,
    parse_weapon,
    parse_set,
    make_parse_image,
)

manifest = requests.get("https://static.nanoka.cc/manifest.json").json()

contexts = {
    "gi": {
        "link": "gi",
        "name": "Genshin Impact",
        "id": "genshin-impact",
        "lang": {
            "type": {
                "set": "artifact",
            },
        },
    },
    "hsr": {
        "link": "hsr",
        "name": "Honkai Star Rail",
        "id": "honkai-star-rail",
        "lang": {
            "type": {
                "weapon": "lightcone",
                "set": "relicset",
            },
        },
    },
    "ww": {
        "link": "ww",
        "name": "Wuthering Waves",
        "id": "wuthering-waves",
        "lang": {
            "type": {
                "set": "sonata",
            },
        },
    },
    "zzz": {
        "link": "zzz",
        "name": "Zenless Zone Zero",
        "id": "zenless-zone-zero",
        "lang": {
            "type": {
                "set": "equipment",
            },
        },
    },
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("game", choices=[key for key in contexts.keys()], help="Game link")
    args = parser.parse_args()
    game = args.game

    ctx = contexts[game]
    game_id = ctx["id"]

    parse_image = make_parse_image(ctx)

    # Enter IDs
    version = manifest[game]["live"]

    characters = enter_ids(ctx, version, "character")
    weapons = enter_ids(ctx, version, "weapon")
    sets = enter_ids(ctx, version, "set")
    print()

    # Confirm input
    print(f"Version {version} update summary")
    if characters:
        print(f"New characters: {', '.join([character["name"] for character, _ in characters])}")
    if weapons:
        print(f"New weapons: {', '.join([weapon["name"] for weapon in weapons])}")
    if sets:
        print(f"New sets: {', '.join([set["name"] for set in sets])}")
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
        base = f"https://static.nanoka.cc/{game}/{version}/en/"
        url = f"{base}{ctx["lang"]["type"].get(type, type)}/{type_id}.json"
        return requests.get(url).json()

    if characters:
        characters_path = f"src/data/{game_id}/characters.json"
        actions_path = f"src/data/{game_id}/actions.json"

        characters_json = read_json(characters_path)
        actions_json = read_json(actions_path)

        for character, actions in characters:
            id = character["id"]
            data = scrape_data("character", id)
            parse_image("character", data, id)
            characters_json[id] = character
            actions_json[id] = actions

        write_json(characters_path, characters_json)
        write_json(actions_path, actions_json)

    if weapons:
        weapons_path = f"src/data/{game_id}/weapons.json"
        weapons_json = read_json(weapons_path)

        for weapon in weapons:
            id = weapon["id"]
            data = scrape_data("weapon", id)
            parse_image("weapon", data, id)
            weapons_json[id] = weapon

        write_json(weapons_path, weapons_json)

    if sets:
        sets_path = f"src/data/{game_id}/sets.json"
        sets_json = read_json(sets_path)

        for set in sets:
            id = set["id"]
            data = scrape_data("set", id)
            parse_image("set", data, id)
            sets_json[id] = set

        write_json(sets_path, sets_json)

    # Version number
    version_json = read_json("src/data/version.json")
    version_json[game_id] = str(version)
    write_json(f"src/data/version.json", version_json)

    print("Update complete")

if __name__ == "__main__":
    main()
