import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@config/firebase';

export default (gameId, userId, avatarId) => {
  const ref = doc(db, 'users', userId, gameId, String(avatarId));
  return deleteDoc(ref);
};
