import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import safeCall from './safeCall';

// user
export const firebaseGetUser = (userId) => {
  const ref = doc(db, 'users', userId);
  return safeCall(getDoc(ref));
};

export const firebaseSetUser = (userId, key, value) => {
  const ref = doc(db, 'users', userId);
  return safeCall(setDoc(ref, { [key]: value }, { merge: true }));
};

// star
export const firebaseAddStar = (userId, gameId, avatarId) => {
  const ref = doc(db, "users", userId);
  return safeCall(updateDoc(ref, { [`${gameId}_starred`]: arrayUnion(avatarId) }));
};

export const firebaseDelStar = (userId, gameId, avatarId) => {
  const ref = doc(db, "users", userId);
  return safeCall(updateDoc(ref, { [`${gameId}_starred`]: arrayRemove(avatarId) }));
};

// avatar
export const firebaseGetAvatars = (userId, gameId) => {
  const ref = collection(db, 'users', userId, gameId);
  return safeCall(getDocs(ref));
};

export const firebaseSetEntries = (userId, gameId, entries) => {
  if (entries.length === 1) {
    const [avatarId, avatarData] = entries[0];
    const ref = doc(db, 'users', userId, gameId, String(avatarId));
    return safeCall(setDoc(ref, avatarData));
  }

  const batch = writeBatch(db);
  entries.forEach(([avatarId, avatarData]) => {
    const ref = doc(db, 'users', userId, gameId, String(avatarId));
    batch.set(ref, avatarData);
  });
  return safeCall(batch.commit());
};

export const firebaseDeleteAvatar = (userId, gameId, avatarId) => {
  const ref = doc(db, 'users', userId, gameId, String(avatarId));
  return safeCall(deleteDoc(ref));
};
