import { useParams } from 'react-router-dom';
import { Chip, CardContent, Box, CardHeader, Card, Divider, Stack, Typography, Skeleton, Tooltip } from '@mui/material';
import { MISC, CHARACTER } from '@/data';
import { computeTotalStat, compileStatMap } from '@/utils';
import { CustomAvatar } from '@/components';
import { useBuild } from '@/contexts';
import { TeamMemberDialog } from '@/components/TeamMemberDialog';
import { useState } from 'react';

function getRelativeTime(dateString) {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';
  
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  
  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}

function formatFullDate(dateString) {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';
  
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const StatsPanel = ({ team, updateTeam }) => {
  const { gameId, characterId } = useParams();
  const build = useBuild().getBuilds(gameId)[characterId];
  const { MENU_STATS } = MISC[gameId];
  const [dialogIndex, setDialogIndex] = useState(null);

  const statMap = build ? compileStatMap(gameId, characterId, build) : {};

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
    <Card sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={<CustomAvatar gameId={gameId} characterId={characterId} />}
        title={CHARACTER[gameId][characterId]?.name ?? ''}
        subheader={
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.25 }}>
            <Chip
              label={CHARACTER[gameId][characterId].element}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 'bold',
                color: MISC[gameId].ELEMENT_COLORS[CHARACTER[gameId][characterId].element]
              }}
            />
            <Chip
              label={CHARACTER[gameId][characterId]?.type}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>
        }
      />

      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack spacing={1}>
          {Object.entries(MENU_STATS).map(([id, { label, isPercent }]) => {
            // cd for ww visual change
            const cdww = (gameId === 'wuthering-waves' && id === 'CD') ? 1 : 0;
            const totalValue = computeTotalStat(id, statMap) + cdww;
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
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {displayValue.toFixed(toFixedValue) + (isPercent ? '%' : '')}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
          Team Configuration
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
          {team.map((member, index) => (
            <Box key={index} sx={{ cursor: 'pointer' }} onClick={() => setDialogIndex(index)}>
              <CustomAvatar
                gameId={gameId}
                characterId={member?.memberId ?? null}
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

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ my: 2 }} />

        <Tooltip title={formatFullDate(build?.lastUpdated)}>
          <Typography variant="caption" color="text.secondary">
            Last updated {getRelativeTime(build?.lastUpdated)}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};
