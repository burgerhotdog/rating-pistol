import { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { fbGetAvatars, fbSetAvatar, fbSetAvatarBatch, fbDeleteAvatar } from '@/firebase';
import { Modal, Table } from '@components';
import { VERSION_DATA, INFO_DATA } from '@data';
import { rateBuild } from '@utils';

const Game = ({ gameId, userId }) => {
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // initialize avatarCache on mount or auth
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
        const rating = rateBuild(gameId, id, data.weaponId, data.equipList);
        return [id, { data, rating }];
      }))
      setAvatarCache(newCache);
      setIsLoading(false);
    };

    if (userId) initAvatarCache();
    else setAvatarCache({});
  }, [userId, gameId]);

  // save avatar to firestore and cache
  const saveAvatar = async (id, data) => {
    if (userId) fbSetAvatar(userId, gameId, id, data);
    const rating = rateBuild(gameId, id, data.weaponId, data.equipList);
    setAvatarCache(prev => ({ ...prev, [id]: { data, rating } }));
  };

  const saveAvatarBatch = async (entries) => {
    if (userId) fbSetAvatarBatch(userId, gameId, entries);
    const newCache = Object.fromEntries(entries.map(([id, data]) => {
      const rating = rateBuild(gameId, id, data.weaponId, data.equipList);
      return [id, { data, rating }];
    }));
    setAvatarCache(prev => ({ ...prev, ...newCache }));
  };

  const deleteAvatar = async (id) => {
    if (userId) fbDeleteAvatar(userId, gameId, id);
    setAvatarCache(prev => {
      const newCache = { ...prev };
      delete newCache[id];
      return newCache;
    });
  };

  const handleAdd = () => setModalPipe({ type: 'add', id: null, data: null });
  const handleLoad = () => setModalPipe({ type: 'load', id: null, data: null });

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100dvh',
        py: 4,
        gap: 3,
      }}
    >
      <Box textAlign="center">
        <Typography variant="h3" fontWeight="bold">
          {INFO_DATA[gameId].TITLE}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Updated for Version {VERSION_DATA[gameId]}
        </Typography>
      </Box>

      <Table
        gameId={gameId}
        userId={userId}
        avatarCache={avatarCache}
        setAvatarCache={setAvatarCache}
        isLoading={isLoading}
        setModalPipe={setModalPipe}
      />

      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          New Build
        </Button>
        <Button
          onClick={handleLoad}
          variant="outlined"
          endIcon={<KeyboardArrowRight />}
        >
          Load Data
        </Button>
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
    </Container>
  );
};

export default Game;
