const getEffectStatesForMember = (ctx, memberId) => {
  const { memberEffects } = ctx.states;
  if (memberId === 'all') return Object.values(memberEffects).flatMap(Object.values);
  return Object.values(memberEffects[memberId]);
};

export function getEffectStates(ctx, { member, type }) {
  const states = [
    ...Object.values(ctx.states.globalEffects),
    ...(member ? getEffectStatesForMember(ctx, member) : []),
  ];

  switch (type) {
    case 'gameRule':
      return states.filter(({ effect }) => effect.gameRule);
    case 'buff':
      return states.filter(({ effect }) => effect.buff?.stats || effect.buff?.specs);
    case 'action':
      return states.filter(({ effect }) => effect.useAction);
    default:
      return states;
  }
}
