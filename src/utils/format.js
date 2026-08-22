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

export function formatTime(dateString) {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';

  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}

export function formatDate(dateString) {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
