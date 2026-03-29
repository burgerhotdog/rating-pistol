import sys
from update import select_option, fetch_version, enter_ids

GAMES = {
    'Genshin Impact': 'gi',
    'Honkai Star Rail': 'hsr',
    'Wuthering Waves': 'ww',
    'Zenless Zone Zero': 'zzz',
}

ITEM_TYPE_MAP = {
    'gi': 'artifact',
    'hsr': 'relicset',
    'ww': 'echo',
    'zzz': 'equipment',
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
    base_url = f"https://static.nanoka.cc/{game_id}/{version}/"

    # Characters
    has_new_characters = select_option(
        f"Does version {version} include new characters?",
        ['Yes', 'No'],
    )
    if has_new_characters == 'Yes':
        character_ids = enter_ids(base_url, 'character')

    # Weapons
    has_new_weapons = select_option(
        f"Does version {version} include new weapons?",
        ['Yes', 'No'],
    )
    if has_new_weapons == 'Yes':
        weapon_ids = enter_ids(base_url, 'lightcone' if game_id == 'hsr' else 'weapon')
    
    # Sets
    has_new_sets = select_option(
        f"Does version {version} include new sets?",
        ['Yes', 'No'],
    )
    if has_new_sets == 'Yes':
        set_ids = enter_ids(base_url, ITEM_TYPE_MAP.get(game_id))

if __name__ == "__main__":
    main()
