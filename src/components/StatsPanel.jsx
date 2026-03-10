import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { BuildDataContext } from '@/contexts';
import { ALL_CHARACTER_LOOKUP, ALL_WEAPON_LOOKUP } from '@/lookups';

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

export const StatsPanel = ({ selectedId }) => {
  const { gameId } = useParams();
  const selectedCharacter = ALL_CHARACTER_LOOKUP[gameId][selectedId];
  const currentBuild = useContext(BuildDataContext).allBuildData[gameId][selectedId];

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
        {selectedCharacter?.name ?? 'Select a character'}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack gap={1.5} sx={{ flex: 1 }}>
        <StatRow
          label="Weapon"
          value={ALL_WEAPON_LOOKUP[gameId][currentBuild?.weaponId]?.name ?? '—'}
        />
        <StatRow label="HP" value="—" />
        <StatRow label="ATK" value="—" />
        <StatRow label="DEF" value="—" />
        <StatRow label="CRIT Rate" value="—" />
        <StatRow label="CRIT DMG" value="—" />
        <StatRow label="Energy Recharge" value="—" />
        <StatRow label="Elemental Mastery" value="—" />
      </Stack>

      <Divider sx={{ mt: 'auto', pt: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
        Last Updated: {currentBuild?.lastUpdated ?? 'n/a'}
      </Typography>
    </Card>
  );
};
