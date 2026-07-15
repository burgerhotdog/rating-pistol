def parse_set(game_id, version, data):
    return {
        "name": data["name"] if game_id != "genshin-impact" else data["affix"][0]["name"],
        "version": version,
        "tieredEffects": {},
    }
