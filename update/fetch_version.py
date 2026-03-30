import requests

data = requests.get('https://static.nanoka.cc/manifest.json').json()

def fetch_version(game_id):
    return data[game_id]['live']
