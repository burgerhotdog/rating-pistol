import requests

url = 'https://static.nanoka.cc/manifest.json'

def fetch_version(game_id):
    response = requests.get(url)
    data = response.json()
    return data[game_id]['live']
