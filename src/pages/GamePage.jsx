import { useState, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Stack, Card, Divider, Typography } from '@mui/material';
import { AVATAR_DATA, WEAPON_DATA } from '@data';
import { AVATAR_ASSETS } from '@assets';
import { BuildDataContext } from '@contexts';

const Game = () => {
  const { gameId } = useParams();
  const { buildData } = useContext(BuildDataContext);
  const [selected, setSelected] = useState(0);

  const sortedAvatars = useMemo(() => {
    return Object.entries(buildData[gameId])
      .sort(([aId, { isPinned: aIsPinned }], [bId, { isPinned: bIsPinned }]) => {
        if ((aIsPinned ?? false) !== (bIsPinned ?? false)) return (bIsPinned ?? false) - (aIsPinned ?? false);

        const aName = AVATAR_DATA[gameId][aId].name;
        const bName = AVATAR_DATA[gameId][bId].name;
        return aName.localeCompare(bName);
      })
      .map(([avatarId]) => Number(avatarId));
  }, [buildData[gameId]]);

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
            key={index}
            src={AVATAR_ASSETS[gameId][avatarId]}
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
              {AVATAR_DATA[gameId][sortedAvatars[selected]]?.name ?? "none"}
            </Typography>
          </Stack>
        </Box>

        <Divider />
        <Typography>
          Last Updated: {buildData[gameId][sortedAvatars[selected]]?.lastUpdated ?? "n/a"}
        </Typography>
        
        <Typography>
          Weapon: {WEAPON_DATA[gameId][buildData[gameId][sortedAvatars[selected]]?.weaponId]?.name ?? "n/a"}
        </Typography>
      </Card>
    </Box>
  );
};

export default Game;
