import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, darken } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { useAccent } from '@/hooks';
import { formatNum, formatStr } from '@/utils';

const buildData = (summary, charId) => {
  const damageByType = {};

  for (const { ownerId, damage, damageType } of summary) {
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

const Distribution = ({ results }) => {
  const { userSummary } = results;
  const { charId } = useParams();
  const accent = useAccent();

  const data = buildData(userSummary, Number(charId));
  const totalDamage = data.reduce((acc, entry) => acc + entry.value, 0);
  const duration = userSummary.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0);
  const dps = duration > 0 ? totalDamage / (duration / 1000) : null;

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Damage Distribution"
        subheader={`${formatNum(totalDamage)} total damage · ${formatNum(dps)} DPS`}
      />
      <CardContent component={Stack} sx={{ flex: 1 }}> 
        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
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
                const { name = '', value = 0 } = payload?.[0]?.payload ?? {};
                return (
                  <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {formatStr(name)}: {formatNum(value)} damage
                    </Typography>
                  </Paper>
                );
              }}
            />
          </PieChart>

          <BarChart
            data={data}
            layout="vertical"
            style={{ width: '100%', height: '100%' }}
            responsive
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />

            <Bar
              dataKey="percent"
              animationMatchBy={matchByDataKey('name')}
              fill={accent}
            />
          </BarChart>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Distribution;
