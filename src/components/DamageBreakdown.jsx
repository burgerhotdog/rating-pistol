import { useParams } from 'react-router-dom';
import { Box, Card, Paper, ToggleButton, ToggleButtonGroup, Tooltip as MuiTooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ResponsiveContainer, Pie, PieChart, Tooltip, Cell, Legend } from 'recharts';
import { useState } from 'react';
import { sumRotationDmg, getSkill } from '@/utils';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6', '#14b8a6'];

const renderLabel = ({ percent }) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

/**
 * Builds chart data grouped by damage type (uses getSkill to resolve `considered`).
 */
function buildDmgTypeData(actionMap, gameId) {
  const totals = {};
  for (const actionKey of Object.keys(actionMap)) {
    const { considered } = getSkill(gameId, actionKey);
    const label = considered ?? 'Unknown';
    const [ownerId, skillId, actionId] = actionKey.split('-');
    const dmg = sumRotationDmg(actionMap, { ownerId, skillId, actionId });
    totals[label] = (totals[label] ?? 0) + dmg;
  }
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);
}

/**
 * Builds chart data grouped by owner (character).
 */
function buildOwnerData(actionMap) {
  const ownerIds = [...new Set(Object.keys(actionMap).map(k => k.split('-')[0]))];
  return ownerIds
    .map(ownerId => ({
      name: ownerId,
      value: sumRotationDmg(actionMap, { ownerId }),
    }))
    .filter(d => d.value > 0);
}

export const DamageBreakdown = ({ actionMap }) => {
  const { gameId } = useParams();
  const [groupBy, setGroupBy] = useState('dmgType');

  if (!actionMap) return null;

  const total = sumRotationDmg(actionMap);
  const data = groupBy === 'owner'
    ? buildOwnerData(actionMap)
    : buildDmgTypeData(actionMap, gameId);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, px: 2, pt: 1.5, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="subtitle2" fontWeight="bold">Damage Breakdown</Typography>
          <MuiTooltip
            title="How damage is distributed across your rotation. Toggle between damage type and teammate views."
            placement="top"
            arrow
          >
            <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
          </MuiTooltip>
        </Box>
        <ToggleButtonGroup
          size="small"
          value={groupBy}
          exclusive
          onChange={(_, val) => val && setGroupBy(val)}
          sx={{ height: 24 }}
        >
          <ToggleButton value="dmgType" sx={{ fontSize: 11, px: 1, py: 0 }}>By Type</ToggleButton>
          <ToggleButton value="owner" sx={{ fontSize: 11, px: 1, py: 0 }}>By Character</ToggleButton>
        </ToggleButtonGroup>
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
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const { name, value } = payload[0].payload;
                  const pct = ((value / total) * 100).toFixed(1);
                  return (
                    <Paper elevation={4} sx={{ p: 1.5, border: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle2" fontWeight="bold">{name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pct}% of total
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
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Card>
  );
};