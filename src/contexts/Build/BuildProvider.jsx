import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { BuildContext, useAuth } from '@/contexts';

const GAME_PATHS = [
  'genshin-impact',
  'honkai-star-rail',
  'wuthering-waves',
  'zenless-zone-zero',
];

export const BuildProvider = ({ children }) => {
  const { user } = useAuth();
  const [buildCollections, setBuildCollections] = useState({});

  useEffect(() => {
    if (!user) {
      setBuildCollections({});
      return;
    }

    const unsubscribes = GAME_PATHS.map(gameId => {
      const ref = collection(db, 'users', user.uid, gameId);
      return onSnapshot(ref, snapshot => {
        setBuildCollections(prev => ({
          ...prev,
          [gameId]: Object.fromEntries(snapshot.docs.map(doc => [
            doc.id,
            doc.data(),
          ])),
        }));
      });
    });

    return () => unsubscribes.forEach(fn => fn());
  }, [user]);


  const saveBuildEntries = async (gameId, entries) => {
    const entriesWithTimes = entries.map(([id, data]) => [
      id,
      { ...data, lastUpdated: new Date().toISOString() },
    ]);

    if (user) {
      if (entriesWithTimes.length === 1) {
        const [id, data] = entriesWithTimes[0];
        const ref = doc(db, 'users', user.uid, gameId, String(id));
        setDoc(ref, data)
          .catch(err => console.error(err));
      } else {
        const batch = writeBatch(db);
        entriesWithTimes.forEach(([id, data]) => {
          const ref = doc(db, 'users', user.uid, gameId, String(id));
          batch.set(ref, data);
        });
        batch.commit()
          .catch(err => console.error(err));
      }
    } else {
      setBuildCollections(prev => ({
        ...prev,
        [gameId]: {
          ...prev[gameId],
          ...Object.fromEntries(entriesWithTimes),
        },
      }));
    }
  };

  const deleteBuildId = async (gameId, id) => {
    if (user) {
      const ref = doc(db, 'users', user.uid, gameId, String(id));
      deleteDoc(ref)
        .catch(err => console.error(err));
    } else {
      setBuildCollections(prev => {
        const newCollection = { ...prev[gameId] };
        delete newCollection[id];
        return { ...prev, [gameId]: newCollection };
      });
    }
  };

  return (
    <BuildContext.Provider
      value={{
        buildCollections,
        saveBuildEntries,
        deleteBuildId,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
};
