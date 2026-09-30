import { pick } from '../../../common.js';

const elements = [
  'glacio',
  'fusion',
  'electro',
  'aero',
  'spectro',
  'havoc',
];

export function parseEcho(id, data) {
  const actions = Object.values(data.skill.damage).map((v) => {
    const action = {
      name: `Echo Skill: ${data.name}`,
      type: 'echoSkill',
      
    };

    if (v.related_property.toLowerCase() !== 'atk') {
      action.attr = v.related_property.toLowerCase();
    }

    if (v.rate_lv.length > 4) {
      action.damage = {
        element: v.element === 0 ? 'physical' : elements[v.element - 1],
        multipliers: [
          {
            mv: v.rate_lv[4] / 10000,
          },
        ],
      };
    }

    if (data.skill.desc.startsWith('Summon')) {
      action.duration = 0;
    }

    return action;
  });

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `wuthering-waves/echo/${id}.webp`,
    sets: Object.keys(data.group).map(Number),
    cost: pick({ 0: 1, 1: 3, 2: 4, 3: 4 }, data.intensity_code),
    effects: [],
    action: actions,
  };
}
