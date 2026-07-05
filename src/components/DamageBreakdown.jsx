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

const BREAKDOWN_MODES = [
  { value: 'dmgType', label: 'Dmg type' },
  { value: 'fieldStatus', label: 'Field' },
];

const buildData = (summary, charId, breakdownMode) => {
  const sums = {};

  // TODO: branch on breakdownMode once fieldStatus grouping is implemented.
  // For now this always groups by dmgType regardless of the selected mode.
  for (const { ownerId, dmgType, damage } of Object.values(summary)) {
    if (ownerId !== charId || !damage) continue;
    sums[dmgType] = (sums[dmgType] ?? 0) + damage;
  }

  const entries = Object.entries(sums)
    .map(([key, sum]) => ({
      name: formatStr(key),
      value: Math.round(sum),
    }))
    .filter(entry => entry.value)
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((sum, e) => sum + e.value, 0);
  let cumulative = 0;

  return entries.map(entry => {
    const rank = cumulative / total;
    const percent = entry.value / total;
    cumulative += entry.value;

    return { ...entry, rank, percent };
  });
};

export const DamageBreakdown = ({ userSummary, teamIds }) => {
  const { gameId, characterId } = useParams();
  const { accentColors } = useTheme();

  const [selectedCharId, setSelectedCharId] = useState(characterId);
  const [breakdownMode, setBreakdownMode] = useState('dmgType');

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
            {BREAKDOWN_MODES.map(({ value, label }) => (
              <ToggleButton key={value} value={value} sx={{ px: 1.5, textTransform: 'none' }}>
                {label}
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
              {data.map(({ name, rank }) => {
                const fill = alpha(darken(elementColor, rank * 0.7), 0.9);
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
            {data.map(({ name, value, rank, percent }) => {
              const fill = alpha(darken(elementColor, rank * 0.7), 0.9);

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