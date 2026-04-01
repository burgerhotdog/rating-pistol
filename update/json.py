import json, os

def read_json(path):
    with open(path, "r") as f:
        return json.load(f)

def write_json(path, data):
    tmp_path = path + ".tmp"
    with open(tmp_path, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp_path, path)
