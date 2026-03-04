import { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Stack, Button, Card, Divider, Typography } from '@mui/material';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { fbGetUser, fbGetAvatars, fbSetAvatar, fbSetAvatarBatch, fbDeleteAvatar } from '@/firebase';
import { Modal, Table, Test } from '@components';
import { VERSION_DATA, INFO_DATA } from '@data';
import { rateBuild } from '@utils';
import { ICON_ASSETS } from '@assets';
import { AuthContext } from '@contexts';

const temp = {
  'genshin-impact': 'gi',
  'honkai-star-rail': 'hsr',
  'wuthering-waves': 'ww',
  'zenless-zone-zero': 'zzz',
};

const Game = () => {
  const { gamePath } = useParams();
  const gameId = temp[gamePath];
  const { user } = useContext(AuthContext);
  const userId = user?.uid;
  const [starred, setStarred] = useState([]);
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(0);

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

  const sortedAvatars = useMemo(() => {
    return Object.entries(avatarCache)
      .sort(([aId, { rating: aRating }], [bId, { rating: bRating }]) => {
        const aIsStar = starred.includes(Number(aId));
        const bIsStar = starred.includes(Number(bId));
        if (aIsStar !== bIsStar) return bIsStar - aIsStar;

        const aScore = aRating ? aRating.rolls / aRating.bench : -1;
        const bScore = bRating ? bRating.rolls / bRating.bench : -1;
        return bScore - aScore;
      })
      .map(([avatarId]) => Number(avatarId));
  }, [avatarCache, starred]);

  return (
    <Container
      maxWidth='lg'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100dvh',
        py: 2,
        gap: 2,
      }}
    >
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

      <Box sx={{ display: "flex", position: "relative", overflow: "hidden" }}>
        {/* ── LEFT: Roster sidebar ── */}
        <Box sx={{
          width: 72, flexShrink: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
          pt: 2.5, gap: 1, position: "relative", zIndex: 10,
        }}>
          {sortedAvatars.map((c, index) => (
            <CharIconButton key={c.id} char={c} isActive={index === selected} onClick={() => setSelected(index)} />
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
              <Typography sx={{ fontSize: "26px", fontWeight: 900, color: "#f8fafc", lineHeight: 1 }}>
                {sortedAvatars[selected]?.[0] ?? "none"}
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
    </Container>
  );
};

export default Game;
