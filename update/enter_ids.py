import sys
import requests
from .select_option import select_option

def enter_ids(base_url, id_type):
    data = requests.get(f"{base_url}{id_type}.json").json()

    # Echo uses setId -> key mapping from data[key]["group"] array.
    echo_setid_to_key = None
    echo_details_cache = {}

    if id_type == 'echo':
        echo_setid_to_key = {}
        for key, entry in data.items():
            for set_id in entry.get('group', []):
                echo_setid_to_key[str(set_id)] = key

    def is_invalid_id(ID):
        if id_type == 'echo':
            return ID not in echo_setid_to_key
        return ID not in data

    def get_name(ID):
        if id_type == 'echo':
            key = echo_setid_to_key[ID]

            # Cache request per key so repeated IDs in same group do not refetch.
            if key not in echo_details_cache:
                detail_url = f"{base_url}en/{id_type}/{key}.json"
                echo_details_cache[key] = requests.get(detail_url).json()

            detail = echo_details_cache[key]
            # JSON keys are strings, so ID string lookup is expected.
            return detail["group"][ID]["name"]

        if id_type == "artifact":
            # data[ID]["set"] is a map; take its first value then read name.en
            set_map = data[ID].get("set", {})
            first_set = next(iter(set_map.values()), {})
            return first_set["name"]["en"]

        if id_type == "equipment":
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
