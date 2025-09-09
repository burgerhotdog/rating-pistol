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
export const fbGetUser = (userId) => {
  const ref = doc(db, 'users', userId);
  return safeCall(getDoc(ref));
};

export const fbSetUser = (userId, key, value) => {
  const ref = doc(db, 'users', userId);
  return safeCall(setDoc(ref, { [key]: value }, { merge: true }));
};

// star
export const fbAddStar = (userId, gameId, avatarId) => {
  const ref = doc(db, "users", userId);
  return safeCall(updateDoc(ref, { [`${gameId}_starred`]: arrayUnion(avatarId) }));
};

export const fbDelStar = (userId, gameId, avatarId) => {
  const ref = doc(db, "users", userId);
  return safeCall(updateDoc(ref, { [`${gameId}_starred`]: arrayRemove(avatarId) }));
};

// avatar
export const fbGetAvatars = (userId, gameId) => {
  const ref = collection(db, 'users', userId, gameId);
  return safeCall(getDocs(ref));
};

export const fbSetAvatar = (userId, gameId, avatarId, avatarData) => {
  const ref = doc(db, 'users', userId, gameId, String(avatarId));
  return safeCall(setDoc(ref, avatarData, { merge: true }));
};

export const fbSetAvatarBatch = (userId, gameId, entries) => {
  const batch = writeBatch(db);
  entries.forEach(([avatarId, avatarData]) => {
    const ref = doc(db, 'users', userId, gameId, String(avatarId));
    batch.set(ref, avatarData);
  });
  return safeCall(batch.commit());
};

export const fbDeleteAvatar = (userId, gameId, avatarId) => {
  const ref = doc(db, 'users', userId, gameId, String(avatarId));
  return safeCall(deleteDoc(ref));
};
