import { Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { formatDmg, formatNum } from '@/utils';

const renderTooltip = ({ payload, label }) => {
  const { empty, dps = 0, pct = 0, isUser } = payload?.[0]?.payload ?? {};
  if (empty) return;

  const diff = pct - 100;
  const diffStr = diff >= 0
    ? `+${diff.toFixed(1)}`
    : diff.toFixed(1);

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="caption">
          {formatNum(dps)} dps
        </Typography>
        {!isUser && (
          <Typography
            variant="caption"
            color={diff >= 0 ? 'success' : 'error'}
          >
            ({diffStr}%)
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

const ComparisonChart = ({ data }) => {
  const { palette } = useTheme();

  return (
    <BarChart
      data={data}
      style={{ width: '100%', height: '100%' }}
      responsive
    >
      <XAxis dataKey="name" tick={false} />
      <YAxis type="number" tickFormatter={formatDmg} />
      <Bar dataKey="dps" animationMatchBy={matchByDataKey('name')}>
        <LabelList
          content={({ x, y, width, height, index }) => {
            const entry = data[index];
            if (!entry?.icon) return null;

            const size = width - 16;
            const ix = x + 8;
            const iy = y + height - size - 8;

            return (
              <image
                x={ix}
                y={iy}
                width={size}
                height={size}
                href={entry.icon}
                {...(!entry.isUser && { opacity: 0.5 })}
                filter={entry.filter}
              />
            );
          }}
        />
      </Bar>
      <Tooltip
        content={renderTooltip}
        cursor={{ fill: alpha(palette.text.primary, 0.1) }}
        isAnimationActive={false}
      />
    </BarChart>
  );
};

export default ComparisonChart;
