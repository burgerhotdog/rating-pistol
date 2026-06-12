const matchOnAction = (onAction, action) => {
  return onAction.includes(action.key);
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

const matchIfStatus = (ifStatus, effectTrackers) => {
  if (ifStatus.includes('any')) {
    return Boolean(Object.keys(effectTrackers.enemyStatuses).length);
  }
  
  for (const statusId of ifStatus) {
    if (effectTrackers.enemyStatuses[statusId]) return true;
  }
  return false;
}

const matchIfState = (ifState, action, activeId) => {
  const isActive = action.ownerId === activeId;

  if (ifState === 'active' && !isActive) return false;
  if (ifState === 'inactive' && isActive) return false;
  return true;
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
  const { applyIfStatus, applyIfState } = effect;
  if (!(applyIfStatus || applyIfState)) return true;

  if (applyIfStatus && matchIfStatus(applyIfStatus, ctx.effectTrackers)) return true;
  if (applyIfState && matchIfState(applyIfState, action, ctx.activeId)) return true;

  return false;
};

export const matchRemoveIf = (action, effect, ctx) => {
  const { removeIfStatus, removeIfState } = effect;

  if (removeIfStatus && matchIfStatus(removeIfStatus, ctx.effectTrackers)) return true;
  if (removeIfState && matchIfState(removeIfState, action, ctx.activeId)) return true;

  return false;
};

export const matchUseIf = (action, effect, ctx) => {
  const { useIfStatus, useIfState } = effect;
  if (!(useIfStatus || useIfState)) return true;

  if (useIfStatus && matchIfStatus(useIfStatus, ctx.effectTrackers)) return true;
  if (useIfState && matchIfState(useIfState, action, ctx.activeId)) return true;

  return false;
};
