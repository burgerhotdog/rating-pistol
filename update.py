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
    scraped_character_entries = []
    if has_new_characters == 'Yes':
        character_ids = enter_ids(game_id, version, 'character')
        for ID in character_ids:
            scraped = fetch_character(game_id, version, ID)
            scraped_character_entries.append([ID, scraped])
            print(json.dumps(scraped, indent=2))
            print()
    
    # Weapons
    has_new_weapons = select_option(
        f"Does version {version} include new weapons?",
        ['Yes', 'No'],
    )
    scraped_weapon_entries = []
    if has_new_weapons == 'Yes':
        weapon_ids = enter_ids(game_id, version, 'weapon')
        for ID in weapon_ids:
            scraped = fetch_weapon(game_id, version, ID)
            scraped_weapon_entries.append([ID, scraped])
            print(json.dumps(scraped, indent=2))
            print()
    
    # Sets
    has_new_sets = select_option(
        f"Does version {version} include new sets?",
        ['Yes', 'No'],
    )
    scraped_set_entries = []
    if has_new_sets == 'Yes':
        set_ids = enter_ids(game_id, version, 'set')

    # Finalizing
    print('Summary:')
    if scraped_character_entries:
        print('New characters:')
        for ID, scraped in scraped_character_entries:
            print(scraped['NAME'])
    if scraped_weapon_entries:
        print('New weapons:')
        for ID, scraped in scraped_weapon_entries:
            print(scraped['NAME'])
    if scraped_set_entries:
        print('New sets:')
        for ID, scraped in scraped_set_entries:
            print(scraped['NAME'])
    is_finalized = select_option(
        f"Does this look correct?",
        ['Yes', 'No'],
    )

    if is_finalized == 'No':
        sys.exit()

    if scraped_character_entries:
        original_json = read_json(f"src/lookups/{GAME_LINKS[game_id]}/CHARACTERS.json")
        for ID, scraped in scraped_character_entries:
            original_json = {**{ID: scraped}, **original_json}
        write_json(f"src/lookups/{GAME_LINKS[game_id]}/CHARACTERS.json", original_json)

    print('Update complete')

if __name__ == "__main__":
    main()
