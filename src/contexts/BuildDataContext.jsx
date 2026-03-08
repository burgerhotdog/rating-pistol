import { createContext, useState, useEffect, useContext } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { AuthContext } from '@contexts';
import { db } from '@/firebase';

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

  useEffect(() => {
    if (!userId) {
      setBuildData({});
      return;
    }

    const unsubscribes = GAME_IDS.map(gameId => {
      const ref = collection(db, 'users', userId, gameId);

      return onSnapshot(ref, snapshot => {
        const buildsMap = Object.fromEntries(snapshot.docs.map(doc => [doc.id, doc.data()]));

        setBuildData(prev => ({ ...prev, [gameId]: buildsMap }));
      });
    });

    return () => unsubscribes.forEach(fn => fn());
  }, [userId]);


  const saveBuildEntries = async (gameId, entries) => {
    const entriesWithTimestamps = entries.map(([avatarId, avatarData]) => [
      avatarId,
      { ...avatarData, lastUpdated: new Date().toISOString() },
    ]);

    if (userId) {
      if (entriesWithTimestamps.length === 1) {
        const [avatarId, avatarData] = entriesWithTimestamps[0];
        const ref = doc(db, 'users', userId, gameId, String(avatarId));
        setDoc(ref, avatarData).catch(err =>
          console.error('Failed to save build: ', err)
        );
      } else {
        const batch = writeBatch(db);
        entriesWithTimestamps.forEach(([avatarId, avatarData]) => {
          const ref = doc(db, 'users', userId, gameId, String(avatarId));
          batch.set(ref, avatarData);
        });
        batch.commit().catch(err =>
          console.error('Failed to save builds: ', err)
        );
      }
      return;
    }

    setBuildData(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        ...Object.fromEntries(entriesWithTimestamps),
      },
    }));
  };

  const deleteBuildEntry = async (gameId, avatarId) => {
    if (userId) {
      const ref = doc(db, 'users', userId, gameId, String(avatarId));
      deleteDoc(ref).catch(err =>
        console.error('Failed to delete build: ', err)
      );
      return;
    }

    setBuildData(prev => {
      const newGameData = { ...prev[gameId] };
      delete newGameData[avatarId];
      return { ...prev, [gameId]: newGameData };
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
