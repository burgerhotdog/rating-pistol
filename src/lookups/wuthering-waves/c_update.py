import sys
import argparse
import requests

headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json',
    'Referer': 'https://encore.moe/',
}

prop_name_map = {
    'HP+': ['PERCENT_HP', 0.12],
    'HP Up': ['PERCENT_HP', 0.12],
    'ATK+': ['PERCENT_ATK', 0.12],
    'ATK Up': ['PERCENT_ATK', 0.12],
    'DEF+': ['PERCENT_DEF', 0.152],
    'DEF Up': ['PERCENT_DEF', 0.152],
    'Crit. Rate+': ['PERCENT_CR', 0.08],
    'Crit. Rate Up': ['PERCENT_CR', 0.08],
    'Crit. DMG+': ['PERCENT_CD', 0.16],
    'Crit. DMG Up': ['PERCENT_CD', 0.16],
    'Healing Bonus+': ['PERCENT_HB', 0.12],
    'Healing Bonus Up': ['PERCENT_HB', 0.12],
    'Glacio DMG Bonus+': ['PERCENT_GLACIO', 0.12],
    'Glacio DMG Bonus Up': ['PERCENT_GLACIO', 0.12],
    'Fusion DMG Bonus+': ['PERCENT_FUSION', 0.12],
    'Fusion DMG Bonus Up': ['PERCENT_FUSION', 0.12],
    'Electro DMG Bonus+': ['PERCENT_ELECTRO', 0.12],
    'Electro DMG Bonus Up': ['PERCENT_ELECTRO', 0.12],
    'Aero DMG Bonus+': ['PERCENT_AERO', 0.12],
    'Aero DMG Bonus Up': ['PERCENT_AERO', 0.12],
    'Spectro DMG Bonus+': ['PERCENT_SPECTRO', 0.12],
    'Spectro DMG Bonus Up': ['PERCENT_SPECTRO', 0.12],
    'Havoc DMG Bonus+': ['PERCENT_HAVOC', 0.12],
    'Havoc DMG Bonus Up': ['PERCENT_HAVOC', 0.12],
}

parser = argparse.ArgumentParser(description='Fetch character info from encore.moe API')
parser.add_argument('char_ids', nargs='+', help='One or more character IDs')
args = parser.parse_args()

# Parse data and write output
with open('c_new.txt', 'w', encoding='utf-8') as f:
    f.write('\n')
    f.write('  // Version #.#\n')
    for char_id in sorted(args.char_ids, key=int, reverse=True):
        url = f'https://api-v2.encore.moe/api/en/character/{char_id}'
        response = requests.get(url, headers=headers)
        data = response.json()

        f.write(f'  {char_id}: {{\n')
        f.write(f"    NAME: '{data['Name']['Content']}',\n")
        f.write(f"    QUALITY: '{data['QualityId']}',\n")
        f.write(f"    ELEMENT: '{data['ElementName']}',\n")
        f.write(f"    TYPE: '{data['WeaponTypeName']}',\n")
        if (data['QualityId'] == 5):
            f.write("    SIGNATURE: '00000',\n")

        base_stats = data['Properties']
        f.write('    BASE_STATS: {\n')
        f.write(f"      BASE_HP: {round(base_stats[0]['GrowthValues'][95]['value'])},\n")
        f.write(f"      BASE_ATK: {round(base_stats[1]['GrowthValues'][95]['value'])},\n")
        f.write(f"      BASE_DEF: {round(base_stats[2]['GrowthValues'][95]['value'])},\n")
        f.write('    },\n')

        extra_stats = data['SkillTree']
        f.write('    ASCENSION_STATS: {\n')
        rawExtra = extra_stats[1]['PropertyNodeTitle']
        f.write(f"      {prop_name_map[rawExtra][0]}: {prop_name_map[rawExtra][1]},\n")
        rawExtra = extra_stats[0]['PropertyNodeTitle']
        f.write(f"      {prop_name_map[rawExtra][0]}: {prop_name_map[rawExtra][1]},\n")
        f.write('    },\n')
        f.write('  },\n')

print('written to c_new.txt')
