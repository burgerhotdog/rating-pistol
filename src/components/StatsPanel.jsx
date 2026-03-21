import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Stack, Typography, Skeleton } from '@mui/material';
import { BuildContext } from '@/contexts';
import { GENERAL_LOOKUP, CHARACTER_LOOKUP, WEAPON_LOOKUP } from '@/lookups';
import { combineBaseStats, combineEquipStats, computeTotalStat } from '@/utils';

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
              const sourceMapList = [
                baseStats,
                equipStats,
                CHARACTER_LOOKUP[gameId][charId].ASCENSION_STATS ?? {},
                WEAPON_LOOKUP[gameId][charBuild.weaponId].MAIN_STAT ?? {},
                GENERAL_LOOKUP[gameId].DEFAULT_STATS ?? {},
              ];
              const { totalValue, isPercent } = computeTotalStat(statId, sourceMapList);
              const finalValue = totalValue * (isPercent ? 100 : 1);
              const toFixedValue = isPercent ? 1 : 0;
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
                    {finalValue.toFixed(toFixedValue) + (isPercent ? '%' : '')}
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
