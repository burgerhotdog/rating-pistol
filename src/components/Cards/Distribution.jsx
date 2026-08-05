import { useState } from 'react';
import { useParams } from 'react-router-dom';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, darken } from '@mui/material/styles';
import {
  Bar,
  Cell,
  Pie,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { BarChart, PieChart } from '@/components';
import { useElementColors } from '@/hooks';
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

const Distribution = ({ userSummary }) => {
  const { charId } = useParams();
  const [distributionMode, setDistributionMode] = useState('damageType');

  const handleToggleButtonGroup = (_, value) => value && setDistributionMode(value);

  const color = useElementColors({ char: '$curr' });

  const data = buildData(userSummary, charId, distributionMode);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Damage Distribution
            </Typography>

            <Tooltip title="How damage is distributed across your rotation.">
              <HelpOutlineOutlinedIcon color="disabled" />
            </Tooltip>
          </Stack>
        }
        action={
          <ToggleButtonGroup
            value={distributionMode}
            onChange={handleToggleButtonGroup}
          >
            {DISTRIBUTION_MODES.map((mode) => (
              <ToggleButton key={mode} value={mode}>
                {formatStr(mode)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
        disableTypography
      />

      <CardContent component={Stack} sx={{ flex: 1 }}> 
        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              animationBegin={0}
            >
              {data.map(({ name, percent }) => {
                const fill = alpha(darken(color, (1 - percent) * 0.7), 0.9);
                return (<Cell key={name} fill={fill} stroke="none" />);
              })}
            </Pie>

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
            layout="vertical"
            data={data}
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
              fill={color}
            />
          </BarChart>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Distribution;
