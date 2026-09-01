export function computeConcertoExtraTime(memberCache) {
  if (!memberCache.concertoPenalty) return 0;
  return (100 / 92) * memberCache.duration - memberCache.duration;
}
