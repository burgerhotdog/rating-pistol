import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Stack, Typography, Skeleton } from '@mui/material';
import { BuildContext } from '@/contexts';
import { GENERAL_LOOKUP, CHARACTER_LOOKUP, WEAPON_LOOKUP } from '@/lookups';
import { combineBaseStats, combineEquipStats } from '@/utils';

export const StatsPanel = () => {
  const { gameId, charId } = useParams();
  const { buildCollections } = useContext(BuildContext);
  const charBuild = buildCollections[gameId]?.[charId] ?? null;

  const { baseStats, equipStats } = useMemo(() => {
    if (!charBuild) return { baseStats: {}, equipStats: {} };

    const baseStats = combineBaseStats(gameId, charId, charBuild.weaponId);
    const equipStats = combineEquipStats(charBuild.equipList);
    return { baseStats, equipStats };
  }, [gameId, charId, charBuild]);

  return (
    <Card
      variant="outlined"
      sx={{ width: 300 }}
    >
      {charBuild ? (
        <Stack p={2} sx={{ height: '100%', overflowY: 'auto' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {CHARACTER_LOOKUP[gameId][charId].NAME}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack gap={1.5} sx={{ flex: 1 }}>
            {GENERAL_LOOKUP[gameId].MENU_STAT_TYPES.map(([statId, statLabel]) => {
              const baseId = `BASE_${statId}`;
              const flatId = `FLAT_${statId}`;
              const percentId = `PERCENT_${statId}`;
              const value = (baseStats[baseId] ?? 0) + (baseStats[baseId] ? baseStats[baseId] : 1) * ((equipStats[percentId] ?? 0) + (CHARACTER_LOOKUP[gameId][charId].ASCENSION_STATS?.[percentId] ?? 0) + (WEAPON_LOOKUP[gameId][charBuild.weaponId].MAIN_STAT?.[percentId] ?? 0)) + ((equipStats[flatId] ?? 0) + (CHARACTER_LOOKUP[gameId][charId].ASCENSION_STATS?.[flatId] ?? 0) + (WEAPON_LOOKUP[gameId][charBuild.weaponId].MAIN_STAT?.[flatId] ?? 0)) + (GENERAL_LOOKUP[gameId].DEFAULT_STATS[percentId] ?? 0);
              const isFlatStat = GENERAL_LOOKUP[gameId].MAIN_STAT_TYPES.some(typeObj => typeObj[flatId]) || GENERAL_LOOKUP[gameId].SUB_STAT_TYPES[flatId] || baseStats[baseId];
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Weapon
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {WEAPON_LOOKUP[gameId][charBuild.weaponId]?.NAME}
            </Typography>
          </Box>

          <Divider sx={{ mt: 'auto', pt: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
            Last Updated: {charBuild.lastUpdated ?? 'Unknown'}
          </Typography>
        </Stack>
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
        />
      )}
    </Card>
  );
};
