import { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Card, Divider, Stack, Typography } from '@mui/material';
import { AVATAR_ASSETS } from '@/assets';
import { BuildDataContext, UserDataContext } from '@/contexts';
import { AVATAR_DATA, WEAPON_DATA } from '@/data';

const PlaceholderGraph = ({ title, sx, ...props }) => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      bgcolor: 'rgba(255,255,255,0.02)',
      minHeight: 0,
      ...sx,
    }}
    {...props}
  >
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Box>
);

const StatRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Box>
);

const GamePage = () => {
  const { gameId } = useParams();
  const buildData = useContext(BuildDataContext)?.buildDatas[gameId] ?? {};
  const pinnedId = useContext(UserDataContext)?.pinnedIds[gameId] ?? null;
  const avatarData = AVATAR_DATA[gameId] ?? {};
  const weaponData = WEAPON_DATA[gameId] ?? {};
  const avatarAssets = AVATAR_ASSETS[gameId] ?? {};
  const [selected, setSelected] = useState(0);

  const sortedAvatars = useMemo(() => {
    return Object.entries(buildData)
      .sort(([aId], [bId]) => {
        if (pinnedId === String(aId)) return -1;
        if (pinnedId === String(bId)) return 1;
        const aName = avatarData[aId]?.name ?? '';
        const bName = avatarData[bId]?.name ?? '';
        return aName.localeCompare(bName);
      })
      .map(([avatarId]) => avatarId);
  }, [buildData, pinnedId]);

  const currentId = sortedAvatars[selected];
  const currentAvatar = avatarData[currentId];
  const currentBuild = buildData[currentId];

  return (
    <Box sx={{ display: 'flex', flex: 1, minHeight: 0, gap: 2, pb: 2, overflow: 'hidden' }}>

      {/* ── Roster sidebar ── */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 72,
        flexShrink: 0,
      }}>
        <Box sx={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          py: 1,
          px: 0.5,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'sticky',
            bottom: 0,
            display: 'block',
            width: '100%',
            height: 40,
            flexShrink: 0,
            background: (theme) =>
              `linear-gradient(transparent, ${theme.palette.background.default})`,
            pointerEvents: 'none',
          },
        }}>
          {sortedAvatars.map((avatarId, index) => (
            <Avatar
              key={avatarId}
              src={avatarAssets[avatarId]}
              onClick={() => setSelected(index)}
              sx={{
                width: 46,
                height: 46,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                outline: selected === index
                  ? '2px solid'
                  : '2px solid transparent',
                outlineColor: selected === index
                  ? 'primary.main'
                  : 'transparent',
                outlineOffset: 2,
                opacity: selected === index ? 1 : 0.55,
                filter: selected === index ? 'none' : 'grayscale(0.4)',
                '&:hover': {
                  opacity: 1,
                  filter: 'none',
                  transform: 'scale(1.05)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* ── Stats panel ── */}
      <Card
        variant="outlined"
        sx={{
          flex: '0 0 clamp(220px, 20vw, 300px)',
          display: 'flex',
          flexDirection: 'column',
          p: 2.5,
          borderRadius: 3,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {currentAvatar?.name ?? 'Select a character'}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Stack gap={1.5} sx={{ flex: 1 }}>
          <StatRow
            label="Weapon"
            value={weaponData[currentBuild?.weaponId]?.name ?? '—'}
          />
          <StatRow label="HP" value="—" />
          <StatRow label="ATK" value="—" />
          <StatRow label="DEF" value="—" />
          <StatRow label="CRIT Rate" value="—" />
          <StatRow label="CRIT DMG" value="—" />
          <StatRow label="Energy Recharge" value="—" />
          <StatRow label="Elemental Mastery" value="—" />
        </Stack>

        <Divider sx={{ mt: 'auto', pt: 2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ pt: 1 }}>
          Last Updated: {currentBuild?.lastUpdated ?? 'n/a'}
        </Typography>
      </Card>

      {/* ── Graphs panel ── */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
      }}>
        <PlaceholderGraph title="Distribution Graph" sx={{ flex: 3 }} />

        <Box sx={{ flex: 2, display: 'flex', gap: 2, minHeight: 0 }}>
          <PlaceholderGraph title="Stat Breakdown" />
          <PlaceholderGraph title="Comparison" />
        </Box>
      </Box>
    </Box>
  );
};

export default GamePage;
