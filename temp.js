import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./src/firebase.js";

async function migrateSetIds() {
  const snapshot = await getDocs(collection(db, 'users', 'cwIdUOi6G8d1HkcdmbOu1gszVes2', 'zenless-zone-zero'));
  const batch = writeBatch(db);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (!Array.isArray(data.equipList)) return;

    let changed = false;

    const updatedEquipList = data.equipList.map((equip) => {
      if (
        typeof equip.setId === "string" &&
        equip.setId.length === 3
      ) {
        changed = true;
        return {
          ...equip,
          setId: equip.setId + "00",
        };
      }

      return equip;
    });

    if (changed) {
      batch.update(docSnap.ref, {
        equipList: updatedEquipList,
      });
    }
  });

  await batch.commit();
  console.log("Migration complete.");
}

migrateSetIds().catch(console.error);