import sys
import argparse
import requests

headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json',
    'Referer': 'https://encore.moe/',
}

prop_name_map = {
    'HP': 'PERCENT_HP',
    'ATK': 'PERCENT_ATK',
    'DEF': 'PERCENT_DEF',
    'Crit. Rate': 'PERCENT_CR',
    'Crit. DMG': 'PERCENT_CD',
    'Energy Regen': 'PERCENT_ER',
}

parser = argparse.ArgumentParser(description='Fetch character info from encore.moe API')
parser.add_argument('weapon_ids', nargs='+', help='One or more weapon IDs')
args = parser.parse_args()

# Parse data and write output
with open('w_new.txt', 'w', encoding='utf-8') as f:
    f.write('\n')
    f.write('  // Version #.#\n')
    for weapon_id in sorted(args.weapon_ids, key=int, reverse=True):
        url = f'https://api-v2.encore.moe/api/en/weapon/{weapon_id}'
        response = requests.get(url, headers=headers)
        data = response.json()

        f.write(f'  {weapon_id}: {{\n')
        f.write(f"    NAME: '{data['WeaponName']}',\n")
        f.write(f"    QUALITY: '{data['QualityId']}',\n")
        f.write(f"    TYPE: '{data['WeaponTypeName']}',\n")

        base_stats = data['Properties']
        f.write('    BASE_STATS: {\n')
        f.write(f"      BASE_ATK: {base_stats[0]['GrowthValues'][95]['Value'].split('.')[0]},\n")
        f.write('    },\n')

        f.write('    MAIN_STAT: {\n')
        f.write(f"      {prop_name_map[base_stats[1]['Name']]}: {round((float(base_stats[1]['GrowthValues'][95]['Value'].rstrip('%'))) * 10) / 1000},\n")
        f.write('    },\n')
        f.write('  },\n')

print('written to c_new.txt')
