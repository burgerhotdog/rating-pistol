import { Box, Card, Divider, Stack, Typography, Skeleton } from '@mui/material';
import { STATS, CHARACTERS, WEAPONS } from '@/data';
import { buildSourceMapList, computeTotalStat, mergeEquipList, mergeStatMaps, compileStatMap } from '@/utils';
import { useBuild } from "@/contexts";

export const StatsPanel = ({ gameId, characterId }) => {
  const build = useBuild(gameId, characterId);
  const { MENU_STATS } = STATS[gameId];
  const { name: CHAR_NAME = '' } = CHARACTERS[gameId][characterId] ?? {};
  const { name: WEAP_NAME = '' } = WEAPONS[gameId][build?.weaponId] ?? {};

  const statMap = build ? compileStatMap(gameId, characterId, build, [], "menu") : {};

  return (
    <Card sx={{ width: 300 }}>
      {build ? (
        <Stack p={2} sx={{ height: '100%', overflowY: 'auto' }}>
          <Typography variant="h6" fontWeight="bold">
            {CHAR_NAME}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack gap={1.5} sx={{ flex: 1 }}>
            {Object.entries(MENU_STATS).map(([id, { label, isPercent }]) => {
              const totalValue = computeTotalStat(id, statMap);
              const displayValue = isPercent ? totalValue * 100 : totalValue;
              const toFixedValue = isPercent || (gameId === 'zenless-zone-zero' && id === 'ER') ? 1 : 0;
              if (id !== 'EM' && displayValue === 0) return;
              return (
                <Box
                  key={id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {displayValue.toFixed(toFixedValue) + (isPercent ? '%' : '')}
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
            <Typography variant="body2" fontWeight="bold">
              {WEAP_NAME}
            </Typography>
          </Box>

          <Divider sx={{ mt: 'auto', pt: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
            Last Updated: {build?.lastUpdated ?? 'Unknown'}
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
