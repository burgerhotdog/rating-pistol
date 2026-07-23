const getEffectStatesForMember = (ctx, memberId) => {
  const { memberEffects } = ctx.state;
  if (memberId === 'all') return Object.values(memberEffects).flatMap(Object.values);
  return Object.values(memberEffects[memberId]);
};

export const getEffectStates = (ctx, { enemy, member, type }) => {
  const effectStates = [
    ...(enemy ? Object.values(ctx.state.enemyEffects) : []),
    ...(member ? getEffectStatesForMember(ctx, member) : []),
  ];

  switch (type) {
    case 'buff':
      return effectStates.filter(({ effect: e }) => 'statMap' in e || 'variableStatMap' in e);
    case 'action':
      return effectStates.filter(({ effect: e }) => 'useAction' in e);
    default:
      return effectStates;
  }
};
