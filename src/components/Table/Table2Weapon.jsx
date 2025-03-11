import React from "react";
import { Avatar, Badge, Box, Stack, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";

const Table2Weapon = ({
  gameId,
  setModalPipe,
  id,
  data,
}) => {
  const { generalData } = getData[gameId];
  const { weaponIcons } = getIcons[gameId];
  const openModal = () => {
    setModalPipe({
      type: "weapon",
      id,
      data,
    });
  };
  
  if (!data.weaponId) {
    return (
      <Tooltip title={`Add ${generalData.SECTIONS[1]}`} arrow>
        <Add onClick={openModal} cursor="pointer" />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Edit ${generalData.SECTIONS[1]}`} arrow>
      <Badge
        onClick={openModal}
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={`${generalData.WEAPON_RANK_PREFIX}${data.weaponRank}`}
        sx={{ cursor: "pointer" }}
      >
        <Avatar
          variant="square"
          alt={data.weaponId}
          src={weaponIcons[`./${data.weaponId}.webp`]?.default}
        />
      </Badge>
    </Tooltip>
  );
};

export default Table2Weapon;
