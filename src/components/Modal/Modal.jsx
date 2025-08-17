import { Modal, Box } from '@mui/material';
import Add from './Add';
import Load from './Load';
import Edit from './Edit';
import Rating from './Rating';

const ModalContent = ({
  type,
  gameId,
  userId,
  modalPipe,
  avatarCache,
  saveAvatar,
  saveAvatarBatch,
  deleteAvatar,
  closeModal,
}) => {
  switch (type) {
    case 'add':
      return (
        <Add
          gameId={gameId}
          avatarCache={avatarCache}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
        />
      );
    case 'edit':
      return (
        <Edit
          gameId={gameId}
          modalPipe={modalPipe}
          saveAvatar={saveAvatar}
          closeModal={closeModal}
          deleteAvatar={deleteAvatar}
        />
      );
    case 'load':
      return (
        <Load
          gameId={gameId}
          userId={userId}
          saveAvatar={saveAvatar}
          saveAvatarBatch={saveAvatarBatch}
          closeModal={closeModal}
        />
      );
    case 'rating':
      return (
        <Rating
          gameId={gameId}
          modalPipe={modalPipe}
        />
      );
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
  deleteAvatar,
}) => {
  const closeModal = () => {
    setModalPipe({});
  }

  return (
    <Modal 
      open={Boolean(modalPipe.type)}
      onClose={closeModal}
      sx={{ backdropFilter: 'blur(4px)' }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        maxWidth: '90vw',
        overflow: 'auto',
        outline: 'none',
        backgroundColor: 'background.default',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <ModalContent
          type={modalPipe.type}
          gameId={gameId}
          userId={userId}
          modalPipe={modalPipe}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
          saveAvatar={saveAvatar}
          saveAvatarBatch={saveAvatarBatch}
          deleteAvatar={deleteAvatar}
          closeModal={closeModal}
        />
      </Box>
    </Modal>
  );
};

export default CustomModal;
