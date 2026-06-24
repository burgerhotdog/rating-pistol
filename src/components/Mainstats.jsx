import { useParams } from 'react-router-dom';
import { Stack, Box, Card, CardHeader, Tooltip, Typography, CardMedia } from '@mui/material';
import { alpha } from '@mui/material/styles';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ATTR_ASSETS } from '@/assets';
import { formatStr } from '@/utils';

const getSlots = (config) => {
  if (config.sands != null) {
    return [config.sands, config.goblet, config.circlet].filter(Boolean);
  }

  if (config.four != null) {
    return [config.four, ...(config.three ?? []), ...(config.one ?? [])].filter(Boolean);
  }

  return [];
};

const StatCard = ({ gameId, statId }) => {
  return (
    <Card>
      <CardMedia
        image={ATTR_ASSETS[gameId][statId.replace('%', '')]}
        title={statId}
        sx={{ width: 50, height: 50 }}
      />
    </Card>
  );
};

const USER_COLOR = '#BA7517';

const ConfigRow = ({ gameId, configKey, config, isUser, isSelected, pct, onSelect }) => {
  const slots = getSlots(config);

  return (
    <Box
      onClick={() => onSelect(configKey)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 1.5,
        border: '0.5px solid',
        borderColor: isUser ? alpha(USER_COLOR, 0.35) : isSelected ? 'divider' : 'transparent',
        bgcolor: isUser ? alpha(USER_COLOR, 0.06) : isSelected ? 'action.hover' : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': {
          bgcolor: isUser ? alpha(USER_COLOR, 0.09) : 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{ display: 'flex', gap: 0.5, flex: 1, flexWrap: 'wrap' }}>
          {slots.map((statId, i) => <StatCard key={i} gameId={gameId} statId={statId} />)}
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
            sx={{ color: 'text.secondary', fontFamily: 'monospace', minWidth: 30, textAlign: 'right' }}
          >
            {(pct * 100).toFixed(0)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: '3px', bgcolor: 'divider', borderRadius: 1, mx: 0.25 }}>
        <Box sx={{
          height: '100%',
          width: `${pct * 100}%`,
          bgcolor: isUser ? USER_COLOR : 'primary.main',
          borderRadius: 1,
        }} />
      </Box>
    </Box>
  );
};

export const MainStatConfigs = ({ configMap, userConfigKey, selectedKey, onSelect }) => {
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
    <Card>
      <CardHeader
        title={
          <Stack direction="row" spacing={0.5}>
            <Typography variant="subtitle1">
              Main stat distribution
            </Typography>

            <Tooltip
              title="Most common main stat combinations in simulated builds. Click a row to inspect its substat distribution."
              placement="top"
              arrow
            >
              <HelpOutlineOutlinedIcon
                fontSize="small"
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
            config={config}
            isUser={key === userConfigKey}
            isSelected={key === selectedKey}
            pct={config.count / total}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </Card>
  );
};