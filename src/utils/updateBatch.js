import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@config/firebase';

export default (gameId, userId, entries) => {
  const batch = writeBatch(db);
  for (const [avatarId, avatarData] of entries) {
    const ref = doc(db, 'users', userId, gameId, String(avatarId));
    batch.set(ref, avatarData);
  }
  return batch.commit();
};
