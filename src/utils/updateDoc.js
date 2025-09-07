import { doc, setDoc } from 'firebase/firestore';
import { db } from '@config/firebase';

export default (gameId, userId, avatarId, avatarData) => {
  const ref = doc(db, 'users', userId, gameId, String(avatarId));
  return setDoc(ref, avatarData, { merge: true });
};
