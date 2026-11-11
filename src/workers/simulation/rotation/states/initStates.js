import { GI, WW, ZZZ } from '@/data';

export const initStates = (gameId, memberIds) => {
  const initPerMember = (init = () => ({})) =>
    Object.fromEntries(memberIds.map((id) => [id, init()]));

  return {
    runtime: 0,
    onFieldId: null,
    onFieldIndex: null,
    shielded: null,
    rules: {},
    globalCooldowns: {},
    applyCooldowns: {},
    globalEffects: {},
    memberEffects: initPerMember(),
    memberHealth: initPerMember(() => 1),
    ...(gameId === GI && {
      aura: {},
      icd: initPerMember(),
      bondOfLife: initPerMember(() => 0),
      nightsoul: initPerMember(() => ({ blessing: false, points: 0 })),
    }),
    ...(gameId === WW && {
      negativeStatuses: {},
      tune: {
        offTune: 0,
      },
      unisonBoon: {
        stacks: 0,
        appliers: new Set(),
        timeLeft: 0,
      },
      unison: initPerMember(() => false),
    }),
    ...(gameId === ZZZ && {
      daze: {
        stunned: false,
        gauge: 0,
      },
    }),
  };
};
