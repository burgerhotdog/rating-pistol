import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CardHeader,
  Stack,
  Divider,
  Paper,
  Tooltip,
  Typography,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from '@mui/material';
import { alpha, darken, useTheme } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { PieChart, Pie, Tooltip as ChartTooltip, Cell } from 'recharts';
import { FlexRow, FlexCol, FlexCard, ChartFill, Dot } from '@/components';
import { CHARACTER } from '@/data';
import { formatStr, formatNum } from '@/utils';

const VALID_CATEGORIES = new Set([
  'normalAttack',
  'resonanceSkill',
  'forteCircuit',
  'resonanceLiberation',
  'introSkill',
]);

const BREAKDOWN_MODES = [
  'damageType',
  'category',
];

const buildData = (summary, currId, breakdownMode) => {
  const damageByType = {};

  const getType = (snapshot) => {
    if (breakdownMode === 'damageType') {
      if (!snapshot.damageType) console.log(snapshot);
      return snapshot.damageType ?? 'other';
    } else {
      const { category } = snapshot;
      if (!VALID_CATEGORIES.has(category)) return 'other';
      return category;
    }
  };

  // TODO: branch on breakdownMode once fieldStatus grouping is implemented.
  // For now this always groups by dmgType regardless of the selected mode.
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

export const DamageBreakdown = ({ userSummary, teamIds }) => {
  const { gameId, charId } = useParams();
  const { accentColors } = useTheme();

  const [selectedCharId, setSelectedCharId] = useState(charId);
  const [breakdownMode, setBreakdownMode] = useState('damageType');

  if (!userSummary) return null;

  const data = buildData(userSummary, selectedCharId, breakdownMode);

  const { element } = CHARACTER[gameId][selectedCharId];
  const elementColor = accentColors[gameId][element];

  return (
    <FlexCard>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle1">
              Damage breakdown
            </Typography>

            <Tooltip
              title="How damage is distributed across your rotation."
            >
              <HelpOutlineOutlinedIcon
                color="disabled"
              />
            </Tooltip>
          </Stack>
        }
        action={
          <ToggleButtonGroup
            value={breakdownMode}
            onChange={(_, value) => value && setBreakdownMode(value)}
            exclusive
          >
            {BREAKDOWN_MODES.map((mode) => (
              <ToggleButton
                key={mode}
                value={mode}
                sx={{ px: 1.5, textTransform: 'none' }}
              >
                {formatStr(mode)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
        disableTypography
      />

      <FlexRow>
        <ChartFill>
          <PieChart>
            <Pie data={data} dataKey="value">
              {data.map(({ name, percent }) => {
                const fill = alpha(darken(elementColor, (1 - percent) * 0.7), 0.9);
                return (<Cell key={name} fill={fill} stroke="none" />);
              })}
            </Pie>

            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const { name, value } = payload[0].payload;

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
        </ChartFill>

        <FlexCol spacing={1}>
          <TextField
            select
            value={selectedCharId}
            onChange={(e) => setSelectedCharId(e.target.value)}
            fullWidth
          >
            {teamIds.map((id) => (
              <MenuItem key={id} value={id}>
                {CHARACTER[gameId][id].name}
              </MenuItem>
            ))}
          </TextField>

          <Stack spacing={0.5} sx={{ flexGrow: 1, justifyContent: 'center' }}>
            {data.map(({ name, percent }) => {
              const fill = alpha(darken(elementColor, (1 - percent) * 0.7), 0.9);

              return (
                <Stack
                  key={name}
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: 'center' }}
                >
                  <Dot color={fill} />

                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {name}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    {(percent * 100).toFixed()}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </FlexCol>
      </FlexRow>
    </FlexCard>
  );
};