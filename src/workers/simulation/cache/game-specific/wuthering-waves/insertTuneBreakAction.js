export function insertTuneBreakAction(rotation, durationEstimate, memberId) {
  // Ensure no more than 8000 ms remain after tune break
  let timeLeft = durationEstimate;
  let index = 0;

  for (const action of rotation) {
    if (timeLeft <= 8000) break;

    timeLeft -= (action.duration ?? 0);
    index++;
  }

  if (index === 0) index++;

  rotation.splice(index, 0, {
    key: 'system:tuneBreak',
    ownerId: memberId,
  });
}
