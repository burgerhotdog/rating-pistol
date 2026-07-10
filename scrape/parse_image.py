import requests

IMAGE_LOCATIONS = {
    "genshin-impact": {
        "character": lambda data, _: data["icon"],
        "weapon": lambda data, _: data["icon"],
        "set": lambda data, _: data["icon"],
    },
    "honkai-star-rail": {
        "character": lambda _, image_id: f"avatarshopicon/{image_id}",
        "weapon": lambda _, image_id: f"lightconemediumicon/{image_id}",
        "set": lambda data, _: f"itemfigures/{data["icon"][22:data["icon"].rindex(".")]}",
    },
    "wuthering-waves": {
        "character": lambda data, _: data["icon"][13:data["icon"].rindex(".")],
        "weapon": lambda data, _: data["icon"][13:data["icon"].rindex(".")],
        "set": lambda data, _: data["icon"][13:data["icon"].rindex(".")],
    },
    "zenless-zone-zero": {
        "character": lambda data, _: data["icon"],
        "weapon": lambda data, _: data["code_name"],
        "set": lambda data, _: data["icon"][41:data["icon"].rindex(".")],
    },
}

def make_parse_image(GAME):
    game_id = GAME["id"]
    game_link = GAME["link"]
    image_locs = IMAGE_LOCATIONS[game_id]

    def parse_image(image_type, data, image_id):
        image_url = image_locs[image_type](data, image_id)

        url = f"https://static.nanoka.cc/assets/{game_link}/{image_url}.webp"
        response = requests.get(url)

        path = f"public/{game_id}/{image_type}/{image_id}.webp"
        with open(path, "wb") as f:
            f.write(response.content)

    return parse_image
