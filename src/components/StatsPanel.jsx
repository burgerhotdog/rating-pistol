import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Divider, Stack, Typography, Skeleton } from '@mui/material';
import { BuildContext } from '@/contexts';
import { GENERAL_LOOKUP, CHARACTER_LOOKUP, WEAPON_LOOKUP } from '@/lookups';
import { combineEquipStats, computeTotalStat } from '@/utils';

export const StatsPanel = () => {
  const { gameId, charId } = useParams();
  const { buildCollections } = useContext(BuildContext);
  const charBuild = buildCollections[gameId]?.[charId] ?? null;

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
                GENERAL_LOOKUP[gameId].DEFAULT_STATS ?? {},
                CHARACTER_LOOKUP[gameId][charId].FIXED_STATS ?? {},
                WEAPON_LOOKUP[gameId][charBuild.weaponId].FIXED_STATS ?? {},
                combineEquipStats(charBuild.equipList),
              ];
              const { totalValue, isPercent } = computeTotalStat(statId, sourceMapList);
              const adjustedValue = isPercent ? totalValue * 100 : totalValue;
              const toFixedValue = isPercent || (gameId === 'zenless-zone-zero' && statId === 'ER') ? 1 : 0;
              if (statId !== 'EM' && adjustedValue === 0) return;
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
                    {adjustedValue.toFixed(toFixedValue) + (isPercent ? '%' : '')}
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
