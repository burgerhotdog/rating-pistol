import json, shutil

def get_path(dirname, filename):
    return f'src/data/{dirname}/{filename}'

def modify(data):
    for entry in data.values():
        print(entry['id'])

    return True

GAMES_TO_MODIFY = [
    'genshin-impact',
    'honkai-star-rail',
    'wuthering-waves',
    'zenless-zone-zero',
]

FILES_TO_MODIFY = [
    'character.json',
]

def main():
    for dirname in GAMES_TO_MODIFY:
        for filename in FILES_TO_MODIFY:
            path = get_path(dirname, filename)
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            was_changed = modify(data)
            if was_changed:
                shutil.copy2(path, f'{path}.bak')
                with open(path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)

            print(f'{path} changed?: {was_changed}')

if __name__ == '__main__':
    main()
