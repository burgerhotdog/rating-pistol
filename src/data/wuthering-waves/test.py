import json

FILE_PATH = "copy.json"

# Read JSON
with open(FILE_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Modify JSON
for entry in data.values():
    for key, value in list(entry.items()):
        # Skip already-converted objects
        if not (
            isinstance(value, dict)
            and "name" in value
            and "skills" in value
        ):
            continue

        parent_name = value["name"]
        skills = value["skills"]

        # Add missing skill names
        for skill_key, skill_value in list(skills.items()):
            if (
                isinstance(skill_value, dict)
                and "name" not in skill_value
            ):
                skills[skill_key] = {
                    "name": parent_name,
                    **skill_value,
                }

        # Replace parent object with skills map
        entry[key] = skills

# Overwrite original file
with open(FILE_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("JSON updated.")