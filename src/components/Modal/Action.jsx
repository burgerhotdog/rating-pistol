import React from "react";
import {
  Modal,
  Box,
  useTheme,
} from "@mui/material";
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
  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={Boolean(action.type)} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        {action?.type === "add" ? (
          <AddModal
            gameId={gameId}
            userId={userId}
            action={action}
            setAction={setAction}
            localDocs={localDocs}
            setLocalDocs={setLocalDocs}
          />
        ) : action?.type === "delete" ? (
          <DeleteModal
            gameId={gameId}
            userId={userId}
            action={action}
            setAction={setAction}
            setLocalDocs={setLocalDocs}
          />
        ) : action?.type === "edit" ? (
          <EditModal
            gameId={gameId}
            userId={userId}
            action={action}
            setAction={setAction}
            setLocalDocs={setLocalDocs}
          />
        ) : action?.type === "load" ? (
          <LoadModal
            gameId={gameId}
            userId={userId}
            setAction={setAction}
            setLocalDocs={setLocalDocs}
          />
        ) : action?.type === "rating" ? (
          <RatingModal
            gameId={gameId}
            action={action}
          />
        ) : null}
      </Box>
    </Modal>
  );
};

export default Action;
