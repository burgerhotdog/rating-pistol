import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chip, CardContent, Box, CardHeader, Card, Divider, Stack, Typography, Skeleton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CustomAvatar, TeamMemberDialog } from '@/components';
import { useBuild } from '@/contexts';
import { MISC, CHARACTER } from '@/data';
import { getAttr, formatStr, compileMenuMap } from '@/utils';

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
  const theme = useTheme();
  const { MENU_STATS } = MISC[gameId];
  const [dialogIndex, setDialogIndex] = useState(null);

  const member = team.reduce((acc, member) => {
    if (member.id !== characterId) return acc;
    return member;
  }, null);

  const statMap = member ? compileMenuMap(gameId, characterId, member) : {};

  if (!member) {
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
              label={formatStr(CHARACTER[gameId][characterId].element)}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 'bold',
                color: theme.accentColor[gameId][CHARACTER[gameId][characterId].element]
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
          {MENU_STATS.map((id) => {
            // cd for ww visual change
            const cdww = (gameId === 'wuthering-waves' && id === 'critDmg%') ? 1 : 0;
            const totalValue = getAttr(id, statMap) + cdww;
            const isPercent = id.endsWith('%');
            const displayValue = isPercent ? totalValue * 100 : totalValue;
            const toFixedValue = isPercent ? 1 : 0;
            if (id !== 'elementalMastery' && displayValue === 0) return;
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
                  {formatStr(id)}
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
                characterId={member?.id ?? null}
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

        <Tooltip title={formatFullDate(member.build?.lastUpdated)}>
          <Typography variant="caption" color="text.secondary">
            Last updated {getRelativeTime(member.build?.lastUpdated)}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};
