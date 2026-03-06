import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@contexts';
import { fbGetUser, fbGetAvatars, fbSetAvatar, fbSetAvatarBatch, fbDeleteAvatar } from '@/firebase';

const GAME_IDS = [
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
];

const createBuildCacheTemplate = () => {
  return Object.fromEntries(GAME_IDS.map(id => [id, {}]));
};

export const BuildContext = createContext(null);

export const BuildProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  const [buildCache, setBuildCache] = useState(createBuildCacheTemplate);
  const [isBuildCacheLoading, setIsBuildCacheLoading] = useState(false);

  useEffect(() => {
    const initBuildCache = async () => {
      setIsBuildCacheLoading(true);

      try {
        const results = await Promise.all(
          GAME_IDS.map(async (gameId) => {
            const snapshot = await fbGetAvatars(userId, gameId);

            if (!snapshot) {
              return [gameId, {}];
            }

            const cache = Object.fromEntries(
              snapshot.docs.map(doc => [doc.id, doc.data()])
            );

            return [gameId, cache];
          })
        );

        // Convert array of [gameId, data] into object
        const newBuildCache = Object.fromEntries(results);

        setBuildCache(newBuildCache);
      } catch (err) {
        console.error('Failed to initialize buildCache:', err);
        setBuildCache(createBuildCacheTemplate());
      } finally {
        setIsBuildCacheLoading(false);
      }
    };

    if (userId) {
      initBuildCache();
    } else {
      setBuildCache(createBuildCacheTemplate());
    }
  }, [userId]);

  const saveAvatarBatch = async (gameId, entries) => {
    const entriesWithTimestamps = entries.map(([id, data]) => [
      id,
      {
        ...data,
        lastUpdated: new Date().toISOString(),
      }
    ]);

    if (userId) fbSetAvatarBatch(userId, gameId, entriesWithTimestamps);
    setBuildCache(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        ...Object.fromEntries(entriesWithTimestamps),
      },
    }));
  };

  return (
    <BuildContext.Provider
      value={{
        buildCache,
        saveAvatarBatch,
        isBuildCacheLoading,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
};
