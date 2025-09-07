import { collection, getDocs } from 'firebase/firestore';
import { db } from '@config/firebase';

export default (gameId, userId) => {
  const ref = collection(db, 'users', userId, gameId);
  return getDocs(ref);
};
