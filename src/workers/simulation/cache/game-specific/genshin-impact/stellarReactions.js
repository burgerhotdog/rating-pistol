const canEnableStellarConduct = new Set([
  10000133, // Sandrone
  100000057, // Traveler: Cryo
  10000150, // Odette
]);

const canEnableStellarSwirl = new Set([
  10000133, // Sandrone
  100000057, // Traveler: Cryo
  10000150, // Odette
  10000143, // Vesna
]);

export function cacheStellarReactions(cache) {
  const { memberIds } = cache;

  if (memberIds.some((id) => canEnableStellarConduct.has(id))) {
    cache.stellarConduct = true;
  }

  if (memberIds.some((id) => canEnableStellarSwirl.has(id))) {
    cache.stellarSwirl = true;
  }
}
