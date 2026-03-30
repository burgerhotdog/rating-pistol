import sys
from update import select_option, fetch_version, enter_ids, fetch_character, fetch_weapon
import json

GAMES = {
    'Genshin Impact': 'gi',
    'Honkai Star Rail': 'hsr',
    'Wuthering Waves': 'ww',
    'Zenless Zone Zero': 'zzz',
}

def main():
    game = select_option('Select game to update:', GAMES.keys())
    game_id = GAMES[game]

    # Version
    version = fetch_version(game_id)
    print(f"The current live version is: {version}")
    is_version_correct = select_option('Is this correct?', ['Yes', 'No'])
    if is_version_correct == 'No':
        sys.exit()

    # Characters
    has_new_characters = select_option(
        f"Does version {version} include new characters?",
        ['Yes', 'No'],
    )
    if has_new_characters == 'Yes':
        character_ids = enter_ids(game_id, version, 'character')
        for ID in character_ids:
            scraped = fetch_character(game_id, version, ID)
            print(json.dumps(scraped, indent=2))
            print()
    
    # Weapons
    has_new_weapons = select_option(
        f"Does version {version} include new weapons?",
        ['Yes', 'No'],
    )
    if has_new_weapons == 'Yes':
        weapon_ids = enter_ids(game_id, version, 'weapon')
        for ID in weapon_ids:
            scraped = fetch_weapon(game_id, version, ID)
            print(json.dumps(scraped, indent=2))
            print()
    
    # Sets
    has_new_sets = select_option(
        f"Does version {version} include new sets?",
        ['Yes', 'No'],
    )
    if has_new_sets == 'Yes':
        set_ids = enter_ids(game_id, version, 'set')

if __name__ == "__main__":
    main()
