def parse_set(game_id, set_id, data):
    return {
        "id": set_id,
        "name": data["name"] if game_id != "genshin-impact" else data["affix"][0]["name"],
        "tieredEffects": {},
    }
