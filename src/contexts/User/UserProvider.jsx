import { useEffect, useState } from 'react';
import { deleteField, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { UserContext, useAuth } from '@/contexts';

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [savedUids, setSavedUids] = useState({});
  const [pinnedIds, setPinnedIds] = useState({});

  const ref = user ? doc(db, 'users', user.uid) : null;

  useEffect(() => {
    if (!user) {
      setSavedUids({});
      setPinnedIds({});
      return;
    };

    const unsubscribe = onSnapshot(ref, async (snapshot) => {
      const userData = snapshot.data() ?? {};
      setSavedUids(userData['saved-uids'] ?? {});
      setPinnedIds(userData['pinned-ids'] ?? {});

      // write back missing fields to Firestore
      const missing = {};
      if (!userData.email) missing.email = String(user.email);
      if (!userData['saved-uids']) missing['saved-uids'] = {};
      if (!userData['pinned-ids']) missing['pinned-ids'] = {};

      if (Object.keys(missing).length) {
        setDoc(ref, missing, { merge: true })
          .catch(err => console.error(err));
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateSavedUids = async (gameId, uid) => {
    if (savedUids[gameId] === uid) return;

    if (user) {
      updateDoc(ref, { [`saved-uids.${gameId}`]: String(uid) })
        .catch(err => console.error(err));
    } else {
      setSavedUids(prev => ({
        ...prev,
        [gameId]: uid,
      }));
    }
  };

  const updatePinnedIds = async (gameId, id) => {
    const isPinned = pinnedIds[gameId] === id;
    const op = isPinned ? deleteField() : String(id);

    if (user) {
      updateDoc(ref, { [`pinned-ids.${gameId}`]: op })
        .catch(err => console.error(err));
    } else {
      setPinnedIds(prev => {
        const newState = { ...prev };
        if (isPinned) delete newState[gameId];
        else newState[gameId] = id;
        return newState;
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        savedUids,
        pinnedIds,
        updateSavedUids,
        updatePinnedIds,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
