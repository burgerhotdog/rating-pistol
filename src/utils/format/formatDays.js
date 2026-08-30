import { formatNum } from './formatNum';

export function formatDays(days) {
  if (days < 7) {
    const unit = Math.floor(days) === 1 ? 'day' : 'days';
    return `${Math.floor(days)} ${unit}`;
  }

  const weeks = days / 7;
  if (days < 30) {
    const unit = Math.floor(weeks) === 1 ? 'week' : 'weeks';
    return `${Math.floor(weeks)} ${unit}`;
  }

  const months = days / 30;
  if (days < 365) {
    const unit = Math.floor(months) === 1 ? 'month' : 'months';
    return `${Math.floor(months)} ${unit}`;
  }

  const years = days / 365;
  const unit = Math.floor(years) === 1 ? 'year' : 'years';
  return `${formatNum(Math.floor(years))} ${unit}`;
}
