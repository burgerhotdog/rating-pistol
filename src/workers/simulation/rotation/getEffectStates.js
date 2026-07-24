const getEffectStatesForMember = (ctx, memberId) => {
  const { memberEffects } = ctx.states;
  if (memberId === 'all') return Object.values(memberEffects).flatMap(Object.values);
  return Object.values(memberEffects[memberId]);
};

export const getEffectStates = (ctx, { member, type }) => {
  const states = [
    ...Object.values(ctx.states.globalEffects),
    ...(member ? getEffectStatesForMember(ctx, member) : []),
  ];

  switch (type) {
    case 'gameRule':
      return states.filter(({ effect: e }) => 'gameRule' in e);
    case 'buff':
      return states.filter(({ effect: e }) => 'buffMap' in e || 'buffSpec' in e);
    case 'action':
      return states.filter(({ effect: e }) => 'useAction' in e);
    default:
      return states;
  }
};
