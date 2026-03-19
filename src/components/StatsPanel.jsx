import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { BuildDataContext } from '@/contexts';
import { ALL_GENERAL_LOOKUP, CHARACTER_LOOKUP, WEAPON_LOOKUP } from '@/lookups';

const StatRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Box>
);

export const StatsPanel = ({ baseStats, equipStats }) => {
  const { gameId, charId } = useParams();
  const { allBuildData } = useContext(BuildDataContext);
  const selectedBuild = allBuildData[gameId][charId];
  const STAT_ORDER = ALL_GENERAL_LOOKUP[gameId].MENU_STAT_TYPES;

  const selectedLookup = CHARACTER_LOOKUP[gameId][charId];

  const characterName = selectedLookup.NAME ?? 'Select a character';
  const weaponName = WEAPON_LOOKUP[gameId][selectedBuild?.weaponId]?.NAME;

  const lastUpdated = selectedBuild?.lastUpdated ?? 'Unknown';

  return (
    <Card
      variant="outlined"
      sx={{
        flex: '0 0 clamp(220px, 20vw, 300px)',
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        borderRadius: 3,
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {characterName}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack gap={1.5} sx={{ flex: 1 }}>
        {STAT_ORDER.map(([statId, statLabel]) => {
          const baseId = `BASE_${statId}`;
          const flatId = `FLAT_${statId}`;
          const percentId = `PERCENT_${statId}`;
          const value = (baseStats[baseId] ?? 0) + (baseStats[baseId] ? baseStats[baseId] : 1) * (equipStats[percentId] ?? 0) + (equipStats[flatId] ?? 0) + (ALL_GENERAL_LOOKUP[gameId].DEFAULT_STATS[percentId] ?? 0);
          const isFlatStat = ALL_GENERAL_LOOKUP[gameId].MAIN_STAT_TYPES.some(typeObj => typeObj[flatId]) || ALL_GENERAL_LOOKUP[gameId].SUB_STAT_TYPES[flatId] || baseStats[baseId];
          const finalValue = value * (isFlatStat ? 1 : 100);
          const toFixedValue = isFlatStat ? 0 : 1;
          if (statId !== 'EM' && finalValue === 0) return;
          return (
            <Box
              key={statId}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {statLabel}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {finalValue.toFixed(toFixedValue) + (isFlatStat ? '' : '%')}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <StatRow
        label="Weapon"
        value={weaponName}
      />

      <Divider sx={{ mt: 'auto', pt: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
        Last Updated: {lastUpdated}
      </Typography>
    </Card>
  );
};
