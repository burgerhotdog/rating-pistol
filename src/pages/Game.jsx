import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Button, Stack, IconButton, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { fbGetUser, fbGetAvatars, fbSetAvatar, fbSetAvatarBatch, fbDeleteAvatar } from '@/firebase';
import { Modal, Table, Test } from '@components';
import { VERSION_DATA, INFO_DATA } from '@data';
import { rateBuild } from '@utils';
import { ICON_ASSETS } from '@assets';

const Game = ({ gameId, userId }) => {
  const [starred, setStarred] = useState([]);
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // initialize starred and avatarCache on mount or auth
  useEffect(() => {
    const initStarred = async () => {
      const snapshot = await fbGetUser(userId);
      if (!snapshot) return;

      const savedStarred = snapshot.data()?.[`${gameId}_starred`];
      if (!savedStarred) return;

      setStarred(savedStarred);
    };

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

    if (userId) {
      initStarred();
      initAvatarCache();
    } else {
      setStarred([]);
      setAvatarCache({});
    }
  }, [userId, gameId]);

  // save avatar to firestore and cache
  const saveAvatar = async (id, data) => {
    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (userId) fbSetAvatar(userId, gameId, id, dataWithTimestamp);
    const rating = rateBuild(gameId, id, data.weaponId, data.equipList);
    setAvatarCache(prev => ({ ...prev, [id]: { data: dataWithTimestamp, rating } }));
  };

  const saveAvatarBatch = async (entries) => {
    const entriesWithTimestamps = entries.map(([id, data]) => [
      id,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    ]);

    if (userId) fbSetAvatarBatch(userId, gameId, entriesWithTimestamps);
    const newCache = Object.fromEntries(entriesWithTimestamps.map(([id, data]) => {
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100dvh',
        maxWidth: 'lg',
        py: 2,
        gap: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit',
              borderBottom: '2px solid transparent',
              '&:hover': {
                borderBottomColor: 'currentColor',
              }
            }}
          >
            <Box
              component="img"
              alt="icon"
              src={ICON_ASSETS.default}
              sx={{ width: 40, height: 'auto' }}
            />
            <Typography variant="h6" fontWeight="bold">
              Rating Pistol
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'relative',
              height: 40,
              width: 40,
              '&:hover .fan-icon': {
                transform: 'translateX(var(--spread))',
              },
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <IconButton
                key={i}
                size="small"
                className="fan-icon"
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transition: 'transform 0.25s ease',
                  '--spread': `${i * 40}px`,
                  zIndex: 4 - i,
                }}
              >
                <SportsEsportsIcon />
              </IconButton>
            ))}
          </Box>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {userId ? "Signed In" : "Not Signed In"}
        </Typography>
      </Box>

      <Box textAlign="center">
        <Typography variant="h3" fontWeight="bold">
          {INFO_DATA[gameId].TITLE}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Updated for Version {VERSION_DATA[gameId]}
        </Typography>
      </Box>

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
      <Test />

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
