import { Badge, Avatar, Tooltip, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { WEAPON_ASSETS } from "@assets";
import { WEAPON_DATA, INFO_DATA, LABEL_DATA } from "@data";

const WeaponBody = ({ gameId, setModalPipe, id, data }) => {
  const openModal = () => setModalPipe({ type: "weapon", id, data });
  
  if (!data.weaponId) {
    return (
      <Tooltip title={`Add ${LABEL_DATA[gameId].Weapon}`}>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${LABEL_DATA[gameId].Weapon}`}>
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        <Badge
          onClick={openModal}
          badgeContent={`${INFO_DATA[gameId].PREFIX_WEAPON}${data.weaponRank}`}
        >
          <Avatar
            alt={data.weaponId}
            src={WEAPON_ASSETS[gameId][data.weaponId]}
          />
        </Badge>
        <Typography variant="body2">
          {WEAPON_DATA[gameId][data.weaponId].name}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default WeaponBody;
