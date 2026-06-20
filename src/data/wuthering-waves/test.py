import json

INPUT_FILE = "actions.json"
OUTPUT_FILE = "output.json"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

for character in data:
    for skill in character.values():
        if isinstance(skill, dict):
            for entry in skill.values():
                if (
                    isinstance(entry, dict)
                    and entry.get("considered") == entry.get("skillType")
                ):
                    entry.pop("considered", None)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)