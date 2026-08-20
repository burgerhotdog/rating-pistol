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
      return states.filter(({ effect }) => effect.buff);
    case 'action':
      return states.filter(({ effect }) => effect.use);
    default:
      return states;
  }
}
