import { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Container, Box, Stack, Button, Card, Divider, Typography } from '@mui/material';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { fbGetUser, fbGetAvatars, fbSetAvatar, fbSetAvatarBatch, fbDeleteAvatar } from '@/firebase';
import { Modal, Table, Test } from '@components';
import { AVATAR_DATA, VERSION_DATA, INFO_DATA } from '@data';
import { rateBuild } from '@utils';
import { AVATAR_ASSETS, ICON_ASSETS } from '@assets';
import { AuthContext, BuildContext } from '@contexts';

const Game = () => {
  const { gameId } = useParams();
  const { userId } = useContext(AuthContext);
  const { buildCache } = useContext(BuildContext);
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(0);

  // save avatar to firestore and cache
  /* const saveAvatar = async (id, data) => {
    const dataWithTimestamp = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };

    if (userId) fbSetAvatar(userId, gameId, id, dataWithTimestamp);
    setAvatarCache(prev => ({ ...prev, [id]: dataWithTimestamp }));
  };

  const saveAvatarBatch = async (entries) => {
    const entriesWithTimestamps = entries.map(([id, data]) => [
      id,
      {
        ...data,
        lastUpdated: new Date().toISOString(),
      }
    ]);

    if (userId) fbSetAvatarBatch(userId, gameId, entriesWithTimestamps);
    setAvatarCache(prev => ({ ...prev, ...entriesWithTimestamps }));
  };

  const deleteAvatar = async (id) => {
    if (userId) fbDeleteAvatar(userId, gameId, id);
    setAvatarCache(prev => {
      const newCache = { ...prev };
      delete newCache[id];
      return newCache;
    });
  }; */

  const sortedAvatars = useMemo(() => {
    return Object.entries(buildCache[gameId])
      .sort(([aId, { isPinned: aIsPinned }], [bId, { isPinned: bIsPinned }]) => {
        if ((aIsPinned ?? false) !== (bIsPinned ?? false)) return (bIsPinned ?? false) - (aIsPinned ?? false);

        const aName = AVATAR_DATA[gameId][aId].name;
        const bName = AVATAR_DATA[gameId][bId].name;
        return aName.localeCompare(bName);
      })
      .map(([avatarId]) => Number(avatarId));
  }, [buildCache[gameId]]);

  return (
    <>
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
        </Card>
      </Box>

      {/* <Modal
        gameId={gameId}
        userId={userId}
        modalPipe={modalPipe}
        setModalPipe={setModalPipe}
        avatarCache={avatarCache}
        setAvatarCache={setAvatarCache}
        saveAvatar={saveAvatar}
        saveAvatarBatch={saveAvatarBatch}
        deleteAvatar={deleteAvatar}
      /> */}
    </>
  );
};

export default Game;
