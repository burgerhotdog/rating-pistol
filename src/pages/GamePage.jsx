import { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Card, Divider, Stack, Typography } from '@mui/material';
import { AVATAR_ASSETS } from '@assets';
import { BuildDataContext, UserDataContext } from '@contexts';
import { AVATAR_DATA, WEAPON_DATA } from '@data';

const Game = () => {
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

        const aName = avatarData[aId]?.name ?? "";
        const bName = avatarData[bId]?.name ?? "";
        return aName.localeCompare(bName);
      })
      .map(([avatarId]) => avatarId);
  }, [buildData, pinnedId]);

  return (
    <Box sx={{ display: "flex", position: "relative", overflow: "hidden",
      flex: 1,
      minHeight: 0 }}>
      {/* ── LEFT: Roster sidebar ── */}
      <Box sx={{
        width: 72, flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        pt: 2.5, gap: 1, position: "relative", zIndex: 10,
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "transparent transparent",
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "transparent",
          borderRadius: 8,
          transition: "background-color 0.2s ease",
        },
        "&:hover": { scrollbarColor: "rgba(255,255,255,0.2) transparent" },
        "&:hover::-webkit-scrollbar-thumb": { backgroundColor: "rgba(255,255,255,0.2)" },
      }}>
        {sortedAvatars.map((avatarId, index) => (
          <Avatar
            key={avatarId}
            src={avatarAssets[avatarId]}
            onClick={() => setSelected(index)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* ── CENTER: Stats panel ── */}
      <Card sx={{
        flex: "0 0 340px",
        p: 2,
        position: "relative", zIndex: 10,
        overflowY: "auto",
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="flex-end" gap={1}>
            <Typography>
              {avatarData[sortedAvatars[selected]]?.name ?? "none"}
            </Typography>
          </Stack>
        </Box>

        <Divider />
        <Typography>
          Last Updated: {buildData[sortedAvatars[selected]]?.lastUpdated ?? "n/a"}
        </Typography>
        
        <Typography>
          Weapon: {weaponData[buildData[sortedAvatars[selected]]?.weaponId]?.name ?? "n/a"}
        </Typography>
      </Card>
    </Box>
  );
};

export default Game;
