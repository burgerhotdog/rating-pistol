import { Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useAccent } from '@/hooks';

const RatePerStamina = ({ data }) => {
  const { palette } = useTheme();
  const accent = useAccent();

  return (
    <BarChart
      data={data}
      style={{ width: '100%', height: '100%' }}
      responsive
    >
      <XAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
      <YAxis type="number" />
      <Bar dataKey="rate" fill={accent} />
      <Tooltip
        content={({ payload, label }) => {
          if (!payload?.[0]?.payload) return;
          const { isMax, diff, rate, staminaCost, newLevel } = payload[0].payload;
          if (isMax) return;

          return (
            <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
              <Typography variant="body2" color="textSecondary">
                {`${label} ${newLevel - 1} > ${newLevel}`}
              </Typography>
              <Stack>
                <Typography variant="body2">
                  Δ DPS: +{Math.abs(diff).toFixed(2)}%
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Cost: {staminaCost.toFixed()} stamina
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Rate: {rate.toFixed(4)}% per stamina
                </Typography>
              </Stack>
            </Paper>
          );
        }}
        cursor={{ fill: alpha(palette.text.primary, 0.1) }}
        isAnimationActive={false}
      />
    </BarChart>
  );
};

export default RatePerStamina;
