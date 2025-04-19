import { Modal, Box } from "@mui/material";
import Add from "./Add";
import Avatar from "./Avatar";
import Equip from "./Equip";
import Load from "./Load";
import Rating from "./Rating";
import Weapon from "./Weapon";

const CustomModal = ({
  gameId,
  userId,
  modalPipe,
  setModalPipe,
  avatarCache,
  setAvatarCache,
  saveAvatar,
}) => {
  const closeModal = () => setModalPipe({});
  let modalContent = null;
  switch (modalPipe.type) {
    case "add":
      modalContent = (
        <Add
          gameId={gameId}
          avatarCache={avatarCache}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
      break;

    case "avatar":
      modalContent = (
        <Avatar
          gameId={gameId}
          modalPipe={modalPipe}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
      break;

    case "equip":
      modalContent = (
        <Equip
          gameId={gameId}
          modalPipe={modalPipe}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
      break;

    case "load":
      modalContent = (
        <Load
          gameId={gameId}
          userId={userId}
          setAvatarCache={setAvatarCache}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
      break;

    case "rating":
      modalContent = (
        <Rating
          gameId={gameId}
          modalPipe={modalPipe}
        />
      );
      break;

    case "weapon":
      modalContent = (
        <Weapon
          gameId={gameId}
          modalPipe={modalPipe}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
      break;
  }

  return (
    <Modal open={Boolean(modalPipe.type)} onClose={closeModal}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "background.paper",
        p: 4,
        borderRadius: 2,
        maxHeight: "90vh",
        maxWidth: "90vw",
        overflow: "auto",
      }}>
        {modalContent}
      </Box>
    </Modal>
  );
};

export default CustomModal;
