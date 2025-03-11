import React from "react";
import { Modal, Box, useTheme } from "@mui/material";
import AddModal from "./Add/AddModal";
import AvatarModal from "./Avatar/AvatarModal";
import EquipModal from "./Equip/EquipModal";
import LoadModal from "./Load/LoadModal";
import RatingModal from "./Rating/RatingModal";
import WeaponModal from "./Weapon/WeaponModal";

const Action = ({
  gameId,
  userId,
  action,
  setAction,
  localDocs,
  setLocalDocs,
}) => {
  const theme = useTheme();

  const saveAction = async (id, data) => {
    if (userId) {
      const docRef = doc(db, "users", userId, gameId, id);
      await setDoc(docRef, data, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  const closeAction = () => {
    setAction({});
  };

  let modalContent = null;
  switch (action.type) {
    case "add":
      modalContent = (
        <AddModal
          gameId={gameId}
          localDocs={localDocs}
          saveAction={saveAction}
          closeAction={closeAction}
        />
      );
      break;

    case "avatar":
      modalContent = (
        <AvatarModal
          gameId={gameId}
          action={action}
          setAction={setAction}
          saveAction={saveAction}
        />
      );
      break;

    case "equip":
      modalContent = (
        <EquipModal
          gameId={gameId}
          action={action}
          setAction={setAction}
          saveAction={saveAction}
        />
      );
      break;

    case "load":
      modalContent = (
        <LoadModal
          gameId={gameId}
          userId={userId}
          setAction={setAction}
          setLocalDocs={setLocalDocs}
          saveAction={saveAction}
          closeAction={closeAction}
        />
      );
      break;

    case "rating":
      modalContent = (
        <RatingModal
          gameId={gameId}
          action={action}
        />
      );
      break;

    case "weapon":
      modalContent = (
        <WeaponModal
          gameId={gameId}
          action={action}
          setAction={setAction}
          saveAction={saveAction}
        />
      );
      break;
  }

  return (
    <Modal open={Boolean(action.type)} onClose={closeAction}>
      <Box sx={theme.customStyles.modal}>
        {modalContent}
      </Box>
    </Modal>
  );
};

export default Action;
