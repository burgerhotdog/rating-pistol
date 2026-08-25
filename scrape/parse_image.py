import requests

lookup_url = {
    'gi': {
        'character': lambda _, data: data['icon'],
        'weapon': lambda _, data: data['icon'],
        'set': lambda _, data: data['icon'],
    },
    'hsr': {
        'character': lambda id, _: f'avataricon/avatar/{id}',
        'weapon': lambda id, _: f'lightconemediumicon/{id}',
        'set': lambda _, data: f'itemfigures/{data['icon'][22:data['icon'].rindex('.')]}',
    },
    'ww': {
        'character': lambda _, data: data['icon'][13:data['icon'].rindex('.')],
        'weapon': lambda _, data: data['icon'][13:data['icon'].rindex('.')],
        'set': lambda _, data: data['icon'][13:data['icon'].rindex('.')],
        'echo': lambda _, data: data['icon'][13:data['icon'].rindex('.')],
    },
    'zzz': {
        'character': lambda _, data: data['icon'].replace('IconRole', 'IconRoleSelect', 1),
        'weapon': lambda _, data: data['code_name'],
        'set': lambda _, data: data['icon'][41:data['icon'].rindex('.')],
    },
}

def parse_image(game, type, id, data):
    image_url = lookup_url[game][type](id, data)
    url = f'https://static.nanoka.cc/assets/{game}/{image_url}.webp'
    response = requests.get(url)
    return response.content
