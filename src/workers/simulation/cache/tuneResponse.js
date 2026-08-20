const alwaysTuneStrain = [
  '1209',
  '1510',
  '1413'
];

const sometimesTuneStrain = [
  '1509',
  '1211'
];

export function cacheTuneResponses(cache) {
  cache.tuneStrainMaxStacks = 1;

  const respondsToTuneStrain = (memberId) =>
    alwaysTuneStrain.includes(memberId) ||
    (
      sometimesTuneStrain.includes(memberId) &&
      cache.member[memberId].mode === 'tuneStrain'
    )

  for (const memberId in cache.member) {
    if (!respondsToTuneStrain(memberId)) continue;

    cache.member[memberId].tuneStrainResponse = true;
    cache.tuneStrainMaxStacks++;
  }
}
