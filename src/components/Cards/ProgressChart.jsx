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
} from 'recharts';
import { FlexCard, ChartFill } from '@/components';
import { useElementColors } from '@/hooks';
import { formatNum, formatDmg } from '@/utils';

export const ProgressChart = ({ trialBands, userDps }) => {
  const { palette } = useTheme();
  const color = useElementColors({ char: '$curr' });

  const data = trialBands.map(({ mean, p10, p25, p50, p75, p90 }, index) => ({
    week: index,
    mean,
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
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={palette.divider}
          />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            label={{
              value: 'Weeks',
              position: 'insideBottomRight',
              offset: -5,
              fontSize: 12,
            }}
          />
          <YAxis
            domain={[
              0,
              Math.max(trialBands.at(-1).p90, userDps) * 1.05,
            ]}
            tick={{ fontSize: 12 }}
            tickFormatter={formatDmg}
            label={{
              value: 'DPS',
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
            }}
            width="auto"
          />

          <Area
            type="monotone"
            dataKey="band80Low"
            stackId="band80"
            stroke="none"
            fill="transparent"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="band80High"
            stackId="band80"
            stroke="none"
            fill={color}
            fillOpacity={0.15}
            activeDot={false}
          />

          <Area
            type="monotone"
            dataKey="band50Low"
            stackId="band50"
            stroke="none"
            fill="transparent"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="band50High"
            stackId="band50"
            stroke="none"
            fill={color}
            fillOpacity={0.3}
            activeDot={false}
          />

          <Area
            type="monotone"
            dataKey="mean"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#gradient)"
            activeDot={false}
          />

          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const { week, mean } = payload[0].payload;
              const prevWeek = data[week - 1];

              const diff = prevWeek?.mean > 0
                ? (mean - prevWeek.mean) / prevWeek.mean * 100
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
                      {formatNum(mean)}
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
