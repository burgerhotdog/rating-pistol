import { createContext, useState, useEffect, useContext } from 'react';
import { doc, setDoc, updateDoc, deleteField, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '@/contexts';
import { db } from '@/firebase';

export const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const userRef = user ? doc(db, 'users', user.uid) : null;
  const [savedUids, setSavedUids] = useState({});
  const [allPinnedId, setAllPinnedId] = useState({});

  useEffect(() => {
    if (!user) {
      setSavedUids({});
      setAllPinnedId({});
      return;
    };

    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      const userData = snapshot.data() || {};

      setSavedUids(userData.savedUids || {});
      setAllPinnedId(userData.allPinnedId || {});

      // write back missing fields to Firestore
      const missingFields = {};
      if (!userData.email) missingFields.email = String(user.email);
      if (!userData.savedUids) missingFields.savedUids = {};
      if (!userData.allPinnedId) missingFields.allPinnedId = {};

      if (Object.keys(missingFields).length) {
        setDoc(userRef, missingFields, { merge: true })
          .catch(err => {
            console.error('Failed to update missing fields', err);
          });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateSavedUids = async (gameId, uid) => {
    if (savedUids[gameId] === uid) return;

    if (user) {
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
    const isAvatarPinned = allPinnedId[gameId] === avatarId;

    if (user) {
      updateDoc(userRef, { [`allPinnedId.${gameId}`]: isAvatarPinned ? deleteField() : String(avatarId) })
        .catch(err => {
          console.error('Failed to update allPinnedId', err);
        });
      return;
    }

    setAllPinnedId(prev => {
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
        allPinnedId, updatePinnedIds,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
