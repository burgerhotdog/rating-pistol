import { useParams } from 'react-router-dom';
import {
  Box,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ReferenceLine,
} from 'recharts';
import { FlexCard, ChartFill } from '@/components';
import { CHARACTER } from '@/data';
import { formatNum, formatDmg } from '@/utils';

export const ProgressChart = ({ trialBands, userDps, prydwenDps }) => {
  const { gameId, charId } = useParams();
  const { palette, accentColors } = useTheme();

  const disabledColor = palette.action.disabled;
  const { element } = CHARACTER[gameId][charId]
  const accentColor = accentColors[gameId][element] ?? disabledColor;

  const data = trialBands.map(({ p10, p25, p50, p75, p90 }, index) => ({
    week: index,
    median: p50,
    band50Low: p25,
    band50High: p75 - p25,
    band80Low: p10,
    band80High: p90 - p10,
  }));

  return (
    <FlexCard direction="row">
      <ChartFill flex={3}>
        <ComposedChart
          data={data}
          margin={{ top: 32, right: 48, left: 32, bottom: 32 }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity={0.6} />
              <stop offset="100%" stopColor={accentColor} stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={palette.divider}
          />

          <XAxis
            dataKey="week"
            label={{
              value: 'Weeks',
              position: 'insideBottomRight',
              offset: -5,
            }}
          />

          <YAxis
            domain={[
              0,
              Math.max(trialBands.at(-1).p90, userDps, prydwenDps) * 1.05,
            ]}
            tickFormatter={formatDmg}
            label={{
              value: 'DPS',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <ReferenceLine
            y={userDps}
            strokeWidth={2}
          />

          <ReferenceLine
            y={prydwenDps}
            strokeWidth={1}
          />

          <Area
            dataKey="band80Low"
            stackId="band80"
            stroke="none"
            fill="transparent"
          />
          <Area
            dataKey="band80High"
            stackId="band80"
            stroke="none"
            fill={accentColor}
            fillOpacity={0.15}
          />

          <Area
            dataKey="band50Low"
            stackId="band50"
            stroke="none"
            fill="transparent"
          />
          <Area
            dataKey="band50High"
            stackId="band50"
            stroke="none"
            fill={accentColor}
            fillOpacity={0.3}
          />

          <Area
            type="monotone"
            dataKey="median"
            stroke={accentColor}
            strokeWidth={1.5}
            fill="url(#gradient)"
            activeDot={false}
          />

          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const { week, median } = payload[0].payload;
              const prevWeek = data[week - 1];

              const diff = prevWeek?.median > 0
                ? (median - prevWeek.median) / prevWeek.median * 100
                : null;

              const diffColor = diff >= 0
                ? 'success.main'
                : 'error.main';

              return (
                <Paper
                  elevation={4}
                  sx={{
                    p: 1.5,
                    minWidth: 160,
                    backgroundColor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Week {week}
                  </Typography>

                  <Divider sx={{ my: 0.5 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Total:
                    </Typography>

                    <Typography variant="body2">
                      {formatNum(median)}
                    </Typography>
                  </Box>

                  {diff != null && (
                    <Typography variant="body2" sx={{ color: diffColor }}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                    </Typography>
                  )}
                </Paper>
              );
            }}
          />
        </ComposedChart>
      </ChartFill>
    </FlexCard>
  );
};
