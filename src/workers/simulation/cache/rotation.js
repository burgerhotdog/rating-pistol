import { WW } from '@/data';
import {
  insertMainEchoAction,
  insertTuneBreakAction,
} from './game-specific/wuthering-waves';

function adjustTimings(rotation, actual, estimate) {
  const adjust = (time) => Math.round(time * actual / estimate);
  const resolved = [];

  for (const action of rotation) {
    const { duration = 0, hitOffsets } = action;

    resolved.push({
      ...action,
      duration: adjust(duration),
      ...(hitOffsets && {
        hitOffsets: hitOffsets.map(adjust),
      }),
    });
  }

  return resolved;
}

export const getConvertedRotation = (gameId, member, actionDefs, memberIds) => {
  const rotation = [];
  let durationEstimate = 0;
  let timeRemoved = 0;

  for (const actionRef of member.rotation) {
    const action = actionDefs[actionRef];
    const { type, duration = 0 } = action;

    if (gameId === WW) {
      const isIntroOutro = type === 'introSkill' || type === 'outroSkill';
      if (memberIds.length === 1 && isIntroOutro) {
        timeRemoved += duration;
        continue;
      }
    }

    durationEstimate += duration;
    rotation.push(action);
  }

  if (gameId === WW) {
    if (member.mainEcho) {
      insertMainEchoAction(rotation, member.mainEcho, actionDefs);
    }

    if (member.id === memberIds[0]) {
      insertTuneBreakAction(rotation, durationEstimate, member.id);
    }
  }

  if (member.duration == null) {
    return {
      rotation,
      duration: durationEstimate,
    };
  }

  const durationMinusTimeRemoved = member.duration - timeRemoved;

  return {
    rotation: adjustTimings(rotation, durationMinusTimeRemoved, durationEstimate),
    duration: durationMinusTimeRemoved,
  };
};
