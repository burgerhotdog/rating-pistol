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

export function passesFilter(filters, spec) {
  if (!filters) return true;

  return toArray(filters).some((filter) =>
    Object.entries(filter).every(([filterType, filterFields]) =>
      Object.entries(filterFields).every(([field, reqValue]) =>
        ctxValueInOptions(spec[filterType][field], toArray(reqValue)))));
}
