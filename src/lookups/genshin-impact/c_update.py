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
}

asc_stat_name_map = {
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

parser = argparse.ArgumentParser(description='Fetch character info from Lunaris API')
parser.add_argument('char_ids', nargs='+', help='One or more character IDs')
args = parser.parse_args()

# Get site version
url = 'https://api.lunaris.moe/data/version.json'
response = requests.get(url, headers=headers)
data = response.json()
version = data["version"]

# Get charlist
url = f'https://api.lunaris.moe/data/{version}/charlist.json'
response = requests.get(url, headers=headers)
data = response.json()

# Validate requested ids
for char_id in args.char_ids:
    if char_id not in data:
        print(f'Error: {char_id} is invalid')
        sys.exit(1)

# Parse data and write output
with open('c_new.txt', 'w', encoding='utf-8') as f:
    f.write('\n')
    f.write('  // Version #.#\n')
    for char_id in sorted(args.char_ids, key=int, reverse=True):
        f.write(f'  {char_id}: {{\n')

        c_data = data[char_id]
        f.write(f"    NAME: '{c_data['enName']}',\n")
        f.write(f"    QUALITY: '{quality_name_map[c_data['qualityType']]}',\n")
        f.write(f"    ELEMENT: '{c_data['element']}',\n")
        f.write(f"    TYPE: '{type_name_map[c_data['weaponType']]}',\n")
        if (c_data['qualityType'] == 'QUALITY_ORANGE'):
            f.write("    SIGNATURE: '00000',\n")

        stats = c_data['ascensionStats']
        f.write('    FIXED_STATS: {\n')
        f.write(f"      BASE_HP: {stats['hp']},\n")
        f.write(f"      BASE_ATK: {stats['atk']},\n")
        f.write(f"      BASE_DEF: {stats['def']},\n")

        extra_stats = [k for k in stats.keys() if k not in {"hp", "atk", "def"}]
        for extra in extra_stats:
            rawStat = stats[extra] if extra == 'Elemental Mastery' else stats[extra] / 100
            rawStat = 315.2 if rawStat == 315 else rawStat
            rawStat = 115.2 if rawStat == 115 else rawStat
            rawStat = 96 if rawStat == 96.0 else rawStat
            rawStat = 0.2668 if rawStat == 0.227 else rawStat
            rawStat = 0.2216 if rawStat == 0.221 else rawStat
            rawStat = 0.288 if rawStat == 0.28800000000000003 else rawStat
            f.write(f"      {asc_stat_name_map[extra]}: {rawStat},\n")
        f.write('    },\n')
        f.write('  },\n')

print('written to c_new.txt')
