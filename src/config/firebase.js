import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkonhnZ-TKiAuZ8uJvgWRubSfn4O9SkVk",
  authDomain: "rating-pistol.firebaseapp.com",
  projectId: "rating-pistol",
  storageBucket: "rating-pistol.firebasestorage.app",
  messagingSenderId: "604469861343",
  appId: "1:604469861343:web:d705d2e18b0eae02aac26a",
  measurementId: "G-D6P2JLVE80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
