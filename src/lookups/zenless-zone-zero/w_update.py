import sys
import argparse
import requests

headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json',
}

weapon_level_map = {
    32: 475,
    40: 594,
    42: 624,
    46: 684,
    48: 713,
    50: 743,
}

prop_name_map = {
    "HP": "PERCENT_HP",
    "ATK": "PERCENT_ATK",
    "DEF": "PERCENT_DEF",
    "Impact": "PERCENT_IMPACT",
    "Anomaly Mastery": "PERCENT_AM",
    "Anomaly Proficiency": "FLAT_AP",
    "Energy Regen": "PERCENT_ER",
    "CRIT Rate": "PERCENT_CR",
    "CRIT DMG": "PERCENT_CD",
    "PEN Ratio": "PERCENT_PR",
}

parser = argparse.ArgumentParser(description='Fetch weapon info from nanoka API')
parser.add_argument('ids', nargs='+', help='One or more weapon IDs')
args = parser.parse_args()

# Get version
url = 'https://static.nanoka.cc/manifest.json'
response = requests.get(url, headers=headers)
data = response.json()
version = data["zzz"]["live"]

# Parse data and write output
with open('w_new.txt', 'w', encoding='utf-8') as f:
    f.write('\n')
    f.write('  // Version #.#\n')
    for weapon_id in sorted(args.ids, key=int, reverse=True):
        url = f'https://static.nanoka.cc/zzz/{version}/en/weapon/{weapon_id}.json'
        response = requests.get(url, headers=headers)
        data = response.json()

        f.write(f'  {weapon_id}: {{\n')
        f.write(f"    NAME: '{data['name']}',\n")
        f.write(f"    QUALITY: '{data['rarity'] + 1}',\n")
        f.write(f"    TYPE: '{next(iter(data['weapon_type'].values()))}',\n")

        totals = {}
        f.write('    FIXED_STATS: {\n')
        atk_stat = weapon_level_map[data['base_property']['value']]
        totals['BASE_ATK'] = atk_stat
        main_stat_name = prop_name_map[data['rand_property']['name']]
        if main_stat_name.startswith('FLAT'):
            main_stat_value = round(data['rand_property']['value'] * 2.5)
        else:
            main_stat_value = round((data['rand_property']['value'] / 10000) * 2.5, 3)
        totals[main_stat_name] = main_stat_value

        for statKey in totals.keys():
            f.write(f"      {statKey}: {totals[statKey]},\n")
        f.write('    },\n')
        f.write('  },\n')

print('written to w_new.txt')
