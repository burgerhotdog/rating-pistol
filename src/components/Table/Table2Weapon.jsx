import React from "react";
import { Box, Stack, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import getData from "../getData";
import getIcons from "../getIcons";

const Table2Weapon = ({
  gameId,
  setAction,
  id,
  data,
}) => {
  const { generalData } = getData[gameId];
  const { weaponIcons } = getIcons[gameId];
  const openModal = () => {
    setAction({
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
      <Box
        component="img"
        onClick={openModal}
        src={weaponIcons[`./${data.weaponId}.webp`]?.default}
        alt={data.weaponId}
        sx={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
      />
    </Tooltip>
  );
};

export default Table2Weapon;
