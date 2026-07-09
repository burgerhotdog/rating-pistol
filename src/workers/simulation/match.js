import { CHARACTER } from '@/data';
import { toArray, mergeObj, getAttr } from '@/utils';

const matchOnAction = (onAction, action) => {
  for (const key of onAction) {
    if (key.indexOf(':') === -1) {
      if (key === action.short) return true;
    } else {
      if (key === action.key) return true;
    }
  }

  return false;
};

const matchOnType = (onType, action) => {
  return onType.includes(action.type);
};

const matchOnTagged = (onTagged, action) => {
  for (const tag of action.tagged) {
    if (onTagged.includes(tag)) return true;
  }

  return false;
};

const matchOnSkillType = (onSkillType, action) => {
  const { skillType, extraSkillType } = action;
  return onSkillType.includes(skillType) || onSkillType.includes(extraSkillType);
};

const matchOnDmgType = (onDmgType, action) => {
  const { dmgType, extraDmgType } = action;
  return onDmgType.includes(dmgType) || onDmgType.includes(extraDmgType);
};

const matchOnElement = (onElement, elements) => {
  for (const element of elements) {
    if (onElement.includes(element)) return true;
  }

  return false;
};

const matchIfWeapon = (ifWeapon, weaponType) => {
  return ifWeapon.includes(weaponType);
};

const matchIfTagged = (ifTagged, tagged) => {
  if (!tagged) return false;

  for (const tag of ifTagged) {
    if (tagged.includes(tag)) {
      return true;
    }
  }

  return false;
};

const matchIfStatus = (ifStatus, stateMap) => {
  if (ifStatus === '*') {
    return Boolean(Object.keys(stateMap).length);
  }
  
  for (const statusId in ifStatus) {
    if (!stateMap[statusId]) continue;
    const requiredStacks = ifStatus[statusId];

    if (stateMap[statusId].stacks >= requiredStacks) {
      return true;
    }
  }

  return false;
}

const matchIfAttr = (ifAttr, statMap) => {
  for (const attr in ifAttr) {
    const requiredValue = ifAttr[attr];

    if (getAttr(attr, statMap) >= requiredValue) {
      return true;
    }
  }

  return false;
};

const matchIfField = (ifField, memberId, activeId) => {
  const isActive = memberId === activeId;
  return ifField === isActive;
};

const matchIfElement = (ifElement, element) => {
  return ifElement.includes(element);
}

export const matchIfInflict = (ifInflict, inflictedStatuses) => {
  if (ifInflict === '*') {
    return inflictedStatuses.length;
  }

  for (const statusId of ifInflict) {
    if (inflictedStatuses.includes(statusId)) {
      return true;
    }
  }

  return false;
};

export const matchApplyOn = (action, effect) => {
  const { applyOnAction, applyOnType, applyOnTagged, applyOnSkillType, applyOnDmgType } = effect;
  if (!(applyOnAction || applyOnType || applyOnTagged || applyOnSkillType || applyOnDmgType)) return true;

  if (applyOnAction && matchOnAction(applyOnAction, action)) return true;
  if (applyOnType && matchOnType(applyOnType, action)) return true;
  if (applyOnTagged && matchOnTagged(applyOnTagged, action)) return true;
  if (applyOnSkillType && matchOnSkillType(applyOnSkillType, action)) return true;
  if (applyOnDmgType && matchOnDmgType(applyOnDmgType, action)) return true;

  return false;
};

export const matchRemoveOn = (action, effect) => {
  const { removeOnAction, removeOnType, removeOnTagged, removeOnSkillType, removeOnDmgType } = effect;

  if (removeOnAction && matchOnAction(removeOnAction, action)) return true;
  if (removeOnType && matchOnType(removeOnType, action)) return true;
  if (removeOnTagged && matchOnTagged(removeOnTagged, action)) return true;
  if (removeOnSkillType && matchOnSkillType(removeOnSkillType, action)) return true;
  if (removeOnDmgType && matchOnDmgType(removeOnDmgType, action)) return true;

  return false;
};

