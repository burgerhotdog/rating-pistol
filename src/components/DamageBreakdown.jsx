import { useParams } from 'react-router-dom';
import { CardHeader, Stack, Paper, Tooltip, Typography } from '@mui/material';
import { alpha, darken, useTheme } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { PieChart, Pie, Tooltip as ChartTooltip, Cell, Legend } from 'recharts';
import { FlexCard, ChartFill } from '@/components';
import { CHARACTER } from '@/data';
import { formatStr, formatNum } from '@/utils';

const renderLabel = ({ percent }) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

const buildData = (summary, charId) => {
  const dmgTypeSums = {};

  for (const { ownerId, dmgType, damage } of Object.values(summary)) {
    if (ownerId !== charId || !damage) continue;
    dmgTypeSums[dmgType] = (dmgTypeSums[dmgType] ?? 0) + damage;
  }

  const entries = Object.entries(dmgTypeSums)
    .map(([dmgType, sum]) => ({
      name: formatStr(dmgType),
      value: Math.round(sum),
    }))
    .filter(entry => entry.value)
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((sum, e) => sum + e.value, 0);
  let cumulative = 0;

  return entries.map(entry => {
    const rank = cumulative / total;
    cumulative += entry.value;

    return { ...entry, rank };
  });
};

export const DamageBreakdown = ({ userSummary }) => {
  const { gameId, characterId } = useParams();
  const { accentColors } = useTheme();
  if (!userSummary) return null;

  const data = buildData(userSummary, characterId);

  const { element } = CHARACTER[gameId][characterId];
  const elementColor = accentColors[gameId][element];

  return (
    <FlexCard>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5}>
            <Typography variant="subtitle1">
              Damage breakdown
            </Typography>

            <Tooltip
              title="How damage is distributed across your rotation."
              placement="top"
              arrow
            >
              <HelpOutlineOutlinedIcon
                fontSize="small"
                color="disabled"
              />
            </Tooltip>
          </Stack>
        }
        disableTypography
      />

      <ChartFill>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius="70%"
            label={renderLabel}
            labelLine={false}
          >
            {data.map(entry => {
              const { name, rank } = entry;
              const fill = alpha(darken(elementColor, rank * 0.7), 0.9);

              return (
                <Cell
                  key={name}
                  fill={fill}
                  stroke="none"
                />
              );
            })}
          </Pie>

          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const { name, value } = payload[0].payload;

              return (
                <Paper elevation={4} sx={{ p: 1.5, border: 1, borderColor: 'divider' }}>
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

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
            formatter={value => formatStr(value)}
          />
        </PieChart>
      </ChartFill>
    </FlexCard>
  );
};