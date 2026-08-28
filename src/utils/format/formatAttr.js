import { WW } from '@/data';

export function formatAttr(gameId, attrId, attrValue) {
  const isPercent = attrId.endsWith('%');

  const valueOffset = (gameId === WW && attrId === 'critDmg%') ? 1 : 0;
  const percentMult = isPercent ? 100 : 1;
  const toFixedValue = isPercent ? 1 : 0;
  const value = (attrValue + valueOffset) * percentMult;
  return value.toFixed(toFixedValue) + (isPercent ? '%' : '');
}
