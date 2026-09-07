const always = new Set([1209, 1510, 1413]);
const onlyIfMode = new Set([1509, 1211]);

export function cacheTuneResponses(cache) {
  cache.tuneStrainMaxStacks = 1;

  for (const mCache of Object.values(cache.member)) {
    const isStrain =
      always.has(mCache.id) ||
      (onlyIfMode.has(mCache.id) && mCache.mode === 'tuneStrain');
    if (!isStrain) continue;

    mCache.tuneStrainResponse = true;
    cache.tuneStrainMaxStacks++;
  }
}
