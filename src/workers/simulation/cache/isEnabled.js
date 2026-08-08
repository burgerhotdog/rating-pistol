import { toArray } from '@/utils';

function passStringFilter(ctxValue, reqStr) {
  return ctxValue === reqStr;
}

function passNumberFilter(ctxNumber, reqNumber) {
  if (reqNumber < 0) {
    if (ctxNumber < Math.abs(reqNumber)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (ctxNumber >= reqNumber) {
      return true;
    } else {
      return false;
    }
  }
}

function ctxValueInOptions(ctxValue, reqValueOptions) {
  for (const reqValueOption of reqValueOptions) {
    const passes = typeof valueOption === 'number'
      ? passNumberFilter(ctxValue, reqValueOption)
      : passStringFilter(ctxValue, reqValueOption);

    if (passes) return true;
  }
}

export function createIsEnabled(ctx) {
  const filterMet = (filter) => {
    for (const filterType in filter) {
      if (filterType === 'rank') {
        const meetsRank = passNumberFilter(ctx.member.rank, filter.rank);
        if (!meetsRank) return false;
      } else {
        const filterFields = filter[filterType];

        for (const field in filterFields) {
          const reqValue = filterFields[field];
          const ctxValue = ctx[filterType][field];

          const inOptions = ctxValueInOptions(ctxValue, toArray(reqValue));

          if (!inOptions) return false;
        }
      }
    }

    return true;
  };

  return (effect) => {
    if (!effect.enableIf) return true;
    return toArray(effect.enableIf).some(filterMet);
  };
}
