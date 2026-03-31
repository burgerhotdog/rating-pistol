import json, requests, sys
from update import (
    select_option,
    enter_ids,
    parse_character,
    parse_weapon,
    parse_set,
    parse_image,
    read_json,
    write_json,
)

GAMES = {
    'Genshin Impact': 'gi',
    'Honkai Star Rail': 'hsr',
    'Wuthering Waves': 'ww',
    'Zenless Zone Zero': 'zzz',
}

GAME_LINKS = {
    'gi': 'genshin-impact',
    'hsr': 'honkai-star-rail',
    'ww': 'wuthering-waves',
    'zzz': 'zenless-zone-zero',
}

ID_TYPE_MAP = {
    'gi': { 'set': 'artifact' },
    'hsr': { 'weapon': 'lightcone', 'set': 'relicset' },
    'ww': { 'set': 'echo' },
    'zzz': { 'set': 'equipment' },
}

def main():
    game = select_option('Select game to update:', GAMES.keys())
    game_id = GAMES[game]
    print()

    data = requests.get("https://static.nanoka.cc/manifest.json").json()
    version = data[game_id]["live"]
    character_ids, character_names, _ = enter_ids(game_id, version, 'character')
    weapon_ids, weapon_names, _ = enter_ids(game_id, version, 'weapon')
    set_ids, set_names, echo_setid_to_key = enter_ids(game_id, version, 'set')
    print()

    # Confirm input
    print(f"Update summary for {game} {version}")
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
            case 'n':
                print('Update cancelled.')
                sys.exit()
            case 'y':
                break
        print('Invalid input. Please try again.')

    # Scrape
    url_base = f"https://static.nanoka.cc/{game_id}/{version}/en/"
    if character_ids:
        json_data = read_json(f"src/lookups/{GAME_LINKS[game_id]}/CHARACTERS.json")
        mapped_id_type = ID_TYPE_MAP.get(game_id, {}).get('character', 'character')
        for ID in character_ids:
            data = requests.get(f"{url_base}{mapped_id_type}/{ID}.json").json()
            parse_image(data, game_id, ID, 'character')
            json_data[ID] = parse_character(data, game_id)
        write_json(f"src/lookups/{GAME_LINKS[game_id]}/CHARACTERS.json", json_data)

    if weapon_ids:
        json_data = read_json(f"src/lookups/{GAME_LINKS[game_id]}/WEAPONS.json")
        mapped_id_type = ID_TYPE_MAP.get(game_id, {}).get('weapon', 'weapon')
        for ID in weapon_ids:
            data = requests.get(f"{url_base}{mapped_id_type}/{ID}.json").json()
            parse_image(data, game_id, ID, 'weapon')
            json_data[ID] = parse_weapon(data, game_id)
        write_json(f"src/lookups/{GAME_LINKS[game_id]}/WEAPONS.json", json_data)

    if set_ids:
        json_data = read_json(f"src/lookups/{GAME_LINKS[game_id]}/SETS.json")
        mapped_id_type = ID_TYPE_MAP.get(game_id, {}).get('set', 'set')
        for ID in set_ids:
            if game_id == "ww":
                data = requests.get(f"{url_base}{mapped_id_type}/{echo_setid_to_key[ID]}.json").json()
                data = data["group"][ID]
            else:
                data = requests.get(f"{url_base}{mapped_id_type}/{ID}.json").json()
            parse_image(data, game_id, ID, 'set')
            json_data[ID] = parse_set(data, game_id)
        write_json(f"src/lookups/{GAME_LINKS[game_id]}/SETS.json", json_data)

    print('Update complete')

if __name__ == "__main__":
    main()
