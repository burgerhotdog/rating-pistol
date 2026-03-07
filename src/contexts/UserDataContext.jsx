import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@contexts';
import { firebaseGetUser, firebaseSetUser } from '@/firebase';

export const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  const [savedUids, setSavedUids] = useState({});
  const [pinnedIds, setPinnedIds] = useState({});

  useEffect(() => {
    const importUserData = async () => {
      const snapshot = await firebaseGetUser(userId);
      if (!snapshot) return;

      const data = snapshot.data();
      if (!data) return;

      const newSavedUids = data.savedUids || {};
      const newPinnedIds = data.pinnedIds || {};

      setSavedUids(newSavedUids);
      setPinnedIds(newPinnedIds);
    };

    if (userId) {
      importUserData();
    } else {
      setSavedUids({});
      setPinnedIds({});
    }
  }, [userId]);

  const updateSavedUids = async (gameId, newUid) => {
    if (savedUids[gameId] === newUid)
      return;

    const newSavedUids = { ...savedUids, [gameId]: newUid };
    setSavedUids(newSavedUids);
    if (userId) firebaseSetUser(userId, 'savedUids', newSavedUids);
  };

  const updatePinnedIds = async (gameId, newAvatarId) => {
    if (pinnedIds[gameId] === newAvatarId) return;

    const newPinnedIds = { ...pinnedIds };
    if (!newAvatarId){
      delete newPinnedIds[gameId];
    } else {
      newPinnedIds[gameId] = newAvatarId;
    }

    setPinnedIds(newPinnedIds);
    if (userId)
      firebaseSetUser(userId, 'pinnedIds', newPinnedIds);
  };

  return (
    <UserDataContext.Provider value={{
      savedUids, updateSavedUids,
      pinnedIds, updatePinnedIds,
    }}>
      {children}
    </UserDataContext.Provider>
  );
};
