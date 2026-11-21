import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, expect, it, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import { BarChart } from 'recharts';
import SetsDialog from '@/components/simulation-results/3-lab/SetsDialog';

vi.mock('react-router-dom', () => ({ useParams: vi.fn() }));
vi.mock('@mui/material', () => ({ Paper: 'div', Stack: 'div', Typography: 'span' }));
vi.mock('@mui/material/styles', () => ({
  alpha: vi.fn(),
  useTheme: () => ({ palette: { text: { primary: '#000' } } }),
}));
vi.mock('recharts', () => ({
  Bar: 'div',
  BarChart: vi.fn(() => null),
  LabelList: 'div',
  Tooltip: 'div',
  XAxis: 'div',
  YAxis: 'div',
}));
vi.mock('@/data', () => ({
  ECHO: {},
  SET: {
    'wuthering-waves': { 1: {}, 2: { halfStat: 'atk' }, 3: { halfStat: 'atk' } },
    'genshin-impact': { 1: {} },
  },
}));
vi.mock('@/hooks', () => ({
  useAccent: () => '#fff',
  useData: () => ({}),
}));
vi.mock('@/utils', () => ({
  formatDmg: vi.fn(),
  formatNum: vi.fn(),
  formatStr: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useParams).mockReturnValue({ gameId: 'wuthering-waves' });
});

const chartData = (userMember, setResults) => {
  renderToStaticMarkup(createElement(SetsDialog, { userMember, userDps: 100, setResults }));
  return vi.mocked(BarChart).mock.lastCall[0].data.filter((entry) => !entry.empty);
};

it('adds the user build when the same set uses a different main echo', () => {
  const data = chartData(
    { setCounts: { 1: 5 }, mainEcho: 11 },
    [{ comboKey: '1_5|12', dps: 120 }, { comboKey: 'none', dps: 80 }],
  );

  expect(data.find(({ comboKey }) => comboKey === '1_5|12').isUser).toBe(false);
  expect(data.find(({ comboKey }) => comboKey === '1_5|11')).toMatchObject({ isUser: true, dps: 100 });
});

it('recognizes an equivalent set with the same main echo without adding a duplicate', () => {
  const data = chartData(
    { setCounts: { 2: 2 }, mainEcho: 11 },
    [{ comboKey: '3_2|11', dps: 110 }, { comboKey: 'none', dps: 80 }],
  );

  expect(data).toHaveLength(2);
  expect(data.find(({ comboKey }) => comboKey === '3_2|11').isUser).toBe(true);
});

it('distinguishes a no-set build with an echo from the no-echo baseline', () => {
  const data = chartData(
    { setCounts: {}, mainEcho: 11 },
    [{ comboKey: 'none', dps: 80 }],
  );

  expect(data.find(({ comboKey }) => comboKey === 'none').isUser).toBe(false);
  expect(data.find(({ comboKey }) => comboKey === 'none|11')).toMatchObject({ isUser: true, dps: 100 });
});

it('adds a no-echo user build when the tested set has an echo', () => {
  const data = chartData(
    { setCounts: { 1: 5 }, mainEcho: null },
    [{ comboKey: '1_5|12', dps: 120 }, { comboKey: 'none', dps: 80 }],
  );

  expect(data.find(({ comboKey }) => comboKey === '1_5|12').isUser).toBe(false);
  expect(data.find(({ comboKey }) => comboKey === '1_5')).toMatchObject({ isUser: true, dps: 100 });
});

it('matches sets without an echo for other games', () => {
  vi.mocked(useParams).mockReturnValue({ gameId: 'genshin-impact' });
  const data = chartData(
    { setCounts: { 1: 4 } },
    [{ comboKey: '1_4', dps: 110 }, { comboKey: 'none', dps: 80 }],
  );

  expect(data).toHaveLength(2);
  expect(data.find(({ comboKey }) => comboKey === '1_4').isUser).toBe(true);
});
