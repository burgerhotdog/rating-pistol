import requests

character_url = {
    "gi": lambda data, ID: data["icon"],
    "hsr": lambda data, ID: f"avatarshopicon/{ID}",
    "ww": lambda data, ID: data["icon"][13:data["icon"].rindex(".")],
    "zzz": lambda data, ID: data["icon"],
}

weapon_url = {
    "gi": lambda data, ID: data["icon"],
    "hsr": lambda data, ID: f"lightconemediumicon/{ID}",
    "ww": lambda data, ID: data["icon"][13:data["icon"].rindex(".")],
    "zzz": lambda data, ID: data["code_name"],
}

set_url = {
    "gi": lambda data, ID: data["icon"],
    "hsr": lambda data, ID: f"itemfigures/{data["icon"][22:data['icon'].rindex('.')]}",
    "ww": lambda data, ID: data["icon"][13:data["icon"].rindex(".")],
    "zzz": lambda data, ID: data["icon"][41:data["icon"].rindex(".")],
}

def parse_image(data, game_id, ID, image_type):
    match image_type:
        case 'character':
            image_url = character_url[game_id](data, ID)
        case 'weapon':
            image_url = weapon_url[game_id](data, ID)
        case 'set':
            image_url = set_url[game_id](data, ID)

    response = requests.get(f"https://static.nanoka.cc/assets/{game_id}/{image_url}.webp")
    with open(f"src/assets/{image_type}/{game_id}/{ID}.webp", "wb") as f:
        f.write(response.content)
