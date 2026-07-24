def parse_set(game, version, id, data):
    return {
        "name": data["name"] if game != "gi" else data["affix"][0]["name"],
        "id": int(id),
        "version": version,
        "bonusEffects": {},
    }
