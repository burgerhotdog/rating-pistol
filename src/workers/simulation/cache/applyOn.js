import {
  onAction, onType, onTagged, onSkillType, onDmgType,
  onInflictNegativeStatus, onShiftTune,
} from '../match';

const primaryMatch = (effect, action) => {
  const hasApplyOn =
    'applyOnAction' in effect ||
    'applyOnType' in effect ||
    'applyOnTagged' in effect ||
    'applyOnSkillType' in effect ||
    'applyOnDmgType' in effect;

  return !hasApplyOn ||
    onAction(effect.applyOnAction, action) ||
    onType(effect.applyOnType, action) ||
    onTagged(effect.applyOnTagged, action) ||
    onSkillType(effect.applyOnSkillType, action) ||
    onDmgType(effect.applyOnDmgType, action);
};

const secondaryMatch = (effect, action) => {
  const hasApplyOn =
    'applyOnInflictNegativeStatus' in effect ||
    'applyOnShiftTune' in effect;

  return !hasApplyOn ||
    onInflictNegativeStatus(effect.applyOnInflictNegativeStatus, action) ||
    onShiftTune(effect.applyOnShiftTune, action);
};

export const applyOn = (effect, action) => {
  return (
    primaryMatch(effect, action) &&
    secondaryMatch(effect, action)
  );
};
