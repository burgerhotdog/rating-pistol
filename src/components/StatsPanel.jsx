import { Chip, CardContent, Box, CardHeader, Card, Divider, Stack, Typography, Skeleton } from '@mui/material';
import { MISC, CHARACTERS, WEAPONS } from '@/data';
import { computeTotalStat, compileStatMap } from '@/utils';
import { CustomAvatar } from "@/components";
import { TeamMemberDialog } from "@/components/TeamMemberDialog";
import { useState } from 'react';

export const StatsPanel = ({ gameId, characterId, build, team, updateTeam }) => {
  const { MENU_STATS } = MISC[gameId];
  const [dialogIndex, setDialogIndex] = useState(null);

  const statMap = build ? compileStatMap(gameId, characterId, build, [], "menu") : {};

  if (!build) {
    return (
      <Card sx={{ width: 300 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
        />
      </Card>
    )
  }

  return (
    <Card sx={{ width: 300 }}>
      <CardHeader
        avatar={<CustomAvatar gameId={gameId} characterId={characterId} />}
        title={CHARACTERS[gameId]?.[characterId]?.name ?? ""}
        subheader={
          <Chip
            label={CHARACTERS[gameId]?.[characterId]?.element ?? ""}
            variant="outlined"
            size="small"
            sx={{
              color: MISC[gameId]?.ELEMENT_COLORS[CHARACTERS[gameId]?.[characterId]?.element]
            }}
          />
        }
      />

      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Weapon
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {WEAPONS[gameId]?.[build?.weaponId]?.name ?? ""}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack gap={1}>
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

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          Team
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          {team.map((member, index) => (
            <Box key={index} sx={{ cursor: 'pointer' }} onClick={() => setDialogIndex(index)}>
              <CustomAvatar
                gameId={gameId}
                characterId={member?.characterId ?? null}
              />
            </Box>
          ))}
        </Stack>

        {dialogIndex !== null && (
          <TeamMemberDialog
            gameId={gameId}
            member={team[dialogIndex]}
            open={dialogIndex !== null}
            onClose={() => setDialogIndex(null)}
            onSave={(updatedMember) => updateTeam(dialogIndex, updatedMember)}
          />
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          Last Updated: {build?.lastUpdated ?? 'Unknown'}
        </Typography>
      </CardContent>
    </Card>
  );
};
