import json, sys
from update import (
    select_option,
    fetch_version,
    enter_ids,
    fetch_character,
    fetch_weapon,
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

def main():
    game = select_option('Select game to update:', GAMES.keys())
    game_id = GAMES[game]
    print()

    version = fetch_version(game_id)
    character_ids, character_names = enter_ids(game_id, version, 'character')
    weapon_ids, weapon_names = enter_ids(game_id, version, 'weapon')
    set_ids, set_names = enter_ids(game_id, version, 'set')
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
    if character_ids:
        json_data = read_json(f"src/lookups/{GAME_LINKS[game_id]}/CHARACTERS.json")
        for ID in character_ids:
            json_data[ID] = fetch_character(game_id, version, ID)
        write_json(f"src/lookups/{GAME_LINKS[game_id]}/CHARACTERS.json", json_data)

    if weapon_ids:
        json_data = read_json(f"src/lookups/{GAME_LINKS[game_id]}/WEAPONS.json")
        for ID in weapon_ids:
            json_data[ID] = fetch_weapon(game_id, version, ID)
        write_json(f"src/lookups/{GAME_LINKS[game_id]}/WEAPONS.json", json_data)

    if set_ids:
        json_data = read_json(f"src/lookups/{GAME_LINKS[game_id]}/SETS.json")
        for ID in set_ids:
            json_data[ID] = fetch_set(game_id, version, ID)
        write_json(f"src/lookups/{GAME_LINKS[game_id]}/SETS.json", json_data)

    print('Update complete')

if __name__ == "__main__":
    main()
