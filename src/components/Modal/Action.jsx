import React from "react";
import { Modal, Box, useTheme } from "@mui/material";
import AddModal from "./Add/AddModal";
import DeleteModal from "./Delete/DeleteModal";
import EditModal from "./Edit/EditModal";
import LoadModal from "./Load/LoadModal";
import RatingModal from "./Rating/RatingModal";

const Action = ({
  gameId,
  userId,
  action,
  setAction,
  localDocs,
  setLocalDocs,
}) => {
  const theme = useTheme();
  let modalContent = null;

  switch (action.type) {
    case "add":
      modalContent = (
        <AddModal
          gameId={gameId}
          userId={userId}
          action={action}
          setAction={setAction}
          localDocs={localDocs}
          setLocalDocs={setLocalDocs}
        />
      );
      break;

    case "delete":
      modalContent = (
        <DeleteModal
          gameId={gameId}
          userId={userId}
          action={action}
          setAction={setAction}
          setLocalDocs={setLocalDocs}
        />
      );
      break;

    case "edit":
      modalContent = (
        <EditModal
          gameId={gameId}
          userId={userId}
          action={action}
          setAction={setAction}
          setLocalDocs={setLocalDocs}
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

    default:
      break;
  }

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={Boolean(action.type)} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        {modalContent}
      </Box>
    </Modal>
  );
};

export default Action;
