import argparse, requests, sys
from scrape import enter_ids, save_data, save_version

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('game', choices=['gi', 'hsr', 'ww', 'zzz'], help='Game')
    args = parser.parse_args()
    game = args.game

    manifest = requests.get('https://static.nanoka.cc/manifest.json').json()
    version = manifest[game]['live']
    characters = enter_ids(game, version, 'character')
    weapons = enter_ids(game, version, 'weapon')
    sets = enter_ids(game, version, 'set')
    echoes = enter_ids(game, version, 'echo') if game == 'ww' else []
    print()

    print(f'Version {version} update summary')
    if characters:
        names = [character['name'] for _, _, character in characters]
        print(f'New characters: {", ".join(names)}')
    if weapons:
        names = [weapon['name'] for _, _, weapon in weapons]
        print(f'New weapons: {", ".join(names)}')
    if sets:
        names = [set['name'] for _, _, set in sets]
        print(f'New sets: {", ".join(names)}')
    if echoes:
        names = [echo['name'] for _, _, echo in echoes]
        print(f'New echoes: {", ".join(names)}')
    print()

    while True:
        continue_update = input('Continue? (y/n): ')
        match continue_update:
            case 'n':
                print('Update cancelled.')
                sys.exit()
            case 'y':
                break
        print('Invalid input. Please try again.')
    print()

    if characters:
        save_data(game, 'character', characters)
    if weapons:
        save_data(game, 'weapon', weapons)
    if sets:
        save_data(game, 'set', sets)
    if echoes:
        save_data(game, 'echo', echoes)

    save_version(game, version)
    print('Update complete')

if __name__ == '__main__':
    main()
