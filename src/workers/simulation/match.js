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

const matchOnCast = (onCast, action) => {
  for (const type of action.cast) {
    if (onCast.includes(type)) return true;
  }

  return false;
};

const matchOnConsidered = (onConsidered, action) => {
  if (!action.considered) return false;

  for (const type of action.considered) {
    if (onConsidered.includes(type)) return true;
  }

  return false;
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

const matchIfField = (ifField, action, activeId) => {
  const isActive = action.ownerId === activeId;
  return ifField === isActive;
};

export const matchIfInflict = (ifInflict, inflictedStatuses) => {
  if (ifInflict === '*') {
    return Boolean(inflictedStatuses.size);
  }

  for (const statusId of ifInflict) {
    if (inflictedStatuses.has(statusId)) return true;
  }

  return false;
};

export const matchApplyOn = (action, effect) => {
  const { applyOnAction, applyOnType, applyOnTagged, applyOnCast, applyOnConsidered } = effect;
  if (!(applyOnAction || applyOnType || applyOnTagged || applyOnCast || applyOnConsidered)) return true;

  if (applyOnAction && matchOnAction(applyOnAction, action)) return true;
  if (applyOnType && matchOnType(applyOnType, action)) return true;
  if (applyOnTagged && matchOnTagged(applyOnTagged, action)) return true;
  if (applyOnCast && matchOnCast(applyOnCast, action)) return true;
  if (applyOnConsidered && matchOnConsidered(applyOnConsidered, action)) return true;

  return false;
};

export const matchRemoveOn = (action, effect) => {
  const { removeOnAction, removeOnType, removeOnTagged, removeOnCast, removeOnConsidered } = effect;

  if (removeOnAction && matchOnAction(removeOnAction, action)) return true;
  if (removeOnType && matchOnType(removeOnType, action)) return true;
  if (removeOnTagged && matchOnTagged(removeOnTagged, action)) return true;
  if (removeOnCast && matchOnCast(removeOnCast, action)) return true;
  if (removeOnConsidered && matchOnConsidered(removeOnConsidered, action)) return true;

  return false;
};

export const matchUseOn = (action, effect) => {
  const { useOnAction, useOnType, useOnTagged, useOnCast, useOnConsidered } = effect;
  if (!(useOnAction || useOnType || useOnTagged || useOnCast || useOnConsidered)) return true;

  if (useOnAction && matchOnAction(useOnAction, action)) return true;
  if (useOnType && matchOnType(useOnType, action)) return true;
  if (useOnTagged && matchOnTagged(useOnTagged, action)) return true;
  if (useOnCast && matchOnCast(useOnCast, action)) return true;
  if (useOnConsidered && matchOnConsidered(useOnConsidered, action)) return true;

  return false;
};

export const matchApplyIf = (action, effect, ctx) => {
  if (!('applyIfType' in effect || 'applyIfStatus' in effect || 'applyIfField' in effect)) return true;

  if ('applyIfType' in effect && matchOnType(effect.applyIfType, action)) return true;
  if ('applyIfStatus' in effect && matchIfStatus(effect.applyIfStatus, ctx.enemyState.status)) return true;
  if ('applyIfField' in effect && matchIfField(effect.applyIfField, action, ctx.activeId)) return true;

  return false;
};

export const matchRemoveIf = (action, effect, ctx) => {
  if ('removeIfStatus' in effect && matchIfStatus(effect.removeIfStatus, ctx.enemyState.status)) return true;
  if ('removeIfField' in effect && matchIfField(effect.removeIfField, action, ctx.activeId)) return true;

  return false;
};

export const matchUseIf = (action, effect, ctx) => {
  if (!('useIfTagged' in effect || 'useIfStatus' in effect || 'useIfAttr' in effect || 'useIfField' in effect)) return true;

  if ('useIfTagged' in effect && matchIfTagged(effect.useIfTagged, toArray(CHARACTER[ctx.cache.gameId][effect.ownerId].tagged))) return true;
  if ('useIfStatus' in effect && matchIfStatus(effect.useIfStatus, ctx.enemyState.status)) return true;
  if ('useIfField' in effect && matchIfField(effect.useIfField, action, ctx.activeId)) return true;
  if ('useIfAttr' in effect && matchIfAttr(effect.useIfAttr, mergeObj(ctx.cache.member[effect.ownerId].baseMap, ctx.equipMapByMember[effect.ownerId]))) return true;

  return false;
};
