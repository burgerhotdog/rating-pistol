import re
import math

lookup_stat_id = {
    11101: 'baseHp',
    11102: 'hp%',
    12101: 'baseAtk',
    12102: 'atk%',
    12201: 'baseImpact',
    13101: 'baseDef',
    13102: 'def%',
    20101: 'critRate%',
    21101: 'critDmg%',
    23101: 'penRatio%',
    23201: 'pen',
    30501: 'baseEnergyRegen',
    31201: 'baseAnomalyProficiency',
    31401: 'baseAnomalyMastery',
}

lookup_stat = {
    'HP': 'hp%',
    'ATK': 'atk%',
    'DEF': 'def%',
    'Impact': 'impact%',
    'Anomaly Mastery': 'anomalyMastery',
    'Anomaly Proficiency': 'anomalyProficiency',
    'Energy Regen': 'energyRegen%',
    'CRIT Rate': 'critRate%',
    'CRIT DMG': 'critDmg%',
    'PEN Ratio': 'penRatio%',
}

def parse_character(version, id, data):
    ascension = {}
    for v in data['extra_level']['6']['extra'].values():
        stat = lookup_stat_id[v['prop']]
        value = v['value']
        if stat.endswith('%'):
            value = round(value / 10000, 4)
        ascension[stat] = value

    return {
        'name': data['name'],
        'version': float(version),
        'id': str(id),
        'quality': int(data['rarity']) + 1,
        'element': next(iter(data['element_type'].values())).lower(),
        'type': next(iter(data['weapon_type'].values())).lower(),
        'baseStats': {
            'baseHp': round(
                data['stats']['hp_growth'] / 10000 * 59
                + data['stats']['hp_max']
                + data['level']['6']['hp_max']
            ),
            'baseAtk': round(
                data['stats']['attack_growth'] / 10000 * 59
                + data['stats']['attack']
                + data['level']['6']['attack']
            ),
            'baseDef': round(
                data['stats']['defence_growth'] / 10000 * 59
                + data['stats']['defence']
                + data['level']['6']['defence']
            ),
            'baseImpact': round(data['stats']['break_stun']),
            'baseAnomalyMastery': round(data['stats']['element_abnormal_power']),
            'baseAnomalyProficiency': round(data['stats']['element_mystery']),
        },
        'ascensionStats': ascension,
        'effects': [],
    }

def parse_actions(data):
    actions = {}
    key_to_id = {
        'basic': 'basic',
        'dodge': 'dodge',
        'assist': 'assist',
        'special': 'special',
        'chain': 'chain',
    }

    for skill_key in ['basic', 'dodge', 'assist', 'special', 'chain']:
        skillData = data['skill'][skill_key]['description']
        skill = {}
        skill_id = key_to_id[skill_key]

        index = 1
        for item in skillData:
            if 'param' not in item:
                continue

            skill_name = item['name']
            midpoint = len(item) // 2
            for action_data in item['param']:
                if 'param' not in action_data:
                    if '{CAL:' not in action_data['desc']:
                        continue

                    match = re.search(r'\{CAL:(.*?)(?:,\d+,\d+)?\}', action_data['desc'])
                    expr = match.group(1)
                    expr = re.sub(r'AvatarSkillLevel\(\d+\)', 'lvl', expr)
                    mult = []

                    for lvl in range(1, 17):
                        value = eval(expr, {'__builtins__': {}}, {'lvl': lvl})
                        mult.append(round(value / 100, 4))

                    skill[str(index)] = {
                        'name': skill_name + ' ' + action_data['name'],
                        'skillType': skill_id,
                        'multipliers': [mult],
                    }

                    index += 1
                    continue

                details = next(iter(action_data['param'].values()))
                base = details['main']
                growth = details['growth']

                mult = {
                    'mv': [round((base + growth * i) / 10000, 4) for i in range(16)]
                }

                if base != details['stun_ratio']:
                    anom = details['attribute_infliction']
                    if anom > 0:
                        mult['anomaly'] = anom

                skill[str(index)] = {
                    'name': skill_name + ' ' + action_data['name'],
                    'skillType': skill_id,
                    'damage': {
                        'multipliers': [mult],
                    },
                }

                index += 1

        actions[skill_id] = skill
    return actions

def parse_weapon(version, id, data):
    stat = lookup_stat[data['rand_property']['name']]
    value = data['rand_property']['value'] * 2.5
    return {
        'name': data['name'],
        'version': float(version),
        'id': str(id),
        'quality': int(data['rarity']) + 1,
        'type': next(iter(data['weapon_type'].values())).lower(),
        'stats': {
            'baseAtk': round(data['base_property']['value'] * 104 / 7),
            stat: value / 10000 if stat.endswith('%') else int(value),
        },
        'effects': [],
    }

def parse_set(version, id, data):
    return {
        'name': data['name'],
        'version': float(version),
        'id': str(id),
        'bonusEffects': {},
    }

def parse_character_data(version, id, data):
    return parse_character(version, id, data), parse_actions(data)

parsers = {
    'character': parse_character_data,
    'weapon': parse_weapon,
    'set': parse_set,
}

def parse_zzz(type, *args):
    return parsers[type](*args)
