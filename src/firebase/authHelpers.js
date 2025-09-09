import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import safeCall from './safeCall';

export const fbSignIn = async () => {
  await safeCall(setPersistence(auth, browserLocalPersistence));
  return safeCall(signInWithPopup(auth, new GoogleAuthProvider()));
};

export const fbSignOut = () => {
  return safeCall(signOut(auth));
};
