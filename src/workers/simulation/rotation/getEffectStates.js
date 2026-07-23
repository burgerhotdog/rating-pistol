const getEffectStatesForMember = (ctx, memberId) => {
  const { memberEffects } = ctx.states;
  if (memberId === 'all') return Object.values(memberEffects).flatMap(Object.values);
  return Object.values(memberEffects[memberId]);
};

export const getEffectStates = (ctx, { member, type }) => {
  const effectStates = [
    ...Object.values(ctx.states.globalEffects),
    ...(member ? getEffectStatesForMember(ctx, member) : []),
  ];

  switch (type) {
    case 'buff':
      return effectStates.filter(({ effect: e }) => 'statMap' in e || 'statSpecs' in e);
    case 'action':
      return effectStates.filter(({ effect: e }) => 'useAction' in e);
    default:
      return effectStates;
  }
};
