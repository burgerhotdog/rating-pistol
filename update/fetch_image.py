import requests

def fetch_image(game_id, character_id, image_url):
    response = requests.get(f"https://static.nanoka.cc/assets/{game_id}/{image_url}.webp")
    with open(f"src/assets/avatar/{game_id}/{character_id}.webp", "wb") as f:
        f.write(response.content)
