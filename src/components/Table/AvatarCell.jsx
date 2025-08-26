import { Avatar, Tooltip, Stack, Typography, TableCell, ButtonBase } from '@mui/material';
import { AVATAR_ASSETS } from '@assets';
import { AVATAR_DATA } from '@data';

const AvatarCell = ({ gameId, id, data, setModalPipe }) => {
  const openModal = () => setModalPipe({ type: 'edit', id, data });

  return (
    <TableCell>
      <Tooltip title="Edit Build">
        <ButtonBase onClick={openModal}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={AVATAR_ASSETS[gameId][id]} />
            <Typography variant="body2">
              {AVATAR_DATA[gameId][id].name}
            </Typography>
          </Stack>
        </ButtonBase>
      </Tooltip>
    </TableCell>
  );
};

export default AvatarCell;
