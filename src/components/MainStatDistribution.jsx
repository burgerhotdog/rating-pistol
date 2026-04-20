import { Box, Card, Tooltip as MuiTooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { MISC, CHARACTERS } from '@/data';

export const MainStatDistribution = ({ gameId, characterId, mainStatDist }) => {
  if (!mainStatDist) return null;

  const { EQUIP_NAMES, MAIN_STAT_TYPES } = MISC[gameId];
  const element = CHARACTERS[gameId][characterId].element;
  const baseColor = MISC[gameId]?.ELEMENT_COLORS?.[element] ?? '#8884d8';

  if (!EQUIP_NAMES) return null;

  const slots = EQUIP_NAMES
    .map((slotName, index) => {
      const slotOptions = MAIN_STAT_TYPES[index];
      if (!slotOptions) return null;

      const dist = mainStatDist[index];
      const isFixed = Object.keys(slotOptions).length === 1;

      const effectiveDist =
        dist && Object.keys(dist).length
          ? dist
          : isFixed
          ? { [Object.keys(slotOptions)[0]]: 1 }
          : null;

      if (!effectiveDist) return null;

      const entries = Object.entries(effectiveDist)
        .map(([statId, pct]) => ({
          statId,
          name: slotOptions[statId]?.NAME ?? statId,
          pct: pct * 100,
        }));

      return { slotName, entries };
    })
    .filter(Boolean);

  if (!slots.length) return null;

  // -------------------------------
  // 1. Global ordering (consistent across all bars)
  // -------------------------------
  const statTotals = {};

  slots.forEach(({ entries }) => {
    entries.forEach(({ name, pct }) => {
      statTotals[name] = (statTotals[name] || 0) + pct;
    });
  });

  const statKeys = Object.keys(statTotals).sort(
    (a, b) => statTotals[b] - statTotals[a]
  );

  // -------------------------------
  // 2. Transform for Recharts
  // -------------------------------
  const chartData = slots.map(({ slotName, entries }) => {
    const obj = { slot: slotName };
    entries.forEach(({ name, pct }) => {
      obj[name] = pct;
    });
    return obj;
  });

  // -------------------------------
  // 3. Color helpers
  // -------------------------------
  const hexToRgb = (hex) => {
    const res = hex.replace('#', '');
    const bigint = parseInt(res, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const rgb = hexToRgb(baseColor);

  const getColor = (index, total) => {
    // darker for smaller segments, brighter for larger ones
    const intensity = 0.35 + (index / Math.max(total - 1, 1)) * 0.65;
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${intensity})`;
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Main Stat Distribution
        </Typography>
        <MuiTooltip
          title="How often each main stat appears across all simulated builds."
          arrow
        >
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
        </MuiTooltip>
      </Box>

      {/* Chart */}
      <Box sx={{ flex: 1, px: 2, pb: 2 }}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <XAxis dataKey="slot" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={35} />

            <Tooltip formatter={(v, name) => [`${v.toFixed(1)}%`, name]} />

            {statKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={getColor(index, statKeys.length)}
                stroke="rgba(0,0,0,0.25)"
                strokeWidth={1}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};