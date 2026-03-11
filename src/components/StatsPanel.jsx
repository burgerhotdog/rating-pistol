import { useContext, useState, useMemo } from 'react';
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

export const StatsPanel = ({ selectedId, baseStats, buildStats }) => {
  const { gameId } = useParams();
  const allBuildData = useContext(BuildDataContext);

  const characterName = useMemo(() => {
    return ALL_CHARACTER_LOOKUP[gameId][selectedId]?.name ?? 'Select a character';
  }, [selectedId]);

  const weaponName = useMemo(() => {
    const currentBuild = allBuildData[gameId]?.[selectedId];
    return ALL_WEAPON_LOOKUP[gameId][currentBuild?.weaponId]?.name ?? '-';
  }, [selectedId]);

  const lastUpdated = useMemo(() => {
    const currentBuild = allBuildData[gameId]?.[selectedId];
    return currentBuild?.lastUpdated ?? 'n/a';
  }, [selectedId]);

  const totalHP = ((baseStats._HP || 0) * (1 + ((buildStats.HP || 0) / 100))) + (buildStats._HP || 0);
  const totalATK = ((baseStats._ATK || 0) * (1 + ((buildStats.ATK || 0) / 100))) + (buildStats._ATK || 0);
  const totalDEF = ((baseStats._DEF || 0) * (1 + ((buildStats.DEF || 0) / 100))) + (buildStats._DEF || 0);
  const totalCR = (buildStats.CR ?? 0);
  const totalCD = (buildStats.CD ?? 0);
  const totalER = 100 + (buildStats.ER ?? 0);
  const totalEM = (buildStats.EM ?? 0);

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
        <StatRow
          label="Weapon"
          value={weaponName}
        />
        <StatRow label="HP" value={Math.round(totalHP)} />
        <StatRow label="ATK" value={Math.round(totalATK)} />
        <StatRow label="DEF" value={Math.round(totalDEF)} />
        <StatRow label="CRIT Rate" value={Math.round(totalCR)} />
        <StatRow label="CRIT DMG" value={Math.round(totalCD)} />
        <StatRow label="Energy Recharge" value={Math.round(totalER)} />
        <StatRow label="Elemental Mastery" value={Math.round(totalEM)} />
      </Stack>

      <Divider sx={{ mt: 'auto', pt: 2 }} />
      <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
        Last Updated: {lastUpdated}
      </Typography>
    </Card>
  );
};