export const matchUseOn = (effect, action) => {
  const { useOnAction, useOnType, useOnTagged, useOnSkillType, useOnDmgType, useOnElement } = effect;
  if (!(
    useOnAction ||
    useOnType ||
    useOnTagged ||
    useOnSkillType ||
    useOnDmgType ||
    useOnElement
  )) return true;

  if (!action) return false;

  if (useOnAction && matchOnAction(useOnAction, action)) return true;
  if (useOnType && matchOnType(useOnType, action)) return true;
  if (useOnTagged && matchOnTagged(useOnTagged, action)) return true;
  if (useOnSkillType && matchOnSkillType(useOnSkillType, action)) return true;
  if (useOnDmgType && matchOnDmgType(useOnDmgType, action)) return true;
  if (useOnElement && matchOnElement(useOnElement, action.compressed.keys()))

  return false;
};

const matchIfShift = (ifShift, shiftTune) => {
  return ifShift === shiftTune;
};

export const matchApplyIf = (action, effect, ctx) => {
  if (!(
    'applyIfWeapon' in effect ||
    'applyIfType' in effect ||
    'applyIfStatus' in effect ||
    'applyIfField' in effect ||
    'applyIfShift' in effect
  )) return true;

  if ('applyIfWeapon' in effect && matchIfWeapon(effect.applyIfWeapon, CHARACTER[ctx.cache.gameId][effect.ownerId].type)) return true;
  if ('applyIfType' in effect && matchOnType(effect.applyIfType, action)) return true;
  if ('applyIfStatus' in effect && matchIfStatus(effect.applyIfStatus, ctx.state.negativeStatuses)) return true;
  if ('applyIfField' in effect && matchIfField(effect.applyIfField, action.ownerId, ctx.activeId)) return true;
  if ('applyIfShift' in effect && matchIfShift(effect.applyIfShift, action.shiftTune)) return true;

  return false;
};

export const matchRemoveIf = (action, effect, ctx) => {
  if ('removeIfStatus' in effect && matchIfStatus(effect.removeIfStatus, ctx.state.negativeStatuses)) return true;
  if ('removeIfField' in effect && matchIfField(effect.removeIfField, action.ownerId, ctx.activeId)) return true;

  return false;
};

const matchIfShifting = (ifShifting, offTuneState) => {
  return ifShifting.includes(offTuneState.shifting);
};

const matchIfInterfered = (ifInterfered, offTuneState) => {
  return ifInterfered.includes(offTuneState.interfered);
};

export const matchUseIf = (effect, memberId, ctx) => {
  if (!(
    'useIfWeapon' in effect ||
    'useIfTagged' in effect ||
    'useIfStatus' in effect ||
    'useIfAttr' in effect ||
    'useIfField' in effect ||
    'useIfElement' in effect ||
    'useIfShifting' in effect ||
    'useIfInterfered' in effect
  )) return true;

  if ('useIfWeapon' in effect && matchIfWeapon(effect.useIfWeapon, CHARACTER[ctx.cache.gameId][effect.ownerId].type)) return true;
  if ('useIfTagged' in effect && matchIfTagged(effect.useIfTagged, toArray(CHARACTER[ctx.cache.gameId][effect.ownerId].tagged))) return true;
  if ('useIfStatus' in effect && matchIfStatus(effect.useIfStatus, ctx.state.negativeStatuses)) return true;
  if ('useIfField' in effect && matchIfField(effect.useIfField, memberId, ctx.activeId)) return true;
  if ('useIfAttr' in effect && matchIfAttr(effect.useIfAttr, mergeObj(ctx.cache.member[effect.ownerId].baseMap, ctx.equipMaps[effect.ownerId]))) return true;
  if ('useIfElement' in effect && matchIfElement(effect.useIfElement, CHARACTER[ctx.cache.gameId][effect.ownerId].element)) return true;
  if ('useIfShifting' in effect && matchIfShifting(effect.useIfShifting, ctx.offTuneState)) return true;
  if ('useIfInterfered' in effect && matchIfInterfered(effect.useIfInterfered, ctx.offTuneState)) return true;

  return false;
};
