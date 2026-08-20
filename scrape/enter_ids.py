import requests
from .parse_image import parse_image
from .parse_gi import parse_gi
from .parse_hsr import parse_hsr
from .parse_ww import parse_ww
from .parse_zzz import parse_zzz

lang = {
    'gi': {
        'set': 'artifact',
    },
    'hsr': {
        'weapon': 'lightcone',
        'set': 'relicset',
    },
    'ww': {
        'set': 'sonata',
    },
    'zzz': {
        'set': 'equipment',
    },
}

parsers = {
    "gi": parse_gi,
    "hsr": parse_hsr,
    "ww": parse_ww,
    "zzz": parse_zzz,
}

def parse_data(game, *args):
    return parsers[game](*args)

def enter_ids(game, version, type):
    mapped_type = lang[game].get(type, type)
    url_base = f'https://static.nanoka.cc/{game}/{version}/'
    response = requests.get(f'{url_base}{mapped_type}.json').json()

    while True:
        raw_input = input(f'Enter new {type} IDs (separated by space, or press Enter to skip): ')
        if raw_input == '':
            return []

        inputs = raw_input.split()
        invalid_ids = [ID for ID in inputs if ID not in response]
        if not invalid_ids:
            break

        print(f'Invalid IDs: ({", ".join(invalid_ids)}). Please try again.')

    inputs = sorted(inputs, key=int)
    entries = []

    for input_id in inputs:
        print(input_id)
        if mapped_type == 'sonata':
            input_data = response[input_id]
        else:
            input_data = requests.get(f'{url_base}en/{mapped_type}/{input_id}.json').json()

        entries.append((
            input_id,
            parse_image(game, type, input_id, input_data),
            parse_data(game, type, version.partition("+")[0], input_id, input_data),
        ))

    return entries
