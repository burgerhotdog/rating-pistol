import { ECHO } from '@/data';

export function insertMainEchoAction(rotation, mainEcho, actionDefs) {
  const { action, timing } = ECHO[mainEcho];
  if (!action) return;

  let index = rotation.length;

  if (timing === 'start') {
    index = rotation[0]?.type === 'introSkill' ? 1 : 0;
  } else {
    if (rotation.at(-1)?.type === 'outroSkill') {
      index = -1;
    }
  }

  rotation.splice(index, 0, actionDefs['echoSkill.0']);
}
