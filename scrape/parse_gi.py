import re
import math

lookup_type = {
    'WEAPON_SWORD_ONE_HAND': 'sword',
    'WEAPON_CLAYMORE': 'claymore',
    'WEAPON_POLE': 'polearm',
    'WEAPON_CATALYST': 'catalyst',
    'WEAPON_BOW': 'bow',
}

lookup_stat = {
    'fight_prop_hp_percent': 'hp%',
    'fight_prop_attack_percent': 'atk%',
    'fight_prop_defense_percent': 'def%',
    'fight_prop_element_mastery': 'elementalMastery',
    'fight_prop_charge_efficiency': 'energyRecharge%',
    'fight_prop_wind_add_hurt': 'anemoDmgBonus%',
    'fight_prop_ice_add_hurt': 'cryoDmgBonus%',
    'fight_prop_grass_add_hurt': 'dendroDmgBonus%',
    'fight_prop_elec_add_hurt': 'electroDmgBonus%',
    'fight_prop_rock_add_hurt': 'geoDmgBonus%',
    'fight_prop_water_add_hurt': 'hydroDmgBonus%',
    'fight_prop_fire_add_hurt': 'pyroDmgBonus%',
    'fight_prop_physical_add_hurt': 'physicalDmgBonus%',
    'fight_prop_critical': 'critRate%',
    'fight_prop_critical_hurt': 'critDmg%',
    'fight_prop_heal_add': 'healingBonus%',
}

def parse_character(version, id, data):
    rawStat, value = list(data['stats_modifier']['ascension'][5].items())[3]
    stat = lookup_stat[rawStat]
    return {
        'name': str(data['name']),
        'version': float(version),
        'id': str(id),
        'quality': 4 if data['rarity'] == 'QUALITY_PURPLE' else 5,
        'element': data['element'].lower(),
        'type': lookup_type[data['weapon']],
        'baseStats': {
            'baseHp': round(
                data['base_hp'] * data['stats_modifier']['hp']['90']
                + data['stats_modifier']['ascension'][5]['fight_prop_base_hp']
            ),
            'baseAtk': round(
                data['base_atk'] * data['stats_modifier']['atk']['90']
                + data['stats_modifier']['ascension'][5]['fight_prop_base_attack']
            ),
            'baseDef': round(
                data['base_def'] * data['stats_modifier']['def']['90']
                + data['stats_modifier']['ascension'][5]['fight_prop_base_defense']
            ),
            **(
                { 'elementalMastery': round(data['elemental_mastery']) }
                if data['elemental_mastery']
                else {}
            ),
        },
        'ascensionStats': {
            stat: value,
        },
        'effects': [],
    }

def parse_actions(data):
    actions = {}
    index_to_id = {
        0: 'normalAttack',
        1: 'elementalSkill',
        2: 'elementalBurst',
        3: 'elementalBurst', # backup in case index 2 is occupied by an alt sprint
    }

    for index, value in enumerate(data['skills']):
        skill_id = index_to_id.get(index)

        promote = {int(k): v for k, v in value['promote'].items()}

        if len(promote) != 15: # skip alt sprint
            continue

        base_desc = promote[0]['desc']
        skill = {}
        action_id = 1

        for desc_string in base_desc:
            param_matches = re.findall(r'\{param(\d+):[^}]+\}', desc_string)
            if not param_matches:
                continue

            indexed_multipliers = []
            for param_str in param_matches:
                param_index = int(param_str) - 1

                indexed_mv = [
                    promote[level]['param'][param_index]
                    for level in range(15)
                ]

                indexed_multipliers.append({ 'mv': indexed_mv })

            skill[str(action_id)] = {
                'name': desc_string.split('|')[0],
                'type': skill_id,
                'damage': {
                    'multipliers': indexed_multipliers,
                },
            }

            action_id += 1

        actions[skill_id] = skill

    return {}

def parse_weapon(version, id, data):
    raw_id, value_map = list(data['stats_modifier'].items())[1]
    stat = lookup_stat[raw_id]
    value = value_map['base'] * value_map['levels']['90']
    return {
        'name': str(data['name']),
        'version': float(version),
        'id': str(id),
        'quality': int(data['rarity']),
        'type': lookup_type[data['weapon_type']],
        'stats': {
            'baseAtk': round(
                data['stats_modifier']['atk']['base'] * data['stats_modifier']['atk']['levels']['90']
                + data['ascension']['6']['fight_prop_base_attack']
            ),
            stat: round(value, 3)
            if stat.endswith('%')
            else int(round(value))
        },
        'effects': [],
    }

def parse_gi(type, version, id, data):
    match type:
        case 'character':
            return parse_character(version, id, data), parse_actions(data)

        case 'weapon':
            return parse_weapon(version, id, data)

        case 'set':
            return {
                'name': str(data['affix'][0]['name']),
                'version': float(version),
                'id': str(id),
                'bonusEffects': {
                    '2': [],
                    '4': [],
                },
            }
