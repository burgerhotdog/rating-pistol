import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ATTR_ASSETS } from '@/assets';
import { useAccent } from '@/hooks';
import { formatStr } from '@/utils';

const Mainstats = ({ results }) => {
  const { equipListConfigs, userMainstatConfigKey } = results;
  const { gameId } = useParams();
  const accent = useAccent();

  const data = Object.entries(equipListConfigs)
    .filter(([, config]) => config.trialCount >= 50)
    .sort(([, a], [, b]) => b.trialCount - a.trialCount);

  return (
    <Stack spacing={0.5} sx={{ overflow: 'auto' }}>
      {data.map(([key, config]) => {
        const isUser = key === userMainstatConfigKey;
        const slots = key.split('|');

        return (
          <Box
            key={key}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1.5,
              border: '0.5px solid',
              borderColor: isUser ? alpha(accent, 0.35) : 'transparent',
              bgcolor: isUser ? alpha(accent, 0.06) : 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              '&:hover': {
                bgcolor: isUser ? alpha(accent, 0.09) : 'action.hover',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
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
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                {isUser && (
                  <Box
                    sx={{
                      bgcolor: alpha(accent, 0.12),
                      color: accent,
                      border: '0.5px solid',
                      borderColor: alpha(accent, 0.4),
                      borderRadius: 0.75,
                      px: 0.75,
                      fontSize: 10,
                      fontWeight: 500,
                      lineHeight: 1.8,
                    }}
                  >
                    you
                  </Box>
                )}

                <Tooltip title={`${config.trialCount} of 1000 simulated builds`}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ minWidth: 30, textAlign: 'right' }}
                  >
                    {(config.trialCount / 10).toFixed()}%
                  </Typography>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ height: '5px', bgcolor: 'divider', borderRadius: 1, mx: 0.25 }}>
              <Box
                sx={{
                  height: '100%',
                  width: `${config.trialCount / 10}%`,
                  bgcolor: isUser ? accent : 'text.primary',
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
};

export default Mainstats;
