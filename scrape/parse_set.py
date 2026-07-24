def parse_set(game, version, id, data):
    if game == "gi":
        name = data["affix"][0]["name"]
        bonus_effects = {}
    elif game == "ww":
        name = data["name"]["en"]
        bonus_effects = {}
        for key in data["set"].keys():
            bonus_effects[key] = []
    else:
        name = data["name"]
        bonus_effects = {}

    return {
        "name": name,
        "id": int(id),
        "version": float(version),
        "bonusEffects": bonus_effects,
    }
