import { Modal, Box } from "@mui/material";
import Add from "./Add";
import Avatar from "./Avatar";
import Equip from "./Equip";
import Load from "./Load";
import Rating from "./Rating";
import Weapon from "./Weapon";

const ModalContent = ({
  type,
  gameId,
  userId,
  modalPipe,
  avatarCache,
  setAvatarCache,
  saveAvatar,
  saveAvatarBatch,
  closeModal,
}) => {
  switch (type) {
    case "add":
      return (
        <Add
          gameId={gameId}
          avatarCache={avatarCache}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
    case "avatar":
      return (
        <Avatar
          gameId={gameId}
          modalPipe={modalPipe}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
    case "equip":
      return (
        <Equip
          gameId={gameId}
          modalPipe={modalPipe}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
    case "load":
      return (
        <Load
          gameId={gameId}
          userId={userId}
          setAvatarCache={setAvatarCache}
          saveAvatar={saveAvatar}
          saveAvatarBatch={saveAvatarBatch}
          closeModal={closeModal}
        />
      );
    case "rating":
      return (
        <Rating
          gameId={gameId}
          modalPipe={modalPipe}
        />
      );
    case "weapon":
      return (
        <Weapon
          gameId={gameId}
          modalPipe={modalPipe}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
    default:
      return null;
  }
};

const CustomModal = ({
  gameId,
  userId,
  modalPipe,
  setModalPipe,
  avatarCache,
  setAvatarCache,
  saveAvatar,
  saveAvatarBatch,
}) => {
  const closeModal = () => setModalPipe({});

  return (
    <Modal 
      open={Boolean(modalPipe.type)} 
      onClose={closeModal}
      aria-labelledby="modal-title"
      sx={{ backdropFilter: "blur(4px)" }}
    >
      <Box 
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          maxWidth: "90vw",
          overflow: "auto",
          outline: "none",
          backgroundColor: "background.default",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <ModalContent
          type={modalPipe.type}
          gameId={gameId}
          userId={userId}
          modalPipe={modalPipe}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
          saveAvatar={saveAvatar}
          saveAvatarBatch={saveAvatarBatch}
          closeModal={closeModal}
        />
      </Box>
    </Modal>
  );
};

export default CustomModal;
