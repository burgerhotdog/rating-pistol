const hasRuptureResponse = (memberId, mode) => {
  if (
    memberId === 1209 // Mornye
  ) return true;

  if (
    mode === 'tuneRupture' && (
      memberId === 1509 || // Lynae
      memberId === 1210    // Aemeath
    )
  ) return true;
}

const hasStrainResponse = (memberId, mode) => {
  if (
    memberId === 1209 || // Mornye
    memberId === 1510 || // Luuk
    memberId === 1413    // Qingxiao
  ) return true;

  if (
    mode === 'tuneStrain' && (
      memberId === 1509 || // Lynae
      memberId === 1211    // Denia
    )
  ) return true;
}

const hasHackResponse = (memberId) => {
  if (
    memberId === 1511 || // Lucy
    memberId === 1308    // Rebecca
  ) return true;
}

export function cacheTuneResponses(cache) {
  cache.tuneStrainMaxStacks = 1;

  for (const mCache of Object.values(cache.member)) {
    if (hasRuptureResponse(mCache.id, mCache.mode)) {
      mCache.tuneRuptureResponse = Object.values(mCache.actions).find((action) =>
        action.type === 'tuneResponse'
      );
    }

    if (hasStrainResponse(mCache.id, mCache.mode)) {
      mCache.tuneStrainResponse = true;
      cache.tuneStrainMaxStacks++;
    }

    if (hasHackResponse(mCache.id, mCache.mode)) {
      mCache.hackResponse = Object.values(mCache.actions).find((action) =>
        action.type === 'tuneResponse'
      );
    }
  }
}
