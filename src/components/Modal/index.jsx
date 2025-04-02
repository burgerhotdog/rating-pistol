import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Modal, Box, useTheme } from "@mui/material";
import AddModal from "./Add";
import AvatarModal from "./Avatar";
import EquipModal from "./Equip";
import LoadModal from "./Load";
import RatingModal from "./Rating";
import WeaponModal from "./Weapon";

export default ({
  gameId,
  userId,
  pipe,
  setPipe,
  localDocs,
  setLocalDocs,
}) => {
  const theme = useTheme();

  const savePipe = async () => {
    const { id, data } = pipe;

    if (userId) {
      const reference = doc(db, "users", userId, gameId, id);
      await setDoc(reference, data, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  let modalContent = null;
  switch (pipe.type) {
    case "add":
      modalContent = (
        <AddModal
          gameId={gameId}
          localDocs={localDocs}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "avatar":
      modalContent = (
        <AvatarModal
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "equip":
      modalContent = (
        <EquipModal
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "load":
      modalContent = (
        <LoadModal
          gameId={gameId}
          userId={userId}
          setPipe={setPipe}
          setLocalDocs={setLocalDocs}
        />
      );
      break;

    case "rating":
      modalContent = (
        <RatingModal
          gameId={gameId}
          pipe={pipe}
        />
      );
      break;

    case "weapon":
      modalContent = (
        <WeaponModal
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;
  }

  return (
    <Modal open={Boolean(pipe.type)} onClose={() => setPipe({})}>
      <Box sx={theme.customStyles.modal}>
        {modalContent}
      </Box>
    </Modal>
  );
};
