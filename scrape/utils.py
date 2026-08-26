import json, os

def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(path, data):
    tmp_path = path + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp_path, path)

def merge_dict(curr, new):
    for key, value in new.items():
        if key not in curr:
            curr[key] = value
            continue

        curr_value = curr[key]

        if not isinstance(curr_value, type(value)):
            curr[key] = value
        elif isinstance(curr_value, dict):
            merge_dict(curr_value, value)
        elif isinstance(curr_value, list):
            curr_value.extend(value)
        else:
            curr[key] = value

def merge_entry(json_obj, id, entry):
    curr = json_obj.setdefault(id, {})
    merge_dict(curr, entry)

def sorted_json(entries):
    return dict(sorted(
        entries.items(),
        key=lambda entry: int(entry[0]),
    ))

game_ids = {
    "gi": "genshin-impact",
    "hsr": "honkai-star-rail",
    "ww": "wuthering-waves",
    "zzz": "zenless-zone-zero",
}

def save_data(game, type, entries):
    game_id = game_ids[game]

    path = f"src/data/{game_id}/{type}.json"
    data = read_json(path)

    for id, image, entry in entries:
        with open(f"public/{game_id}/{type}/{id}.webp", "wb") as f:
            f.write(image)
        merge_entry(data, id, entry)

    write_json(path, sorted_json(data))

def save_version(game, version):
    data = read_json("src/data/version.json")
    game_id = game_ids[game]
    data[game_id] = str(version)
    write_json(f"src/data/version.json", data)
