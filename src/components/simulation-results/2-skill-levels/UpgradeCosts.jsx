import { useMemo } from 'react';
import { Paper, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { useData } from '@/hooks';
import { formatDmg } from '@/utils';

const UpgradeCosts = () => {
  const { palette } = useTheme();
  const { skillLevelUpgradeCostsPrecomputed } = useData('misc');

  const costData = useMemo(
    () => skillLevelUpgradeCostsPrecomputed.map((stamina, i) => ({
      stamina,
      level: i + 2,
      fill: `url(#gradientAccent)`,
    })),
    [skillLevelUpgradeCostsPrecomputed],
  );

  return (
    <BarChart
      data={costData}
      style={{ width: '100%', height: '100%' }}
      responsive
    >
      <XAxis dataKey="level" />
      <YAxis type="number" tickFormatter={formatDmg} />
      <Bar dataKey="stamina" />

      <Tooltip
        content={({ payload }) => {
          if (!payload?.[0]?.payload) return;
          const { level } = payload[0].payload;
          const title = `Upgrade ${level - 1} > ${level}`;

          return (
            <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                {title}
              </Typography>
            </Paper>
          );
        }}
        cursor={{ fill: alpha(palette.text.primary, 0.1) }}
        isAnimationActive={false}
      />
    </BarChart>
  );
};

export default UpgradeCosts;
