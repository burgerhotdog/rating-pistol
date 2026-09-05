import { useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { alpha, darken } from '@mui/material/styles';
import { Pie, PieChart, Sector, Tooltip } from 'recharts';
import { useAccent } from '@/hooks';
import { formatNum, formatStr } from '@/utils';

const buildData = (snapshots, charId) => {
  const damageByType = {};

  for (const { ownerId, damage, damageType } of snapshots) {
    if (ownerId !== charId || !damage) continue;

    const type = damageType ?? 'other';
    damageByType[type] ??= 0;
    damageByType[type] += damage;
  }

  const entries = Object.entries(damageByType)
    .map(([damageType, damageValue]) => ({
      name: formatStr(damageType),
      value: Math.round(damageValue),
    }))
    .filter((entry) => entry.value)
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((acc, entry) => acc + entry.value, 0);

  return entries.map((entry) => {
    const percent = entry.value / total;
    return { ...entry, percent };
  });
};

const DistributionChart = ({ results }) => {
  const { userSnapshots } = results;
  const { charId } = useParams();
  const accent = useAccent();

  const data = buildData(userSnapshots, Number(charId));

  return (
    <PieChart
      style={{ width: '100%', height: '100%' }}
      responsive
    >
      <Pie
        data={data}
        dataKey="value"
        animationBegin={0}
        shape={(props) => {
          const { percent } = props;
          const fill = alpha(darken(accent, (1 - percent) * 0.7), 0.9);
          return <Sector {...props} fill={fill} stroke="none" />;
        }}
      />

      <Tooltip
        content={({ payload }) => {
          if (!payload?.[0]?.payload) return;
          const { name, value } = payload[0].payload;

          return (
            <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                {formatStr(name)}: {formatNum(value)} damage
              </Typography>
            </Paper>
          );
        }}
        isAnimationActive={false}
      />
    </PieChart>
  );
};

export default DistributionChart;
