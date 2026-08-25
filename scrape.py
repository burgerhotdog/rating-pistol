import argparse, requests, sys, json
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

    save_version(game, version.partition("+")[0])
    print('Update complete')

def temp():
    with open('src/data/honkai-star-rail/character.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        for id in data.keys():
            print(id)
            image = requests.get(f'https://static.nanoka.cc/assets/hsr/avataricon/avatar/{id}.webp').content
            with open(f'public/honkai-star-rail/character2/{id}.webp', 'wb') as f:
                f.write(image)

    with open('src/data/zenless-zone-zero/character.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        for id in data.keys():
            print(id)
            response = requests.get(f'https://static.nanoka.cc/zzz/3.2.3+18283617/en/character/{id}.json').json()
            image_url = response['icon'].replace('IconRole', 'IconRoleSelect', 1)
            image = requests.get(f'https://static.nanoka.cc/assets/zzz/{image_url}.webp').content
            with open(f'public/zenless-zone-zero/character2/{id}.webp', 'wb') as f:
                f.write(image)

if __name__ == '__main__':
    main()
