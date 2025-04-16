import React from "react";
import { Badge, Avatar, Tooltip, TableCell } from "@mui/material";
import { Add } from "@mui/icons-material";
import { WEAPON_ASSETS } from "@assets";
import { WEAPON_DATA, INFO_DATA, LABEL_DATA } from "@data";

const WeaponCell = ({ gameId, setPipe, id, data }) => {
  const openModal = () => setPipe({ type: "weapon", id, data });
  
  if (!data.weaponId) {
    return (
      <TableCell align="center">
        <Tooltip title={`Add ${LABEL_DATA[gameId].Weapon}`} arrow>
          <Add onClick={openModal} cursor="pointer" />
        </Tooltip>
      </TableCell>
    );
  }

  return (
    <TableCell align="center">
      <Tooltip title={WEAPON_DATA[gameId][data.weaponId].name}>
        <Badge
          onClick={openModal}
          badgeContent={`${INFO_DATA[gameId].PREFIX_WEAPON}${data.weaponRank}`}
        >
          <Avatar
            alt={data.weaponId}
            src={WEAPON_ASSETS[`./${gameId}/${data.weaponId}.webp`]?.default}
          />
        </Badge>
      </Tooltip>
    </TableCell>
  );
};

export default WeaponCell;
