import { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Container, Box, Stack, Button, Card, Divider, Typography } from '@mui/material';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { fbGetUser, fbGetAvatars, fbSetAvatar, fbSetAvatarBatch, fbDeleteAvatar } from '@/firebase';
import { Modal, Table, Test } from '@components';
import { AVATAR_DATA, VERSION_DATA, INFO_DATA } from '@data';
import { rateBuild } from '@utils';
import { AVATAR_ASSETS, ICON_ASSETS } from '@assets';
import { AuthContext } from '@contexts';

const Game = () => {
  const { gameId } = useParams();
  const { user } = useContext(AuthContext);
  const userId = user?.uid;
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(0);

  // initialize starred and avatarCache on mount or auth
  useEffect(() => {
    const initAvatarCache = async () => {
      setIsLoading(true);
      const snapshot = await fbGetAvatars(userId, gameId);
      if (!snapshot) {
        setAvatarCache({});
        setIsLoading(false);
        return;
      };

      const newCache = Object.fromEntries(snapshot.docs.map(doc => {
        const id = doc.id;
        const data = doc.data();
        return [id, data];
      }))
      setAvatarCache(newCache);
      setIsLoading(false);
    };

    if (userId) {
      initAvatarCache();
      setSelected(0);
    } else {
      setAvatarCache({});
      setSelected(0);
    }
  }, [userId, gameId]);

  // save avatar to firestore and cache
  const saveAvatar = async (id, data) => {
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
  };

  const sortedAvatars = useMemo(() => {
    return Object.entries(avatarCache)
      .sort(([aId, { isPinned: aIsPinned }], [bId, { isPinned: bIsPinned }]) => {
        if (aIsPinned !== bIsPinned) return bIsPinned - aIsPinned;

        const aName = AVATAR_DATA[gameId][aId].name;
        const bName = AVATAR_DATA[gameId][bId].name;
        return aName.localeCompare(bName);
      })
      .map(([avatarId]) => Number(avatarId));
  }, [avatarCache]);

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
        }}>
          {sortedAvatars.map((avatarId, index) => (
            <Avatar key={index} src={AVATAR_ASSETS[gameId][avatarId]} onClick={() => setSelected(index)} />
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

      <Modal
        gameId={gameId}
        userId={userId}
        modalPipe={modalPipe}
        setModalPipe={setModalPipe}
        avatarCache={avatarCache}
        setAvatarCache={setAvatarCache}
        saveAvatar={saveAvatar}
        saveAvatarBatch={saveAvatarBatch}
        deleteAvatar={deleteAvatar}
      />
    </>
  );
};

export default Game;
