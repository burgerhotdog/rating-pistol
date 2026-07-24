import requests

IMAGE_LOCATIONS = {
    "gi": {
        "character": lambda data, _: data["icon"],
        "weapon": lambda data, _: data["icon"],
        "set": lambda data, _: data["icon"],
    },
    "hsr": {
        "character": lambda _, image_id: f"avatarshopicon/{image_id}",
        "weapon": lambda _, image_id: f"lightconemediumicon/{image_id}",
        "set": lambda data, _: f"itemfigures/{data["icon"][22:data["icon"].rindex(".")]}",
    },
    "ww": {
        "character": lambda data, _: data["icon"][13:data["icon"].rindex(".")],
        "weapon": lambda data, _: data["icon"][13:data["icon"].rindex(".")],
        "set": lambda data, _: data["icon"][13:data["icon"].rindex(".")],
        "echo": lambda data, _: data["icon"][13:data["icon"].rindex(".")],
    },
    "zzz": {
        "character": lambda data, _: data["icon"],
        "weapon": lambda data, _: data["code_name"],
        "set": lambda data, _: data["icon"][41:data["icon"].rindex(".")],
    },
}

def parse_image(game, type, data, image_id):
    image_url = IMAGE_LOCATIONS[game][type](data, image_id)

    url = f"https://static.nanoka.cc/assets/{game}/{image_url}.webp"
    response = requests.get(url)

    return response.content