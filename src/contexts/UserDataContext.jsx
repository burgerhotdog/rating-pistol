import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@contexts';
import { fbGetUser, fbSetUser } from '@/firebase';

export const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  const [savedUids, setSavedUids] = useState({});

  useEffect(() => {
    const importSavedUids = async () => {
      const snapshot = await fbGetUser(userId);
      if (!snapshot) {
        return;
      }

      const newSavedUids = snapshot.data()?.savedUids;
      if (!newSavedUids) {
        return;
      }

      setSavedUids(newSavedUids);
    };

    if (userId) {
      importSavedUids();
    } else {
      setSavedUids({});
    }
  }, [userId]);

  const updateSavedUids = async (gameId, newUid) => {
    if (savedUids[gameId] === newUid) {
      return;
    }

    const newSavedUids = { ...savedUids, [gameId]: newUid };
    setSavedUids(newSavedUids);

    if (userId) {
      fbSetUser(userId, 'savedUids', newSavedUids);
    }
  };

  return (
    <UserDataContext.Provider value={{ savedUids, updateSavedUids }}>
      {children}
    </UserDataContext.Provider>
  );
};
