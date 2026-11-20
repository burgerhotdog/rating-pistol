const absorptionPriority = ['pyro', 'hydro', 'electro', 'cryo'];
const absorptionPriorityAlt = ['cryo', 'pyro', 'hydro', 'electro'];

// Lynette & Anemo Traveler
const getAbsorptionPriority = (memberId) => {
  return memberId === 10000083 || memberId === 100000054
    ? absorptionPriorityAlt
    : absorptionPriority;
}

export function auraCheck(ctx, memberId) {
  const store = ctx.states.aura;

  for (const element of getAbsorptionPriority(memberId)) {
    if (Object.hasOwn(store, element)) {
      return element;
    }
  }
}
