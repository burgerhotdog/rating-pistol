import { GI, WW } from '@/data';

export const initStates = (gameId, memberIds) => {
  const initPerMember = (init = () => ({})) =>
    Object.fromEntries(memberIds.map((id) => [id, init()]));

  return {
    runtime: 0,
    onFieldId: null,
    shielded: null,
    globalCooldowns: {},
    applyCooldowns: {},
    gameRules: {},
    globalEffects: {},
    memberEffects: initPerMember(),
    memberHealth: initPerMember(() => 1),
    ...(gameId === GI && {
      aura: {},
      icd: initPerMember(),
      bondOfLife: initPerMember(() => 0),
      nightsoul: initPerMember(),
    }),
    ...(gameId === WW && {
      negativeStatuses: {},
      tune: { offTune: 0 },
    }),
  };
};
