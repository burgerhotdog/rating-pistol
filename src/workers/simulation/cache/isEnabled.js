import { toArray } from '@/utils';

const passStringFilter = (ctxValue, reqStr) =>
  toArray(ctxValue).includes(reqStr);

const passNumberFilter = (ctxNumber, reqNumber) =>
  reqNumber < 0
    ? ctxNumber < Math.abs(reqNumber)
    : ctxNumber >= reqNumber;

const ctxValueInOptions = (ctxValue, reqValueOptions) =>
  reqValueOptions.some((reqValueOption) =>
    typeof valueOption === 'number'
      ? passNumberFilter(ctxValue, reqValueOption)
      : passStringFilter(ctxValue, reqValueOption));

export function createIsEnabled(ctx) {
  const filterMet = (filter, setId) => {
    for (const filterType in filter) {
      if (filterType === 'rank') {
        const meetsRank = passNumberFilter(ctx.member.rank, filter.rank);
        if (!meetsRank) return false;
      } else if (filterType === 'bonus') {
        const meetsBonus = passNumberFilter(ctx.member.setCounts[setId], filter.bonus);
        if (!meetsBonus) return false;
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

  return (effect, setId) => {
    if (!effect.enableIf) return true;
    return toArray(effect.enableIf).some((filter) => filterMet(filter, setId));
  };
}
