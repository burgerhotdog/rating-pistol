import { Avatar, Tooltip, Stack, Typography } from "@mui/material";
import { AVATAR_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";

const AvatarBody = ({ gameId, id, data, setModalPipe }) => {
  const openModal = () =>
    setModalPipe({
      type: "equip",
      id,
      data,
    });

  return (
    <Tooltip title="Edit Build">
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        <Avatar
          alt={AVATAR_DATA[gameId][id].name}
          src={AVATAR_ASSETS[gameId][id].icon}
        />
        <Typography variant="body2">
          {AVATAR_DATA[gameId][id].name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default AvatarBody;
