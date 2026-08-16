import { WW } from '@/data';

const SPECIAL_CASES = {
  Hp: 'HP',
  Atk: 'ATK',
  Def: 'DEF',
  Crit: 'CRIT',
  Dmg: 'DMG',
  Spd: 'SPD',
  Pen: 'PEN',
  Res: 'RES',
  Dot: 'DoT',
  Ex: 'EX',
};

export function formatStr(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => {
      const hasPercent = word.endsWith('%');
      if (hasPercent) word = word.slice(0, -1);

      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      word = SPECIAL_CASES[word] ?? word;

      return hasPercent ? `${word}%` : word;
    })
    .join(' ');
}

export function formatNum(num) {
  return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatDmg(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toFixed(0);
}

export function formatAttr(gameId, attrId, attrValue) {
  const valueOffset = (gameId === WW && attrId === 'critDmg%') ? 1 : 0;
  const isPercent = attrId.endsWith('%');
  const percentMult = isPercent ? 100 : 1;
  const toFixedValue = isPercent ? 1 : 0;
  const value = (attrValue + valueOffset) * percentMult;
  return value.toFixed(toFixedValue) + (isPercent ? '%' : '');
}
