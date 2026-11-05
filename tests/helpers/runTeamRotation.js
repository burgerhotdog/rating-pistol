import { CHARACTER, GI, HSR, WW, ZZZ } from '@/data';
import { initMember, getTotals } from '@/utils';
import { buildCache } from '@/workers/simulation/cache';
import { runRotation } from '@/workers/simulation/rotation';

function verifyGame(gameArg) {
  switch (gameArg) {
    case 'gi': return GI;
    case 'hsr': return HSR;
    case 'ww': return WW;
    case 'zzz': return ZZZ;
  }
}

function verifyChar(gameId, charArg) {
  const lowerCharArg = charArg.toLowerCase();
  const charData = Object.values(CHARACTER[gameId])
    .find(({ name }) => name.toLowerCase() === lowerCharArg);
  return charData?.id;
}


export function runTeamRotation(gameArg, charArgs, options = {}) {
  const gameId = verifyGame(gameArg);
  if (!gameId) {
    throw new Error(`Invalid game: ${gameArg}`);
  }

  const order = [];

  for (const charArg of charArgs) {
    const charId = verifyChar(gameId, charArg);

    if (!charId) {
      throw new Error(`Invalid char: ${charArg}`);
    }

    order.push(charId);
  }

  const { overrides = {}, equipMaps = {} } = options;

  const team = order.map((id) => initMember(gameId, id, undefined, overrides[id]));

  const missingWeapon = team.find((member) => !member.weaponId);
  if (missingWeapon) {
    throw new Error(`No default weapon for ${missingWeapon.id}; pass overrides[${missingWeapon.id}].weaponId`);
  }

  const cache = buildCache({ gameId, charId: team[0].id, team });
  const { snapshots, bonusEnergy } = runRotation(cache, equipMaps);

  return {
    gameId,
    order,
    cache,
    snapshots,
    bonusEnergy,
    totals: getTotals(snapshots),
  };
}

export function summarizeRun({ gameId, order, snapshots, bonusEnergy, totals }) {
  const nameOf = (id) => CHARACTER[gameId][id]?.name ?? String(id);

  return {
    gameId,
    order: order.map((id) => ({ id, name: nameOf(id) })),
    totals,
    bonusEnergy,
    snapshots: snapshots.map((snapshot) => ({
      runtime: snapshot.runtime,
      owner: nameOf(snapshot.ownerId),
      onField: nameOf(snapshot.onFieldId),
      key: snapshot.key,
      name: snapshot.name,
      type: snapshot.type,
      damageType: snapshot.damageType,
      damage: snapshot.damage,
      healing: snapshot.healing,
      shield: snapshot.shield,
    })),
  };
}
