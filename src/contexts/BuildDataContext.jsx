import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@contexts';
import { firebaseGetAvatars, firebaseSetEntries, firebaseDeleteAvatar } from '@/firebase';

const GAME_IDS = [
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
];

const buildDataTemplate = () => {
  return Object.fromEntries(GAME_IDS.map(id => [id, {}]));
};

export const BuildDataContext = createContext(null);

export const BuildDataProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  const [buildData, setBuildData] = useState(buildDataTemplate);
  const [isBuildDataLoading, setIsBuildDataLoading] = useState(false);

  // load buildData from Firestore on userId change
  useEffect(() => {
    const initBuildData = async () => {
      setIsBuildDataLoading(true);

      try {
        const results = await Promise.all(
          GAME_IDS.map(async (gameId) => {
            // fetch builds for this gameId
            const snapshot = await firebaseGetAvatars(userId, gameId);
            if (!snapshot) {
              return [gameId, {}];
            }

            // format builds
            const buildsMap = Object.fromEntries(
              snapshot.docs.map(doc => [doc.id, doc.data()])
            );

            return [gameId, buildsMap];
          })
        );

        // convert array into object
        const newBuildData = Object.fromEntries(results);

        setBuildData(newBuildData);
      } catch (err) {
        console.error('Failed to initialize buildData:', err);
        setBuildData(buildDataTemplate());
      } finally {
        setIsBuildDataLoading(false);
      }
    };

    if (userId) {
      initBuildData();
    } else {
      setBuildData(buildDataTemplate());
    }
  }, [userId]);

  const saveBuildEntries = async (gameId, entries) => {
    const entriesWithTimestamps = entries.map(([avatarId, avatarData]) => [
      avatarId,
      {
        ...avatarData,
        lastUpdated: new Date().toISOString(),
      }
    ]);

    if (userId) firebaseSetEntries(userId, gameId, entriesWithTimestamps);
    setBuildData(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        ...Object.fromEntries(entriesWithTimestamps),
      },
    }));
  };

  const deleteBuildEntry = async (gameId, avatarId) => {
    if (userId) firebaseDeleteAvatar(userId, gameId, avatarId);
    setBuildData(prev => {
      const newBuildData = { ...prev };
      delete newBuildData[gameId][avatarId];
      return newBuildData;
    });
  };

  return (
    <BuildDataContext.Provider
      value={{
        buildData,
        saveBuildEntries,
        deleteBuildEntry,
        isBuildDataLoading,
      }}
    >
      {children}
    </BuildDataContext.Provider>
  );
};
