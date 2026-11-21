import { getCompressed } from '@/utils';

const parts = ['damage', 'healing', 'shield'];

export function updateSkillLevelAction(action, charSkills, skillId, mvIndex) {
  if (action.category !== skillId) return;

  const rawAction = charSkills[skillId].actions[action.index];

  for (const part of parts) {
    const actionPart = action[part];
    const rawPartDef = rawAction?.[part];
    if (!actionPart || !rawPartDef) continue;

    actionPart.compressed = getCompressed(
      rawPartDef.multipliers,
      rawPartDef.attr ?? 'atk',
      { index: mvIndex },
    );
  }

  if (action.health) {
    const rawHealthDef = rawAction?.health;
    if (!rawHealthDef) return;

    if (Array.isArray(rawHealthDef.value) && rawHealthDef.value.length !== 2) {
      action.health.value = rawHealthDef.value[mvIndex];
    }
  }

  if (action.bondOfLife) {
    const rawBondOfLifeDef = rawAction?.bondOfLife;
    if (!rawBondOfLifeDef) return;

    if (Array.isArray(rawBondOfLifeDef) && rawBondOfLifeDef.length !== 2) {
      action.bondOfLife = rawBondOfLifeDef[mvIndex];
    }
  }
}

export function getSkillLevelRotations(member, charSkills, skillId, mvIndex) {
  const rotations = {};

  for (const key of ['rotation', 'rotationAlt', 'rotationInit']) {
    if (!Object.hasOwn(member, key)) continue;

    const rotation = rotations[key] = structuredClone(member[key]);
    for (const action of rotation) {
      updateSkillLevelAction(action, charSkills, skillId, mvIndex);
    }
  }

  return rotations;
}
