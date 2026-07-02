import { useParams } from 'react-router-dom';
import { Avatar, Stack, IconButton, Box, Card, CardHeader, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ATTR_ASSETS } from '@/assets';
import { FlexCard } from '@/components';
import { formatStr } from '@/utils';

const IconRow = ({ gameId, slots }) => {
  return (
    <Card>
      {slots.map((statId, i) =>
        <Tooltip key={i} title={formatStr(statId)}>
          <IconButton>
            <Avatar
              src={ATTR_ASSETS[gameId][statId.replace('%', '')]}
              alt={formatStr(statId)}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Tooltip>
      )}
    </Card>
  )
};

const USER_COLOR = '#BA7517';

const ConfigRow = ({ gameId, configKey, isUser, pct }) => {
  const slots = configKey.split('|');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 1.5,
        border: '0.5px solid',
        borderColor: isUser ? alpha(USER_COLOR, 0.35) : isUser ? 'divider' : 'transparent',
        bgcolor: isUser ? alpha(USER_COLOR, 0.06) : isUser ? 'action.hover' : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': {
          bgcolor: isUser ? alpha(USER_COLOR, 0.09) : 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
          <IconRow gameId={gameId} slots={slots} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          {isUser && (
            <Box sx={{
              bgcolor: alpha(USER_COLOR, 0.12),
              color: USER_COLOR,
              border: '0.5px solid',
              borderColor: alpha(USER_COLOR, 0.4),
              borderRadius: 0.75,
              px: 0.75,
              fontSize: 10,
              fontWeight: 500,
              lineHeight: 1.8,
            }}>
              you
            </Box>
          )}

          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ minWidth: 30, textAlign: 'right' }}
          >
            {(pct * 100).toFixed(0)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: '5px', bgcolor: 'divider', borderRadius: 1, mx: 0.25 }}>
        <Box
          sx={{
            height: '100%',
            width: `${pct * 100}%`,
            bgcolor: isUser ? USER_COLOR : 'primary.main',
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export const MainstatDistribution = ({ configMap, userConfigKey }) => {
  const { gameId } = useParams();
  if (!configMap) return null;

  const entries = Object.entries(configMap);
  const total = entries.reduce((sum, [, c]) => sum + c.count, 0);
  const sorted = entries.slice().sort(([, a], [, b]) => b.count - a.count);
  const userIdx = sorted.findIndex(([k]) => k === userConfigKey);

  const ordered = userIdx >= 0
    ? [sorted[userIdx], ...sorted.filter((_, i) => i !== userIdx)]
    : sorted;

  return (
    <FlexCard>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5}>
            <Typography variant="subtitle1">
              Main stat distribution
            </Typography>

            <Tooltip
              title="Top main stat combinations in simulated builds."
            >
              <HelpOutlineOutlinedIcon
                color="disabled"
              />
            </Tooltip>
          </Stack>
        }
        disableTypography
      />

      <Box sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {ordered.map(([key, config]) => (
          <ConfigRow
            key={key}
            gameId={gameId}
            configKey={key}
            isUser={key === userConfigKey}
            pct={config.count / total}
          />
        ))}
      </Box>
    </FlexCard>
  );
};