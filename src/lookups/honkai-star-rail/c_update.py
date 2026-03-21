import sys
import argparse
import requests

headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json',
}

prop_name_map = {
    "HPDelta": "FLAT_HP",
    "AttackDelta": "FLAT_ATK",
    "DefenceDelta": "FLAT_DEF",
    "HPAddedRatio": "PERCENT_HP",
    "AttackAddedRatio": "PERCENT_ATK",
    "DefenceAddedRatio": "PERCENT_DEF",
    "CriticalChanceBase": "PERCENT_CR",
    "CriticalChance": "PERCENT_CR",
    "CriticalDamageBase": "PERCENT_CD",
    "CriticalDamage": "PERCENT_CD",
    "StatusProbabilityBase": "PERCENT_EHR",
    "StatusProbability": "PERCENT_EHR",
    "HealRatioBase": "PERCENT_OHB",
    "SpeedDelta": "FLAT_SPD",
    "FireAddedRatio": "PERCENT_FIRE",
    "IceAddedRatio": "PERCENT_ICE",
    "ImaginaryAddedRatio": "PERCENT_IMAGINARY",
    "ThunderAddedRatio": "PERCENT_LIGHTNING",
    "PhysicalAddedRatio": "PERCENT_PHYSICAL",
    "QuantumAddedRatio": "PERCENT_QUANTUM",
    "WindAddedRatio": "PERCENT_WIND",
    "BreakDamageAddedRatioBase": "PERCENT_BE",
    "BreakDamageAddedRatio": "PERCENT_BE",
    "SPRatioBase": "PERCENT_ERR",
    "StatusResistanceBase": "PERCENT_RES",
    "StatusResistance": "PERCENT_RES",
    "ElationDamageAddedRatioBase": "PERCENT_ELATION",
    "ElationDamageAddedRatio": "PERCENT_ELATION",
}

display_order = [
    'PERCENT_HP',
    'PERCENT_ATK',
    'PERCENT_DEF',
    'FLAT_SPD',
    'PERCENT_CR',
    'PERCENT_CD',
    'PERCENT_BE',
    'PERCENT_OHB',
    'PERCENT_ERR',
    'PERCENT_EHR',
    'PERCENT_RES',
    'PERCENT_ELATION',
    'PERCENT_PHYSICAL',
    'PERCENT_FIRE',
    'PERCENT_ICE',
    'PERCENT_LIGHTNING',
    'PERCENT_WIND',
    'PERCENT_QUANTUM',
    'PERCENT_IMAGINARY',
]

parser = argparse.ArgumentParser(description='Fetch character info from Huroka API')
parser.add_argument('ids', nargs='+', help='One or more character IDs')
args = parser.parse_args()

# Parse data and write output
with open('c_new.txt', 'w', encoding='utf-8') as f:
    f.write('\n')
    f.write('  // Version #.#\n')
    for char_id in sorted(args.ids, key=int, reverse=True):
        url = f'https://www.huroka.com/api/avatar/{char_id}'
        response = requests.get(url, headers=headers)
        data = response.json()

        f.write(f'  {char_id}: {{\n')
        f.write(f"    NAME: '{data['name']}',\n")
        f.write(f"    QUALITY: '{data['rarity']}',\n")
        f.write(f"    ELEMENT: '{data['element']}',\n")
        f.write(f"    TYPE: '{data['path']}',\n")
        if (data['rarity'] == 5):
            f.write("    SIGNATURE: '00000',\n")

        base_stats = data['stats']['levels'][12]
        f.write('    FIXED_STATS: {\n')
        f.write(f"      BASE_HP: {base_stats['hp']},\n")
        f.write(f"      BASE_ATK: {base_stats['atk']},\n")
        f.write(f"      BASE_DEF: {base_stats['def']},\n")
        f.write(f"      BASE_SPD: {base_stats['spd']},\n")

        trace_nodes = data['traces']
        minor_traces = {}
        for node in trace_nodes[3:]:
            stat_name = prop_name_map[node['statBonus']['property']]
            minor_traces[stat_name] = minor_traces.get(stat_name, 0) + node['statBonus']['value']

        for stat_id in display_order:
            if stat_id in minor_traces:
                val = round(minor_traces[stat_id], 3)
                f.write(f"      {stat_id}: {int(val) if val.is_integer() else val},\n")
        f.write('    },\n')
        f.write('  },\n')

print('written to c_new.txt')
