import { CHARACTER } from '@/data';
import { toArray } from './toArray';

export const isEnabledChar = (effect, member, gameId, { memberIds, counts }) => {
  if (effect.rank && effect.rank > member.rank) {
    return false;
  }

  if (effect.mode && effect.mode !== member.mode) {
    return false;
  }

  const { enable } = effect;

  if (!enable) {
    return true;
  }

  if (enable.team) {
    const [specialKey, countReq] = effect.enable.team;

    if (specialKey === 'hexerei') {
      if (counts?.hexerei < countReq) {
        return false;
      }
    }

    if (specialKey === 'lupa') {
      // Count fusion members
      const fusionMemberCount = memberIds.reduce(
        (acc, memberId) => CHARACTER[gameId][memberId]?.element === 'fusion'
          ? acc + 1
          : acc,
        0,
      );

      if (fusionMemberCount < countReq) {
        return false;
      }
    }

    if (specialKey === 'hiyuki') {
      // Count members that can inflict glacio chafe or havoc bane
      let count = 0;

      for (const memberId of memberIds) {
        const found = Object.values(CHARACTER[gameId][memberId].skills).some(({ actions }) =>
          actions.some(({ inflict }) => {
            const statuses = Object.keys(inflict?.status ?? {});
            return (
              statuses.includes('glacioChafe') ||
              statuses.includes('havocBane')
            );
          })
        );

        if (found) {
          count++;
        }
      }

      if (count < countReq) {
        return false;
      }
    }
  }

  switch (enable.special) {
    case 'lyney2pyro': {
      return counts.element.pyro >= 2;
    }

    case 'lyney3pyro': {
      return counts.element.pyro >= 3;
    }

    case 'chevreuse': {
      const elements = Object.keys(counts.element);

      return (
        elements.length === 2 &&
        elements.includes('pyro') &&
        elements.includes('electro')
      );
    }
  }

  return true;
};

export const isEnabledWeap = (effect, charData, weapData, { counts } = {}) => {
  if (weapData.type !== charData.type) {
    return false;
  }

  const { enable } = effect;
  if (!enable) return true;

  if (enable.id) {
    const allowed = toArray(enable.id);
    if (!allowed.includes(charData.id)) {
      return false;
    }
  }

  if (enable.team) {
    const [specialKey, countReq] = effect.enable.team;

    if (specialKey === 'hexerei') {
      if (counts?.hexerei < countReq) {
        return false;
      }
    }
  }

  switch (enable.special) {
    case 'greatMagic2same': {
      const ownerElement = charData.element;
      return counts.element[ownerElement] >= 2;
    }

    case 'greatMagic3same': {
      const ownerElement = charData.element;
      return counts.element[ownerElement] >= 3;
    }
  }

  return true;
};

export const isEnabledSet = (effect, pcCount, charData) => {
  if (effect.bonus > pcCount) {
    return false;
  }

  const { enable } = effect;
  if (!enable) return true;

  if ('type' in enable) {
    const allowed = toArray(enable.type);
    if (!allowed.includes(charData.type)) {
      return false;
    }
  }

  if ('element' in enable) {
    const allowed = toArray(enable.element);
    if (!allowed.includes(charData.element)) {
      return false;
    }
  }

  if ('tagged' in enable) {
    const allowed = toArray(enable.tagged);
    const charTagged = toArray(charData.tagged);
    if (!allowed.some((tag) => charTagged.includes(tag))) {
      return false;
    }
  }

  if ('energy' in enable) {
    if (enable.energy === -1) {
      if (charData.energy) {
        return false;
      }
    } else {
      const reqEnergy = enable.energy;
      if (reqEnergy > charData.energy) {
        return false;
      }
    }
  }

  return true;
};

export const isEnabledEcho = (effect, charData) => {
  const { enable } = effect;
  if (!enable) return true;

  if ('id' in enable) {
    const allowed = toArray(enable.id);
    if (!allowed.includes(charData.id)) {
      return false;
    }
  }

  return true;
};
