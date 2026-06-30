import requests

def parse_image(GAME, data, ID, image_type):
    image_url = GAME["assets"][image_type](data, ID)

    response = requests.get(f"https://static.nanoka.cc/assets/{GAME['link']}/{image_url}.webp")
    with open(f"public/{GAME['id']}/{image_type}/{ID}.webp", "wb") as f:
        f.write(response.content)
