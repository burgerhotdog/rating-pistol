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
      type: "edit",
      item: "weapon",
      id,
      data,
    });
  };

  return (
    <Tooltip title={`Edit ${generalData.SECTIONS[1]}`} arrow>
      {data.weaponId ? (
        <Box
          onClick={openModal}
          component="img"
          alt={data.weaponId}
          src={weaponIcons[`./${data.weaponId}.webp`]?.default}
          sx={{ width: 50, height: 50, cursor: "pointer" }}
        />
      ) : (
        <Add onClick={openModal} cursor="pointer" />
      )}
    </Tooltip>
  );
};

export default Table2Weapon;
