import { useParams } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Card, Tooltip, Typography } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { formatStr } from '@/utils';

const STAT_COLORS = {
  'critRate%': '#EF6C00', 'critDmg%': '#E91E63',
  'atk%': '#F44336', 'atk': '#F44336',
  'hp%': '#2196F3',  'hp':  '#2196F3',
  'def%': '#FF9800', 'def': '#FF9800',
  'er%': '#9C27B0',  'em':  '#4CAF50',
  'pyro%': '#F4511E', 'hydro%': '#2196F3', 'cryo%': '#00BCD4',
  'electro%': '#9C27B0', 'anemo%': '#8BC34A',
  'geo%': '#FFC107', 'dendro%': '#4CAF50', 'phys%': '#9E9E9E',
};

const statColor = (id) => STAT_COLORS[id] ?? '#9E9E9E';

// Handles both GI (sands/goblet/circlet) and WW (four/three[]/one[])
const getSlots = (config) => {
  if (config.sands != null) {
    return [config.sands, config.goblet, config.circlet].filter(Boolean);
  }
  if (config.four != null) {
    return [config.four, ...(config.three ?? []), ...(config.one ?? [])].filter(Boolean);
  }
  return [];
};

const StatChip = ({ statId }) => {
  const color = statColor(statId);
  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      bgcolor: alpha(color, 0.12),
      color,
      border: '0.5px solid',
      borderColor: alpha(color, 0.35),
      borderRadius: 0.75,
      px: 0.5,
      lineHeight: 1.4,
      fontSize: 11,
      fontWeight: 500,
      fontFamily: 'monospace',
      whiteSpace: 'nowrap',
    }}>
      {formatStr(statId)}
    </Box>
  );
};

const USER_COLOR = '#BA7517';

const RANK_ACCENT = { 1: '#FFD700', 2: '#B0BEC5', 3: '#CD7F32' };

const RankBadge = ({ rank }) => {
  const color = RANK_ACCENT[rank];
  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 24,
      height: 18,
      borderRadius: 0.75,
      bgcolor: color ? alpha(color, 0.15) : 'transparent',
      border: '0.5px solid',
      borderColor: color ? alpha(color, 0.45) : 'transparent',
      flexShrink: 0,
    }}>
      <Typography variant="caption" sx={{
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: 700,
        color: color ?? 'text.disabled',
        lineHeight: 1,
      }}>
        #{rank}
      </Typography>
    </Box>
  );
};

const ConfigRow = ({ configKey, config, rank, isUser, isSelected, pct, onSelect }) => {
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
        borderColor: isUser
          ? alpha(USER_COLOR, 0.35)
          : isSelected
          ? 'divider'
          : 'transparent',
        bgcolor: isUser
          ? alpha(USER_COLOR, 0.06)
          : isSelected
          ? 'action.hover'
          : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': {
          bgcolor: isUser ? alpha(USER_COLOR, 0.09) : 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <RankBadge rank={rank} />

        <Box sx={{ display: 'flex', gap: 0.5, flex: 1, flexWrap: 'wrap' }}>
          {slots.map((statId, i) => <StatChip key={i} statId={statId} />)}
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
  if (!configMap) return null;

  const entries = Object.entries(configMap);
  const total = entries.reduce((sum, [, c]) => sum + c.count, 0);
  const sorted = entries.slice().sort(([, a], [, b]) => b.count - a.count);
  const userIdx = sorted.findIndex(([k]) => k === userConfigKey);

  const ordered = userIdx >= 0
    ? [sorted[userIdx], ...sorted.filter((_, i) => i !== userIdx)]
    : sorted;

  return (
    <Card sx={{ width: 400, flexShrink: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Main stat configs
        </Typography>
        <Tooltip
          title="Most common main stat combinations in simulated builds. Click a row to inspect its substat distribution."
          placement="top"
          arrow
        >
          <HelpOutlineOutlinedIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      </Box>

      <Box sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {ordered.map(([key, config]) => (
          <ConfigRow
            key={key}
            configKey={key}
            config={config}
            rank={sorted.findIndex(([k]) => k === key) + 1}
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