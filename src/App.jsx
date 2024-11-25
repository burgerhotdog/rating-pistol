import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase/firebase.js";
import './App.css'

const App = () => {
  const [number, setNumber] = useState(0);
  const docRef = doc(db, "counter", "homepage");

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNumber(docSnap.data().value);
        } else {
          await setDoc(docRef, { value: 0 });
        }
      } catch (error) {
        console.error("Error fetching number:", error);
      }
    };
    fetchNumber();
  }, []);

  const incrementNumber = async () => {
    try {
      await updateDoc(docRef, { value: increment(1) });
      setNumber((prev) => prev + 1);
    } catch (error) {
      console.error("Error incrementing number:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Current Number: {number}</h1>
      <button onClick={incrementNumber} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Increment
      </button>
    </div>
  );
};

export default App;