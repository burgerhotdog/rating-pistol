import { Box, Card, Divider, Stack, Typography, Skeleton } from '@mui/material';
import { useParams } from 'react-router-dom';
import { GENERAL_LOOKUP, CHARACTER_LOOKUP, WEAPON_LOOKUP } from '@/lookups';
import { buildSourceMapList, computeTotalStat, combineEquipStats } from '@/utils';

export const StatsPanel = ({ id, data }) => {
  const { gameId } = useParams();
  const { MENU_STAT_ORDER } = GENERAL_LOOKUP[gameId];
  const { NAME: CHAR_NAME = '' } = CHARACTER_LOOKUP[gameId][id] ?? {};
  const { NAME: WEAP_NAME = '' } = WEAPON_LOOKUP[gameId][data?.weaponId] ?? {};

  const sourceMapList = data ? buildSourceMapList(gameId, [id, data]) : null;

  return (
    <Card
      variant="outlined"
      sx={{ width: 300 }}
    >
      {data ? (
        <Stack p={2} sx={{ height: '100%', overflowY: 'auto' }}>
          <Typography variant="h6" fontWeight="bold">
            {CHAR_NAME}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack gap={1.5} sx={{ flex: 1 }}>
            {MENU_STAT_ORDER.map(({ id, label, isPercent }) => {
              const totalValue = computeTotalStat(id, sourceMapList);
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
            Last Updated: {data?.lastUpdated ?? 'Unknown'}
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
