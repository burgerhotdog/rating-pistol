import sys
import requests
from .select_option import select_option
from .maps import ID_TYPE_MAP

def enter_ids(game_id, version, id_type):
    mapped_id_type = ID_TYPE_MAP.get(game_id, {}).get(id_type, id_type)
    url = f"https://static.nanoka.cc/{game_id}/{version}/{mapped_id_type}.json"
    data = requests.get(url).json()

    # Echo uses setId -> key mapping from data[key]["group"] array.
    echo_setid_to_key = None
    echo_details_cache = {}

    if mapped_id_type == 'echo':
        echo_setid_to_key = {}
        for key, entry in data.items():
            for set_id in entry.get('group', []):
                echo_setid_to_key[str(set_id)] = key

    def is_invalid_id(ID):
        if mapped_id_type == 'echo':
            return ID not in echo_setid_to_key
        return ID not in data

    def get_name(ID):
        if mapped_id_type == 'echo':
            key = echo_setid_to_key[ID]

            # Cache request per key so repeated IDs in same group do not refetch.
            if key not in echo_details_cache:
                detail_url = f"https://static.nanoka.cc/ww/{version}/en/echo/{key}.json"
                echo_details_cache[key] = requests.get(detail_url).json()

            detail = echo_details_cache[key]
            # JSON keys are strings, so ID string lookup is expected.
            return detail["group"][ID]["name"]

        if mapped_id_type == "artifact":
            # data[ID]["set"] is a map; take its first value then read name.en
            set_map = data[ID].get("set", {})
            first_set = next(iter(set_map.values()), {})
            return first_set["name"]["en"]

        if mapped_id_type == "equipment":
            return data[ID]["en"]["name"]

        # Default behavior
        return data[ID]["en"]

    while True:
        input_str = input(f"Enter new {id_type} IDs (space-separated): ")
        if input_str == 'q':
            sys.exit()

        id_list = input_str.split()
    
        invalid_ids = [ID for ID in id_list if is_invalid_id(ID)]
        if invalid_ids:
            print(f"Invalid IDs: ({', '.join(invalid_ids)}). Please try again.")
            continue

        id_list = sorted(id_list, key=int, reverse=True)

        id_names = [get_name(ID) for ID in id_list]
        print("You entered:")
        for ID, name in zip(id_list, id_names):
            print(f"{ID}: {name}")
        print()
        
        is_list_correct = select_option(
            'Is this list correct?',
            ['Yes', 'No'],
        )
        if is_list_correct == 'No':
            continue

        return id_list
