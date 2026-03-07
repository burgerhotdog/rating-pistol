import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import safeCall from './safeCall';

export async function firebaseSignIn() {
  await safeCall(setPersistence(auth, browserLocalPersistence));
  return safeCall(signInWithPopup(auth, new GoogleAuthProvider()));
};

export async function firebaseSignOut() {
  return safeCall(signOut(auth));
};
