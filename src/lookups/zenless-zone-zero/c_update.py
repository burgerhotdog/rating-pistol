import sys
import argparse
import requests

headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json',
}

prop_name_map = {
    "Base HP": "BASE_HP",
    "Base ATK": "BASE_ATK",
    "Base DEF": "BASE_DEF",
    "HP": "PERCENT_HP",
    "ATK": "PERCENT_ATK",
    "DEF": "PERCENT_DEF",
    "Impact": "BASE_IMPACT",
    "Anomaly Mastery": "BASE_AM",
    "Anomaly Proficiency": "BASE_AP",
    "Base Energy Regen": "BASE_ER",
    "CRIT Rate": "PERCENT_CR",
    "CRIT DMG": "PERCENT_CD",
    "PEN Ratio": "PERCENT_PR",
}

parser = argparse.ArgumentParser(description='Fetch character info from nanoka API')
parser.add_argument('ids', nargs='+', help='One or more character IDs')
args = parser.parse_args()

# Get version
url = 'https://static.nanoka.cc/manifest.json'
response = requests.get(url, headers=headers)
data = response.json()
version = data["zzz"]["live"]

# Parse data and write output
with open('c_new.txt', 'w', encoding='utf-8') as f:
    f.write('\n')
    f.write('  // Version #.#\n')
    for char_id in sorted(args.ids, key=int, reverse=True):
        url = f'https://static.nanoka.cc/zzz/{version}/en/character/{char_id}.json'
        response = requests.get(url, headers=headers)
        data = response.json()

        f.write(f'  {char_id}: {{\n')
        f.write(f"    NAME: '{data['name']}',\n")
        f.write(f"    QUALITY: '{data['rarity'] + 1}',\n")
        f.write(f"    ELEMENT: '{next(iter(data['element_type'].values()))}',\n")
        f.write(f"    TYPE: '{next(iter(data['weapon_type'].values()))}',\n")
        f.write("    SIGNATURE: '00000',\n")

        totals = {}
        f.write('    FIXED_STATS: {\n')
        hp_stat = round(((data['stats']['hp_growth'] / 10000) * 59) + data['stats']['hp_max'] + data['level']['6']['hp_max'], 4)
        totals['BASE_HP'] = hp_stat
        atk_stat = round(((data['stats']['attack_growth'] / 10000) * 59) + data['stats']['attack'] + data['level']['6']['attack'], 4)
        totals['BASE_ATK'] = atk_stat
        def_stat = round(((data['stats']['defence_growth'] / 10000) * 59) + data['stats']['defence'] + data['level']['6']['defence'], 4)
        totals['BASE_DEF'] = def_stat
        impact_stat = data['stats']['break_stun']
        totals['BASE_IMPACT'] = impact_stat
        am_stat = data['stats']['element_abnormal_power']
        totals['BASE_AM'] = am_stat
        ap_stat = data['stats']['element_mystery']
        totals['BASE_AP'] = ap_stat

        for statMap in data['extra_level']['6']['extra'].values():
            extra_name = prop_name_map[statMap['name']]
            if extra_name.startswith('PERCENT'):
                extra_value = statMap['value'] / 10000
            elif extra_name == 'BASE_ER':
                extra_value = statMap['value'] / 100
            else:
                extra_value = statMap['value']
            totals[extra_name] = totals.get(extra_name, 0) + extra_value

        for statKey in totals.keys():
            f.write(f"      {statKey}: {totals[statKey]},\n")
        f.write('    },\n')
        f.write('  },\n')

print('written to c_new.txt')
