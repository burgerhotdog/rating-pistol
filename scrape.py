import argparse, requests, sys
from scrape import (
    enter_ids,
    read_json,
    write_json,
)

manifest = requests.get("https://static.nanoka.cc/manifest.json").json()

game_ids = {
    "gi": "genshin-impact",
    "hsr": "honkai-star-rail",
    "ww": "wuthering-waves",
    "zzz": "zenless-zone-zero",
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("game", choices=game_ids.keys(), help="Game")
    args = parser.parse_args()
    game = args.game
    game_id = game_ids[game]

    # Enter IDs
    version = manifest[game]["live"]

    characters = enter_ids(game, version, "character")
    weapons = enter_ids(game, version, "weapon")
    sets = enter_ids(game, version, "set")
    if game == "ww":
        echoes = enter_ids(game, version, "echo")
    print()

    # Confirm input
    print(f"Version {version} update summary")
    if characters:
        print(f"New characters: {', '.join([character["name"] for character, _, _ in characters])}")
    if weapons:
        print(f"New weapons: {', '.join([weapon["name"] for weapon, _ in weapons])}")
    if sets:
        print(f"New sets: {', '.join([set["name"] for set, _ in sets])}")
    if echoes:
        print(f"New echoes: {', '.join([set["name"] for set, _ in sets])}")
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

    if characters:
        characters_path = f"src/data/{game_id}/characters.json"
        actions_path = f"src/data/{game_id}/actions.json"

        characters_json = read_json(characters_path)
        actions_json = read_json(actions_path)

        for character, actions, image in characters:
            id = character["id"]
            characters_json[id] = character
            actions_json[id] = actions
            
            with open(f"public/{game_id}/character/{id}.webp", "wb") as f:
                f.write(image)

        write_json(characters_path, characters_json)
        write_json(actions_path, actions_json)

    if weapons:
        weapons_path = f"src/data/{game_id}/weapons.json"
        weapons_json = read_json(weapons_path)

        for weapon, image in weapons:
            id = weapon["id"]
            weapons_json[id] = weapon
            
            with open(f"public/{game_id}/weapon/{id}.webp", "wb") as f:
                f.write(image)

        write_json(weapons_path, weapons_json)

    if sets:
        sets_path = f"src/data/{game_id}/sets.json"
        sets_json = read_json(sets_path)

        for set, image in sets:
            id = set["id"]
            sets_json[id] = set
            
            with open(f"public/{game_id}/set/{id}.webp", "wb") as f:
                f.write(image)

        write_json(sets_path, sets_json)

    if echoes:
        echoes_path = f"src/data/{game_id}/echoes.json"
        echoes_json = read_json(echoes_path)

        for echo, image in sets:
            id = echo["id"]
            echoes_json[id] = set
            
            with open(f"public/{game_id}/echo/{id}.webp", "wb") as f:
                f.write(image)

        write_json(echoes_path, echoes_json)

    # Version number
    version_json = read_json("src/data/version.json")
    version_json[game_id] = str(version)
    write_json(f"src/data/version.json", version_json)

    print("Update complete")

if __name__ == "__main__":
    main()
