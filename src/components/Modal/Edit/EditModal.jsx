import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  Stack,
  Button,
} from "@mui/material";
import EditAvatar from "./Avatar/EditAvatar";
import EditWeapon from "./Weapon/EditWeapon";
import EditEquipList from "./EquipList/EditEquipList";

const EditModal = ({
  gameId,
  userId,
  action,
  setAction,
  setLocalDocs,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    if (userId) {
      const infoDocRef = doc(db, "users", userId, gameId, action.id);
      await setDoc(infoDocRef, action.data, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [action.id]: action.data,
    }));

    setIsLoading(false);
    setAction({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      {action?.item === "avatar" ? (
        <EditAvatar
          gameId={gameId}
          action={action}
          setAction={setAction}
        />
      ) : action?.item === "weapon" ? (
        <EditWeapon
          gameId={gameId}
          action={action}
          setAction={setAction}
        />
      ) : action?.item === "equipList" && (
        <EditEquipList
          gameId={gameId}
          action={action}
          setAction={setAction}
        />
      )}
      <Button
        onClick={handleSave}
        loading={isLoading}
        variant="contained"
      >
        Save
      </Button>
    </Stack>
  );
};

export default EditModal;
