import { createContext, useState, useEffect, useContext } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { AuthContext } from '@/contexts';
import { db } from '@/firebase';

const GAME_IDS = [
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
];

const buildDatasTemplate = () => {
  return Object.fromEntries(GAME_IDS.map(id => [id, {}]));
};

export const BuildDataContext = createContext(null);

export const BuildDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [buildDatas, setBuildDatas] = useState(buildDatasTemplate);
  const [isBuildDatasLoading, setIsBuildDatasLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBuildDatas(buildDatasTemplate());
      return;
    }

    const unsubscribes = GAME_IDS.map(gameId => {
      const ref = collection(db, 'users', user.uid, gameId);

      return onSnapshot(ref, snapshot => {
        const buildsMap = Object.fromEntries(snapshot.docs.map(doc => [doc.id, doc.data()]));

        setBuildDatas(prev => ({ ...prev, [gameId]: buildsMap }));
      });
    });

    return () => unsubscribes.forEach(fn => fn());
  }, [user]);


  const saveBuildEntries = async (gameId, entries) => {
    const entriesWithTimestamps = entries.map(([avatarId, avatarData]) => [
      avatarId,
      { ...avatarData, lastUpdated: new Date().toISOString() },
    ]);

    if (user) {
      if (entriesWithTimestamps.length === 1) {
        const [avatarId, avatarData] = entriesWithTimestamps[0];
        const ref = doc(db, 'users', user.uid, gameId, String(avatarId));
        setDoc(ref, avatarData).catch(err =>
          console.error('Failed to save build: ', err)
        );
      } else {
        const batch = writeBatch(db);
        entriesWithTimestamps.forEach(([avatarId, avatarData]) => {
          const ref = doc(db, 'users', user.uid, gameId, String(avatarId));
          batch.set(ref, avatarData);
        });
        batch.commit().catch(err =>
          console.error('Failed to save builds: ', err)
        );
      }
      return;
    }

    setBuildDatas(prev => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        ...Object.fromEntries(entriesWithTimestamps),
      },
    }));
  };

  const deleteBuildEntry = async (gameId, avatarId) => {
    if (user) {
      const ref = doc(db, 'users', user.uid, gameId, String(avatarId));
      deleteDoc(ref).catch(err =>
        console.error('Failed to delete build: ', err)
      );
      return;
    }

    setBuildDatas(prev => {
      const newGameData = { ...prev[gameId] };
      delete newGameData[avatarId];
      return { ...prev, [gameId]: newGameData };
    });
  };

  return (
    <BuildDataContext.Provider
      value={{
        buildDatas,
        saveBuildEntries,
        deleteBuildEntry,
        isBuildDatasLoading,
      }}
    >
      {children}
    </BuildDataContext.Provider>
  );
};
