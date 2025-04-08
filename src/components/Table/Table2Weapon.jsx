import React from "react";
import { Stack, Badge, Avatar, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";
import WEAPON_ASSETS from "@assets/dynamic/weapon";
import INFO from "@data/static/info";

const Table2Weapon = ({ gameId, setPipe, id, data }) => {
  const openModal = () => setPipe({ type: "weapon", id, data });
  
  if (!data.weaponId) {
    return (
      <Tooltip title="Add" arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Edit" arrow>
      <Stack display="inline-flex">
        <Badge
          onClick={openModal}
          badgeContent={<strong>{INFO[gameId].PREFIX_WEAPON}{data.weaponRank}</strong>}
          sx={{
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

export default Table2Weapon;
