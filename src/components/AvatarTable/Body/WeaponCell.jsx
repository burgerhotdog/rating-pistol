import React from "react";
import { Stack, Badge, Avatar, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import WEAPON_ASSETS from "@assets/dynamic/weapon";
import { INFO, LABELS} from "@data/static";

const WeaponCell = ({ gameId, setPipe, id, data }) => {
  const openModal = () => setPipe({ type: "weapon", id, data });
  
  if (!data.weaponId) {
    return (
      <Tooltip title={`Add ${LABELS[gameId].Weapon}`} arrow>
        <Stack display="inline-flex" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Add onClick={openModal} cursor="pointer" />
        </Stack>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${LABELS[gameId].Weapon}`} arrow>
      <Stack display="inline-flex" sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Badge
          onClick={openModal}
          badgeContent={<strong>{INFO[gameId].PREFIX_WEAPON}{data.weaponRank}</strong>}
          sx={{
            cursor: 'pointer',
            "& .MuiBadge-badge": {
              backgroundColor: "rgba(20, 20, 20, 0.4)",
            },
          }}
        >
          <Avatar
            alt={data.weaponId}
            src={WEAPON_ASSETS[`./${gameId}/${data.weaponId}.webp`]?.default}
          />
        </Badge>
      </Stack>
    </Tooltip>
  );
};

export default WeaponCell;
