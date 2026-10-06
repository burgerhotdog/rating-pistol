const reactionEnablers = {
  lunarCharged: new Set([
    10000116, // Ineffa
    10000120, // Flins
    10000125, // Columbina
  ]),
  lunarBloom: new Set([
    10000119, // Lauma
    10000122, // Nefer
    10000125, // Columbina
  ]),
  lunarCrystallize: new Set([
    10000125, // Columbina
    10000126, // Zibai
    10000130, // Linnea
  ]),
  stellarConduct: new Set([
    10000133, // Sandrone
    100000057, // Traveler: Cryo
    10000150, // Odette
  ]),
  stellarSwirl: new Set([
    10000133, // Sandrone
    100000057, // Traveler: Cryo
    10000150, // Odette
    10000143, // Vesna
  ]),
};

export function cacheExclusiveReactions(cache) {
  const { memberIds } = cache;

  for (const [reaction, enablers] of Object.entries(reactionEnablers)) {
    cache[reaction] = memberIds.some((id) => enablers.has(id));
  }
}
