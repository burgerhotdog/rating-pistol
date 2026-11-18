function isSpecialConstruct(effect) {
  // Geo Traveller Ult
  if ( // Kachina Turbo Twirly
    effect.ownerId === 10000100 &&
    effect.ref === 'skill_turboTwirly'
  ) return true;
}

export function countGeoConstructs(ctx) {
  const { globalEffects, memberEffects } = ctx.states;

  let geoConstructs = 0;
  let specialConstructs = 0;

  function checkState(state) {
    const { effect } = state;
    if (!effect.geoConstruct) return;

    if (isSpecialConstruct(effect)) {
      specialConstructs++;
    } else {
      geoConstructs++;
    }
  }

  for (const key in globalEffects) {
    checkState(globalEffects[key]);
  }

  for (const memberId in memberEffects) {
    const memberStore = memberEffects[memberId];

    for (const key in memberStore) {
      checkState(memberStore[key]);
    }
  }

  const moondrifts = ctx.states.aura.lunarCrystallize ? 3 : 0;

  return geoConstructs + specialConstructs + moondrifts;
}
