export function checkApplyElement(ctx, applier, icd) {
  const { tag } = icd;

  return !ctx.states.icd[applier][tag]?.hitsLeft;
}

export function attemptApplyElement(ctx, applier, icd) {
  const { tag, time, hits } = icd;

  const icdState = ctx.states.icd[applier][tag] ??= { tag };
  const attemptBlocked = Boolean(icdState.hitsLeft);

  if (attemptBlocked) {
    icdState.hitsLeft--;
    if (icdState.hitsLeft <= 0) {
      delete icdState.hitsLeft;
    }
  } else {
    icdState.timeLeft ??= time;
    icdState.hitsLeft = hits - 1;
  }

  return !attemptBlocked;
}

export function advanceIcdStates(ctx, elapsed) {
  for (const memberStore of Object.values(ctx.states.icd)) {
    for (const icdState of Object.values(memberStore)) {
      icdState.timeLeft -= elapsed;

      if (icdState.timeLeft <= 0) {
        delete memberStore[icdState.tag];
      }
    }
  }
}
