import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha, darken } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Sector,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { useAccent } from '@/hooks';
import { formatNum, formatStr } from '@/utils';

const VALID_CATEGORIES = new Set([
  'normalAttack',
  'resonanceSkill',
  'forteCircuit',
  'resonanceLiberation',
  'introSkill',
]);

const DISTRIBUTION_MODES = [
  'damageType',
  'category',
];

const buildData = (summary, currId, distributionMode) => {
  const damageByType = {};

  const getType = (snapshot) => {
    if (distributionMode === 'damageType') {
      return snapshot.damageType ?? 'other';
    } else {
      const { category } = snapshot;
      if (!VALID_CATEGORIES.has(category)) return 'other';
      return category;
    }
  };

  for (const snapshot of summary) {
    if (!('damage' in snapshot) || snapshot.ownerId !== currId) continue;

    const type = getType(snapshot);
    if (!type) continue;

    damageByType[type] ??= 0;
    damageByType[type] += snapshot.damage;
  }

  const entries = Object.entries(damageByType)
    .map(([dmgType, damage]) => ({
      name: formatStr(dmgType),
      value: Math.round(damage),
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

  const [distributionMode, setDistributionMode] = useState('damageType');

  const handleToggleButtonGroup = (_, value) => value && setDistributionMode(value);

  const data = buildData(userSummary, Number(charId), distributionMode);
  const totalDamage = data.reduce((acc, entry) => acc + entry.value, 0);
  const duration = userSummary.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0);
  const dps = duration > 0 ? totalDamage / (duration / 1000) : null;

  const renderSlice = (props) => {
    const { percent } = props;
    const fill = alpha(darken(accent, (1 - percent) * 0.7), 0.9);
    return <Sector {...props} fill={fill} stroke="none" />;
  };

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Damage Distribution"
        subheader={`${formatNum(totalDamage)} total damage${dps != null ? ` · ${formatNum(dps)} DPS` : ''}`}
        action={
          <ToggleButtonGroup
            value={distributionMode}
            onChange={handleToggleButtonGroup}
            exclusive
          >
            {DISTRIBUTION_MODES.map((mode) => (
              <ToggleButton key={mode} value={mode}>
                {formatStr(mode)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
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
              shape={renderSlice}
            />

            <ChartTooltip
              content={({ payload }) => {
                const { name = '', value = 0 } = payload?.[0]?.payload ?? {};
                return (
                  <Paper sx={{ p: 1.5, border: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2">
                      {formatStr(name)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatNum(value)} damage
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
            <XAxis domain={[0, 1]} type="number" />
  
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11 }}
            />
  
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
