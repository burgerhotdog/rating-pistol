import sys
import argparse
import requests

headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json',
    'Referer': 'https://gi.lunaris.moe/',
}

type_name_map = {
    'WEAPON_BOW': 'Bow',
    'WEAPON_CATALYST': 'Catalyst',
    'WEAPON_CLAYMORE': 'Claymore',
    'WEAPON_POLE': 'Polearm',
    'WEAPON_SWORD_ONE_HAND': 'Sword'
}

quality_name_map = {
    'QUALITY_ORANGE': '5',
    'QUALITY_PURPLE': '4',
    'QUALITY_BLUE': '3',
    'QUALITY_GREEN': '2',
}

stat_name_map = {
    'HP%': 'PERCENT_HP',
    'ATK%': 'PERCENT_ATK',
    'DEF%': 'PERCENT_DEF',
    'Elemental Mastery': 'FLAT_EM',
    'CRIT Rate%': 'PERCENT_CR',
    'CRIT DMG%': 'PERCENT_CD',
    'Healing Bonus%': 'PERCENT_HB',
    'Energy Recharge%': 'PERCENT_ER',
    'Pyro DMG Bonus%': 'PERCENT_PYRO',
    'Hydro DMG Bonus%': 'PERCENT_HYDRO',
    'Dendro DMG Bonus%': 'PERCENT_DENDRO',
    'Electro DMG Bonus%': 'PERCENT_ELECTRO',
    'Anemo DMG Bonus%': 'PERCENT_ANEMO',
    'Cryo DMG Bonus%': 'PERCENT_CRYO',
    'Geo DMG Bonus%': 'PERCENT_GEO',
    'Physical DMG Bonus%': 'PERCENT_PHYSICAL',
}

parser = argparse.ArgumentParser(description='Fetch weapon info from Lunaris API')
parser.add_argument('weapon_ids', nargs='+', help='One or more weapon IDs')
args = parser.parse_args()

# Get site version
url = 'https://api.lunaris.moe/data/version.json'
response = requests.get(url, headers=headers)
data = response.json()
version = data["version"]

# Get weaponlist
url = f'https://api.lunaris.moe/data/{version}/weaponlist.json'
response = requests.get(url, headers=headers)
data = response.json()

# Validate requested ids
for weapon_id in args.weapon_ids:
    if weapon_id not in data:
        print(f'Error: {weapon_id} is invalid')
        sys.exit(1)

# Parse data and write output
with open('w_new.txt', 'w', encoding='utf-8') as f:
    f.write('\n')
    f.write('  // Version #.#\n')
    for weapon_id in sorted(args.weapon_ids, key=int, reverse=True):
        f.write(f"  {weapon_id}: {{\n")

        w_data = data[weapon_id]
        f.write(f"    NAME: '{w_data['enName']}',\n")
        f.write(f"    QUALITY: '{quality_name_map[w_data['qualityType']]}',\n")
        f.write(f"    TYPE: '{type_name_map[w_data['weaponType']]}',\n")

        stats = w_data['ascensionStats']
        f.write('    FIXED_STATS: {\n')
        f.write(f"      BASE_ATK: {stats['atk']},\n")

        if (w_data['qualityType'] != 'QUALITY_GREEN'):
            extra = next(k for k in stats.keys() if k not in {"hp", "atk", "def"})
            rawStat = stats[extra] if extra == 'Elemental Mastery' else stats[extra] / 100
            rawStat = 0.459 if rawStat == 0.45899999999999996 else rawStat
            rawStat = 0.352 if rawStat == 0.35200000000000004 else rawStat
            rawStat = 0.234 if rawStat == 0.23399999999999999 else rawStat
            rawStat = 0.827 if rawStat == 0.8270000000000001 else rawStat
            f.write(f"      {stat_name_map[extra]}: {rawStat},\n")
        f.write('    },\n')
        f.write('  },\n')

print('written to w_new.txt')
