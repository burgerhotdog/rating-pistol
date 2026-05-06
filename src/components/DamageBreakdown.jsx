import { useParams } from 'react-router-dom';
import { Box, Card, Paper, ToggleButton, ToggleButtonGroup, Tooltip as MuiTooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { alpha, darken, lighten, useTheme } from '@mui/material/styles';
import { ResponsiveContainer, Pie, PieChart, Tooltip, Cell, Legend } from 'recharts';
import { useState } from 'react';
import { CHARACTERS, MISC } from '@/data';
import { sumRotationDmg, getActionMeta } from '@/utils';

const renderLabel = ({ percent }) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

const FALLBACK_DMG_TYPE_LABELS = {
  HEAL: 'Healing',
  SHIELD: 'Shield',
  BUFF: 'Buff',
};

function resolveDmgTypeLabel(gameId, dmgTypeId) {
  if (!dmgTypeId) return 'Unknown';
  const mapped = MISC?.[gameId]?.ABILITY_TYPES?.[dmgTypeId];
  if (mapped) return mapped;
  return FALLBACK_DMG_TYPE_LABELS[dmgTypeId] ?? dmgTypeId;
}

function resolveOwnerLabel(gameId, ownerId) {
  return CHARACTERS?.[gameId]?.[ownerId]?.name ?? ownerId;
}

/**
 * Builds chart data grouped by damage type (uses getActionMeta to resolve `considered`).
 */
function buildDmgTypeData(actionMap, gameId, characterId) {
  const totals = {};
  for (const [actionKey, { damage }] of Object.entries(actionMap)) {
    const { ownerId, considered } = getActionMeta(gameId, actionKey);
    if (ownerId !== characterId) continue;

    const label = resolveDmgTypeLabel(gameId, considered);
    totals[label] = (totals[label] ?? 0) + damage;
  }
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);
}

/**
 * Builds chart data grouped by owner (character).
 */
function buildOwnerData(actionMap, gameId) {
  const ownerIds = [...new Set(Object.keys(actionMap).map(k => k.split('-')[0]))];
  return ownerIds
    .map(ownerId => ({
      ownerId,
      name: resolveOwnerLabel(gameId, ownerId),
      value: sumRotationDmg(actionMap, { ownerId }),
    }))
    .filter(d => d.value > 0);
}

export const DamageBreakdown = ({ actionMap }) => {
  const { gameId, characterId } = useParams();
  const theme = useTheme();
  const [groupBy, setGroupBy] = useState('owner');

  if (!actionMap) return null;

  const total = sumRotationDmg(actionMap);
  const data = (groupBy === 'owner'
    ? buildOwnerData(actionMap, gameId)
    : buildDmgTypeData(actionMap, gameId, characterId)).sort((a, b) => b.value - a.value);

  const element = CHARACTERS[gameId][characterId].element;
  const monoColor = MISC?.[gameId]?.ELEMENT_COLORS?.[element] ?? theme.palette.primary.main;

  const getSliceFill = (index, count) => {
    if (count <= 1) return alpha(monoColor, 0.95);
    const rank = index / (count - 1);
    const amount = 0.12 + rank * 0.32;
    const toned = index % 2 === 0
      ? lighten(monoColor, amount)
      : darken(monoColor, amount * 0.7);
    return alpha(toned, 0.94);
  };

  const getOwnerSliceFill = (ownerId) => {
    const ownerElement = CHARACTERS?.[gameId]?.[ownerId]?.element;
    const ownerElementColor = MISC?.[gameId]?.ELEMENT_COLORS?.[ownerElement];
    return alpha(ownerElementColor ?? monoColor, 0.95);
  };

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
                  <Cell
                    key={entry.name}
                    fill={groupBy === 'owner'
                      ? getOwnerSliceFill(entry.ownerId)
                      : getSliceFill(index, data.length)}
                    stroke={alpha(theme.palette.background.paper, 0.85)}
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
                      <Typography variant="subtitle2" fontWeight="bold">{name}</Typography>
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
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Card>
  );
};