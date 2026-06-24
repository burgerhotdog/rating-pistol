import { useParams } from 'react-router-dom';
import { Box, Card, Paper, Tooltip as MuiTooltip, Typography } from '@mui/material';
import { alpha, darken, lighten, useTheme } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ResponsiveContainer, Pie, PieChart, Tooltip, Cell, Legend } from 'recharts';
import { CHARACTER } from '@/data';
import { formatStr } from '@/utils';

const renderLabel = ({ percent }) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

const buildDmgTypeData = (summary, charId) => {
  const totals = {};

  for (const footprint of Object.values(summary)) {
    const { ownerId, dmgType, damage } = footprint;
    if (ownerId !== charId || !damage) continue;

    totals[dmgType] ??= 0;
    totals[dmgType] += damage;
  }

  return Object.entries(totals).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
};

export const DamageBreakdown = ({ userSummary }) => {
  const { gameId, characterId } = useParams();
  const theme = useTheme();
  if (!userSummary) return null;

  const data = buildDmgTypeData(userSummary, characterId).sort((a, b) => b.value - a.value);

  const element = CHARACTER[gameId][characterId].element;
  const monoColor = theme.accentColors[gameId][element];

  const getSliceFill = (index, count) => {
    if (count <= 1) return alpha(monoColor, 0.95);
    const rank = index / (count - 1);
    const amount = 0.12 + rank * 0.32;
    const toned = index % 2 === 0
      ? lighten(monoColor, amount)
      : darken(monoColor, amount * 0.7);
    return alpha(toned, 0.94);
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, px: 2, pt: 1.5, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="subtitle2">
            Damage Breakdown
          </Typography>

          <MuiTooltip
            title="How damage is distributed across your rotation."
            placement="top"
            arrow
          >
            <HelpOutlineOutlinedIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
          </MuiTooltip>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={2}
                label={renderLabel}
                labelLine={false}
                animationBegin={0}
                animationDuration={600}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={getSliceFill(index, data.length)}
                    stroke="none"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const { name, value } = payload[0].payload;
                  return (
                    <Paper elevation={4} sx={{ p: 1.5, border: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle2">
                        {formatStr(name)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {value.toLocaleString('en-US', { maximumFractionDigits: 0 })} damage
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
                formatter={(value) => formatStr(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Card>
  );
};