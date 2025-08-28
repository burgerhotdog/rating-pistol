import { TableCell, Tooltip, ButtonBase, Box, Avatar, Typography } from '@mui/material';
import { AVATAR_ASSETS } from '@assets';
import { AVATAR_DATA } from '@data';

const AvatarCell = ({ gameId, id, data, setModalPipe }) => {
  const openModal = () => setModalPipe({ type: 'edit', id, data });

  return (
    <TableCell>
      <Tooltip title="Edit Build">
        <ButtonBase onClick={openModal}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar src={AVATAR_ASSETS[gameId][id]} />
            <Typography variant="body2" align="left">
              {AVATAR_DATA[gameId][id].name}
            </Typography>
          </Box>
        </ButtonBase>
      </Tooltip>
    </TableCell>
  );
};

export default AvatarCell;
