import { createContext, useState, useEffect, useContext } from 'react';
import { doc, setDoc, updateDoc, deleteField, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '@contexts';
import { db } from '@/firebase';

export const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { userId, userEmail } = useContext(AuthContext);
  const userRef = userId ? doc(db, 'users', userId) : null;
  const [savedUids, setSavedUids] = useState({});
  const [pinnedIds, setPinnedIds] = useState({});

  useEffect(() => {
    if (!userId) {
      setSavedUids({});
      setPinnedIds({});
      return;
    };

    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      const userData = snapshot.data() || {};

      setSavedUids(userData.savedUids || {});
      setPinnedIds(userData.pinnedIds || {});

      // write back missing fields to Firestore
      const missingFields = {};
      if (!userData.email) missingFields.email = String(userEmail);
      if (!userData.savedUids) missingFields.savedUids = {};
      if (!userData.pinnedIds) missingFields.pinnedIds = {};

      if (Object.keys(missingFields).length) {
        setDoc(userRef, missingFields, { merge: true })
          .catch(err => {
            console.error('Failed to update missing fields', err);
          });
      }
    });

    return unsubscribe;
  }, [userId]);

  const updateSavedUids = async (gameId, uid) => {
    if (savedUids[gameId] === uid) return;

    if (userId) {
      updateDoc(userRef, { [`savedUids.${gameId}`]: String(uid) })
        .catch(err => {
          console.error('Failed to update savedUids', err);
        });
      return;
    }

    setSavedUids(prev => ({
      ...prev,
      [gameId]: uid,
    }));
  };

  const updatePinnedIds = async (gameId, avatarId) => {
    const isAvatarPinned = pinnedIds[gameId] === avatarId;

    if (userId) {
      updateDoc(userRef, { [`pinnedIds.${gameId}`]: isAvatarPinned ? deleteField() : String(avatarId) })
        .catch(err => {
          console.error('Failed to update pinnedIds', err);
        });
      return;
    }

    setPinnedIds(prev => {
      const newState = { ...prev };
      if (isAvatarPinned) delete newState[gameId];
      else newState[gameId] = avatarId;
      return newState;
    });
  };

  return (
    <UserDataContext.Provider
      value={{
        savedUids, updateSavedUids,
        pinnedIds, updatePinnedIds,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
