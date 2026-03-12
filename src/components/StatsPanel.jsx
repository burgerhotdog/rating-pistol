import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { BuildDataContext } from '@/contexts';
import { ALL_CHARACTER_LOOKUP, ALL_WEAPON_LOOKUP } from '@/lookups';

const ALL_STAT_ORDER = {
  'genshin-impact': [
    '_HP',
    '_ATK',
    '_DEF',
    'EM',
    'CR',
    'CD',
    'HB',
    'ER',
    'PYRO',
    'HYDRO',
    'DENDRO',
    'ELECTRO',
    'ANEMO',
    'CRYO',
    'GEO',
    'PHYSICAL',
  ],
  'honkai-star-rail': [
    '_HP',
    '_ATK',
    '_DEF',
    'SPD',
    'CR',
    'CD',
    'BE',
    'OHB',
    'ERR',
    'RES',
    'DMG',
  ],
  'wuthering-waves': [
    '_HP',
    '_ATK',
    '_DEF',
    'ER',
    'CR',
    'CD',
  ],
  'zenless-zone-zero': [
    '_HP',
    '_ATK',
    '_DEF',
    'IMPACT',
    'CR',
    'CD',
    'AM',
    'AP',
    'PR',
    'ER',
  ],
};

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

export const StatsPanel = ({ selectedId, baseStats, equipStats }) => {
  const { gameId } = useParams();
  const { allBuildData } = useContext(BuildDataContext);

  const [selectedBuild, selectedLookup, STAT_ORDER] = useMemo(() => {
    if (!selectedId) return [{}, {}, []];
    return [
      allBuildData[gameId][selectedId],
      ALL_CHARACTER_LOOKUP[gameId][selectedId],
      ALL_STAT_ORDER[gameId],
    ];
  }, [selectedId]);

  const characterName = selectedLookup.name ?? 'Select a character';

  const weaponName = useMemo(() => {
    return ALL_WEAPON_LOOKUP[gameId][selectedBuild.weaponId]?.name ?? '-';
  }, [selectedBuild]);

  const lastUpdated = selectedBuild.lastUpdated ?? 'Unknown';

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
        {STAT_ORDER.map((statId) => {
          const isBaseStat = statId.startsWith('_');
          const isPercentStat = ['CR', 'CD', 'ER'].includes(statId);
          const value = isBaseStat
            ? baseStats[statId] * (1 + (equipStats[statId.slice(1)] || 0)) + (equipStats[statId] || 0)
            : equipStats[statId] ?? 0;
          const offsetValue =
            statId === 'CR' ? 0.05 :
            statId === 'CD' ? 0.5 :
            statId === 'ER' ? 1 : 0;
          const finalValue = (value + offsetValue) * (isPercentStat ? 100 : 1);
          const toFixedValue = isBaseStat || statId === 'EM' ? 0 : 1;
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
                {statId}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {finalValue.toFixed(toFixedValue) + (toFixedValue ? '%' : '')}
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
